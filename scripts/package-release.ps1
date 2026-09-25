param(
  [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]*\.zip$')]
  [string]$ArchiveName = 'Kitty-Corp-Website-Fresh.zip'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'outputs'))
if (-not $outputRoot.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'The release output must stay inside this project.'
}
[System.IO.Directory]::CreateDirectory($outputRoot) | Out-Null
$archivePath = Join-Path $outputRoot $ArchiveName

$directories = @('app', 'build', 'components', 'db', 'drizzle', 'hooks', 'lib', 'public', 'scripts', 'supabase', 'vendor')
$rootFiles = @('.env.example', '.gitignore', '.npmrc', '.openai/hosting.json', 'START-HERE.md', 'README.md', 'VERIFICATION.md', 'cloudflare-env.d.ts', 'components.json', 'drizzle.config.ts', 'eslint.config.mjs', 'netlify.toml', 'next.config.ts', 'package-lock.json', 'package.json', 'postcss.config.mjs', 'tsconfig.json', 'vercel.json', 'vite.config.ts')
$sourceFiles = [System.Collections.Generic.List[string]]::new()
foreach ($directory in $directories) {
  Get-ChildItem -LiteralPath (Join-Path $projectRoot $directory) -Recurse -File | ForEach-Object { $sourceFiles.Add($_.FullName) }
}
foreach ($file in $rootFiles) {
  $fullPath = Join-Path $projectRoot $file
  if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) { throw "Required release file missing: $file" }
  $sourceFiles.Add($fullPath)
}

$privateEnvPath = Join-Path $projectRoot '.env.local'
$privateEnv = if (Test-Path -LiteralPath $privateEnvPath) { [System.IO.File]::ReadAllText($privateEnvPath) } else { '' }
$gatewaySecret = [regex]::Match($privateEnv, '(?m)^FEEDBACK_GATEWAY_TOKEN=(.+)$').Groups[1].Value.Trim()
foreach ($file in $sourceFiles) {
  if ([System.IO.Path]::GetExtension($file) -in @('.png', '.mp4')) { continue }
  $content = [System.IO.File]::ReadAllText($file)
  if ($gatewaySecret.Length -gt 20 -and $content.Contains($gatewaySecret)) { throw "A private credential was found in release source: $file" }
}

$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::ReadWrite)
$zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in ($sourceFiles | Sort-Object -Unique)) {
    $relative = [System.IO.Path]::GetRelativePath($projectRoot, $file).Replace('\', '/')
    if ($relative.StartsWith('../') -or $relative -eq '.env.local') { throw 'Unsafe archive entry.' }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file, "kitty-corp/$relative", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $zip.Dispose(); $stream.Dispose() }

$verify = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  $entries = @($verify.Entries.FullName)
  foreach ($required in @('app/page.tsx','app/admins/page.tsx','app/contact/page.tsx','public/brand/reveal.mp4','public/brand/monogram.png','supabase/schema.sql','supabase/auth-and-limits.sql','package.json','package-lock.json','.env.example','START-HERE.md')) {
    if ($entries -notcontains "kitty-corp/$required") { throw "Archive verification failed: $required" }
  }
  if ($entries | Where-Object { $_ -match '(^|/)(node_modules|\.git|\.next|\.env\.local)(/|$)' }) { throw 'Archive contains private or generated files.' }
  foreach ($entry in $verify.Entries) {
    $inputStream = $entry.Open()
    try { $inputStream.CopyTo([System.IO.Stream]::Null) } finally { $inputStream.Dispose() }
  }
  $count = $verify.Entries.Count
} finally { $verify.Dispose() }

$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
$hashFileName = [System.IO.Path]::GetFileNameWithoutExtension($ArchiveName) + '.sha256'
[System.IO.File]::WriteAllText((Join-Path $outputRoot $hashFileName), "$hash  $ArchiveName`n")
[pscustomobject]@{ File = $archivePath; Entries = $count; Bytes = (Get-Item -LiteralPath $archivePath).Length; SHA256 = $hash } | ConvertTo-Json
