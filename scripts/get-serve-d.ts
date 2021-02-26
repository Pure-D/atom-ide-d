import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname, basename } from "path"
import { remove, ensureDir } from "fs-extra"
import decompress from "decompress"
// @ts-ignore
import decompressTarxz from "decompress-tarxz"

// function to download serve-d binaries from GitHub
export async function getServeD() {
  const distFolderRoot = join(dirname(__dirname), "dist")

  await remove(distFolderRoot)
  await ensureDir(distFolderRoot)

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


/** Decompress assets into the dist folder matching a platform */
async function decompressAssets(assets: string[], distFolderRoot: string) {
  for (const asset of assets) {
    const platform = basename(asset).match(/windows|linux|osx/)?.[0] ?? asset
    const platformFolder = join(distFolderRoot, platform)
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

getServeD()
  .then(() => console.log("Done"))
  .catch((e) => {
    throw e
  })
