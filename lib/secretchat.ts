export const secretChat = {
  name: "SecretChat",
  version: "2.0.0",
  build: 11,
  size: "5.3 MB",
  android: "Android 7.0+",
  apk: "/downloads/SecretChat-2.0.0-build11.apk",
  bytes: 5344109,
  sha256: "7de456d3ef90e6ee130b93e4049845cc6392a0a08af1cf2081577c4afc085adc",
  packageName: "com.kittycorp.sidechat",
} as const;

// Kept for existing installation links; new release listings use the current build.
export const legacySecretChatRelease = {
  apk: "/downloads/SecretChat-1.5.0-build6.apk",
  bytes: 5256093,
  sha256: "b32be6a4ac9555a1fe23943a90507a6e9d4583f9522e018162240268ca9de53b",
} as const;
