# [0.5.0](https://github.com/Pure-D/atom-ide-d/compare/v0.4.0...v0.5.0) (2021-07-19)


### Bug Fixes

* build the package with Parcel - require Atom 1.52 and above ([1ca7344](https://github.com/Pure-D/atom-ide-d/commit/1ca73444d1de58c576d8e4f2429b204a275b4789))
* lazy-load fs-extra and semver ([d722a35](https://github.com/Pure-D/atom-ide-d/commit/d722a354c10c2779f492cbb6d57ac2d9e869c264))
* lazy-load package-deps ([60746f7](https://github.com/Pure-D/atom-ide-d/commit/60746f78e9f55b33f1e7c37f07a47c8957c2abab))
* update atom-languageclient ([02a16b9](https://github.com/Pure-D/atom-ide-d/commit/02a16b9be2948fa0dece323c270eb451e157f4da))


### Features

* update the bundled serve-d and dcd ([2b312a8](https://github.com/Pure-D/atom-ide-d/commit/2b312a86835b032d60dfe628a1dc84651ab89cb8))

# [0.4.0](https://github.com/Pure-D/atom-ide-d/compare/v0.3.0...v0.4.0) (2021-06-02)


### Bug Fixes

* add i686 to arch map ([7602ea1](https://github.com/Pure-D/atom-ide-d/commit/7602ea168ae53d316fc6aedfaec805d7418ef036))
* bump atom-languageclient ([64fa41e](https://github.com/Pure-D/atom-ide-d/commit/64fa41ee4a00c70c6743b33e54a84945f7129cfb))
* compare the type and value of the nullable variables accurately ([57591da](https://github.com/Pure-D/atom-ide-d/commit/57591da3ff13e7cf8a9d493cd2776466c8a95e8a))
* downgrade dcd to 0.13.1 ([247af40](https://github.com/Pure-D/atom-ide-d/commit/247af40f6ee0bc61d8f051b874fa0f6820e3e1d0))
* parallelize checking for the versions of serveD ([1f2d307](https://github.com/Pure-D/atom-ide-d/commit/1f2d307454a4f0c7d0ee786db56bb5819672166b))
* update atom-languageclient to 1.8.1 ([344c33e](https://github.com/Pure-D/atom-ide-d/commit/344c33e78e525d4be9870d7ae44d56c9132f3e63))
* update dependencies ([14d818c](https://github.com/Pure-D/atom-ide-d/commit/14d818cae530535fff5eba3b8dfc391941e568d8))
* update dependencies ([fa641ef](https://github.com/Pure-D/atom-ide-d/commit/fa641efafc472621a4e85e31eb8aa72f0edd2b25))
* update grammars from upstream ([307d85e](https://github.com/Pure-D/atom-ide-d/commit/307d85e1c92364a82fde38d9abb1745e8b63ab23))
* update languageclient ([252c2f4](https://github.com/Pure-D/atom-ide-d/commit/252c2f496006b16ba64b48ec024c0f77d45c2102))
* use pathExists from fs-extra ([3c42d79](https://github.com/Pure-D/atom-ide-d/commit/3c42d796bcebd84955e7f2a2ce67342a1dee57ba))
* use the latest DCD ([f942ffe](https://github.com/Pure-D/atom-ide-d/commit/f942ffec3e888b9d500909cf5a02f628602f4f0f))


### Features

* add dpp to the extensions ([732d993](https://github.com/Pure-D/atom-ide-d/commit/732d9935ed155daffc0408495994a51fa698ff7d))
* release a new version ([b8d2ef3](https://github.com/Pure-D/atom-ide-d/commit/b8d2ef33e31fc137d462825e8c5b0b9fe92e4d01))
* use workspaces ([6ee9c3f](https://github.com/Pure-D/atom-ide-d/commit/6ee9c3f21f3ef8ca49c7567ab0acb7d8e606c64a))

## 0.3.0
  - Automatically install atom-ide-base

## 0.2.1
  - Fix Windows x64 serve-d binary

## 0.2.0
 - Bundle DCD
 - Support other architectures

## 0.1.1
 - Fix semver missing from the dependencies


## 0.1.0 - First Release
 - Rewrote the dev code using serve-d
