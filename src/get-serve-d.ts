import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, basename, extname } from "path"
import { remove, ensureDir } from "fs-extra"
import decompress from "decompress"
import decompressTarxz from "decompress-tarxz"

// function to download serve-d binaries from GitHub
export async function getServeD() {
  const distFolder = join(dirname(__dirname), "dist")
  await remove(distFolder)
  await ensureDir(distFolder)
  const assets = ((await downloadRelease(
    "Pure-D",
    "serve-d",
    distFolder,
    undefined,
    undefined,
    true
  )) as unknown) as string[]
  for (const asset of assets) {
    const platform = basename(asset).match(/windows|linux|osx/)[0]
    extname(asset)
    if (extname(asset) === ".xz") {
      await decompress(asset, join(distFolder, platform), {
        plugins: [decompressTarxz()],
      })
    } else {
      await decompress(asset, join(distFolder, platform))
    }
    remove(asset)
  }
}
