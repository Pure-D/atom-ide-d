import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname, basename } from "path"
import { remove, ensureDir, copy } from "fs-extra"
import decompress from "decompress"
// @ts-ignore
import decompressTarxz from "decompress-tarxz"

const assetPlatformToNodePlatform: Record<string, string | undefined> = {
  windows: "win32",
  osx: "darwin",
  linux: "linux",
}

const assetArchToNodeArch: Record<string, string | undefined> = {
  x86_64: "x64",
  x86: "ia32",
}

// function to download serve-d binaries from GitHub
export async function getServeD(distFolderRoot: string) {
  const assets = await downloadRelease(
    /* username */ "Pure-D",
    /* repo */ "serve-d",
    /* download folder */ distFolderRoot,
    /* filter release */ undefined,
    /* filter asset */ undefined, // (asset) => asset.name.indexOf(platform) >= 0,
    true
  )

  await decompressAssets(assets, distFolderRoot)

  // copy missing win32-ia32 assts from win32-x64
  await copy(join(distFolderRoot, "win32-x64"), join(distFolderRoot, "win32-ia32"), {
    recursive: true,
    overwrite: false,
  })
}

// function to download dcd binaries from GitHub
export async function getDCD(distFolderRoot: string) {
  const assets = await downloadRelease(
    /* username */ "dlang-community",
    /* repo */ "DCD",
    /* download folder */ distFolderRoot,
    /* filter release */ undefined,
    /* filter asset */ undefined, // (asset) => asset.name.indexOf(platform) >= 0,
    true
  )

  await decompressAssets(assets, distFolderRoot)
}

function getNodePlatform(asset: string) {
  const assetPlatform = basename(asset).match(/windows|linux|osx/)?.[0] ?? asset
  const nodePlatform = assetPlatformToNodePlatform[assetPlatform] ?? assetPlatform
  return nodePlatform
}

function getNodeArch(asset: string) {
  const assetArch = basename(asset).match(/x86_64|x86/)?.[0] ?? asset
  const nodeArch = assetArchToNodeArch[assetArch] ?? "x64" // assume x64 by default
  return nodeArch
}

/** Decompress assets into the dist folder matching a platform */
async function decompressAssets(assets: string[], distFolderRoot: string) {
  await Promise.all(assets.map((asset) => decompressAsset(asset, distFolderRoot)))
}

/** Decompress one asset into the dist folder matching a platform */
async function decompressAsset(asset: string, distFolderRoot: string) {
  const platformFolder = join(distFolderRoot, `${getNodePlatform(asset)}-${getNodeArch(asset)}`)
  if (extname(asset) === ".xz") {
    await decompress(asset, platformFolder, {
      plugins: [decompressTarxz()],
    })
  } else {
    await decompress(asset, platformFolder)
  }
  await remove(asset)
}

async function main() {
  const distFolderRoot = join(dirname(__dirname), "dist")

  await remove(distFolderRoot)
  await ensureDir(distFolderRoot)

  await Promise.all([getServeD(distFolderRoot), getDCD(distFolderRoot)])
}

main().catch((e) => {
  throw e
})
