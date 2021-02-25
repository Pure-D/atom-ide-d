import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname, basename } from "path"
import { remove, ensureDir } from "fs-extra"
import decompress from "decompress"
import decompressTarxz from "decompress-tarxz"

// function to download serve-d binaries from GitHub
export async function getServeD() {
  const distFolder = join(dirname(__dirname), "dist")

  await remove(distFolder)
  await ensureDir(distFolder)

  const assets = ((await downloadRelease(
    /* username */ "Pure-D",
    /* repo */ "serve-d",
    /* download folder */ distFolder,
    /* filter release */ undefined,
    /* filter asset */ undefined, // (asset) => asset.name.indexOf(platform) >= 0,
    true
  )) as unknown) as string[]

  for (const asset of assets) {
    const platform = basename(asset).match(/windows|linux|osx/)[0]
    const downloadFolder = join(distFolder, platform)
    if (extname(asset) === ".xz") {
      await decompress(asset, downloadFolder, {
        plugins: [decompressTarxz()],
      })
    } else {
      await decompress(asset, downloadFolder)
    }
    remove(asset)
  }
}

getServeD()
  .then(() => console.log("Done"))
  .catch((e) => {
    throw e
  })
