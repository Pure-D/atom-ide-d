import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname, basename } from "path"
import { remove, ensureDir } from "fs-extra"
import decompress from "decompress"
// @ts-ignore
import decompressTarxz from "decompress-tarxz"

const assetPlatformToNodePlatform: Record<string, string | undefined> = {
  windows: "win32",
  osx: "darwin",
  linux: "linux",
}

// function to download serve-d binaries from GitHub
export async function getServeD(distFolderRoot: string) {
  const assets = ((await downloadRelease(
    /* username */ "Pure-D",
    /* repo */ "serve-d",
    /* download folder */ distFolderRoot,
    /* filter release */ undefined,
    /* filter asset */ undefined, // (asset) => asset.name.indexOf(platform) >= 0,
    true
  )) as unknown) as string[]

  await decompressAssets(assets, distFolderRoot)
}

// function to download dcd binaries from GitHub
export async function getDCD(distFolderRoot: string) {
  const assets = ((await downloadRelease(
    /* username */ "dlang-community",
    /* repo */ "DCD",
    /* download folder */ distFolderRoot,
    /* filter release */ undefined,
    /* filter asset */ undefined, // (asset) => asset.name.indexOf(platform) >= 0,
    true
  )) as unknown) as string[]

  await decompressAssets(assets, distFolderRoot)
}

function getServedPlatform(asset: string) {
  const assetPlatform = basename(asset).match(/windows|linux|osx/)?.[0] ?? asset
  const nodePlatform = assetPlatformToNodePlatform[assetPlatform] ?? assetPlatform
  return nodePlatform
}

/** Decompress assets into the dist folder matching a platform */
async function decompressAssets(assets: string[], distFolderRoot: string) {
  for (const asset of assets) {
    const platformFolder = join(distFolderRoot, getServedPlatform(asset))
    if (extname(asset) === ".xz") {
      await decompress(asset, platformFolder, {
        plugins: [decompressTarxz()],
      })
    } else {
      await decompress(asset, platformFolder)
    }
    remove(asset)
  }
}

async function main() {
  const distFolderRoot = join(dirname(__dirname), "dist")

  await remove(distFolderRoot)
  await ensureDir(distFolderRoot)

  await getServeD(distFolderRoot)
  await getDCD(distFolderRoot)
}

main().catch((e) => {
  throw e
})
