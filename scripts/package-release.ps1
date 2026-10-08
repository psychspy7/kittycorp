param(
  [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]*\.zip$')]
  [string]$ArchiveName = 'Kitty-Corp-Website-Fresh.zip'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'outputs'))
if (-not $outputRoot.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'The release output must stay inside this project.'
}
[System.IO.Directory]::CreateDirectory($outputRoot) | Out-Null
$archivePath = Join-Path $outputRoot $ArchiveName

$directories = @('app', 'build', 'components', 'db', 'drizzle', 'hooks', 'integrations', 'lib', 'public', 'scripts', 'supabase', 'vendor')
if (Test-Path -LiteralPath (Join-Path $projectRoot 'handover') -PathType Container) { $directories += 'handover' }
$rootFiles = @('.env.example', '.gitignore', '.npmrc', '.openai/hosting.json', 'AGENTS.md', 'CLAUDE.md', 'GOOGLE_STUDIO_SETUP.md', 'START-HERE.md', 'OWNER-GUIDE.md', 'README.md', 'VERIFICATION.md', 'cloudflare-env.d.ts', 'components.json', 'drizzle.config.ts', 'eslint.config.mjs', 'netlify.toml', 'next.config.ts', 'package-lock.json', 'package.json', 'postcss.config.mjs', 'proxy.ts', 'tsconfig.json', 'vercel.json', 'vite.config.ts')
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
$privateValues = @([regex]::Matches($privateEnv, '(?m)^([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PRIVATE|SERVICE_ROLE)[A-Z0-9_]*)=(.+)$') | ForEach-Object { $_.Groups[2].Value.Trim().Trim('"').Trim("'") } | Where-Object { $_.Length -gt 12 })
foreach ($file in $sourceFiles) {
  if ([System.IO.Path]::GetExtension($file) -in @('.png', '.webp', '.mp4', '.apk', '.woff2')) { continue }
  $content = [System.IO.File]::ReadAllText($file)
  foreach ($privateValue in $privateValues) {
    if ($content.Contains($privateValue)) { throw "A private credential was found in release source: $file" }
  }
}

$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::ReadWrite)
$zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in ($sourceFiles | Sort-Object -Unique)) {
    $absoluteFile = [System.IO.Path]::GetFullPath($file)
    if (-not $absoluteFile.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Archive source must stay inside the project.' }
    $relative = $absoluteFile.Substring($projectRoot.Length + 1).Replace('\', '/')
    if ($relative.StartsWith('../') -or $relative -match '(^|/)(node_modules|\.git|\.next[^/]*|outputs|\.vercel)(/|$)' -or ($relative -match '(^|/)\.env($|\.)' -and $relative -ne '.env.example') -or $relative -match '\.(pem|key|jks|keystore|p12|pfx)$') { throw 'Unsafe archive entry.' }
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
