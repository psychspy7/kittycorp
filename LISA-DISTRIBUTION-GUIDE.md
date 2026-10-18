# LISA delivery and large downloads

The website currently offers a $99 assisted purchase inquiry. It does not take a new LISA preorder payment or automatically allocate a licence.

## Approved local package
Canonical application folder: C:/Users/HP/Downloads/Project (Kitty-Corp)/LISA AI/2026-10-02/hi
Installer: outputs/LISA-2.2.0/LISA-Setup.exe (879,791,884 bytes, about 839 MiB).
The portable package is about 915 MiB. Do not use the full developer archive as a customer download.
The local release reports local_package_ready=true and public_release_published=false. Required installer uploads previously failed. A draft release or a local file is not a working public customer download.

## Suitable hosting
Do not commit the installer into the website Git repository or Vercel public folder.
Option A: upload the installer and checksums to a published GitHub Release. A public binary is publicly downloadable; enforce purchased access through the application's licence activation.
Option B: use private object storage and short-lived signed download URLs issued after verified payment. Preserve download access for purchasers and the agreed refund policy.
Confirm actual storage limits, bandwidth, costs and access controls before choosing a provider.

## Before instant paid delivery
Finish the approved package upload, verify the checksum, test a fresh customer download/install/activation, and decide how the website securely allocates a licence. Keep activation CSV files and private signing material out of GitHub, public storage and source ZIPs.
Read the application's release status and finish-upload guide. The installer is unsigned; microphone and paid-provider acceptance checks were not all completed in the recorded release. Describe illustrated 2D/2.5D animation accurately rather than claiming a finished 3D or Live2D rig.
State supported Windows versions, requirements, included version, provider/API charges, download delivery, support, cancellation and refund terms before taking payment. A $99 version purchase is not an unlimited cloud-usage promise.
Preserve existing refundable preorder records and their terms. The public preorder route now exists for existing customers only.
