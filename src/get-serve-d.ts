import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname } from "path"
import { remove, ensureDir } from "fs-extra"
import decompress from "decompress"

const assetMap = {
  win32: "windows",
  darwin: "osx",
  linux: "linux",
}

// function to download serve-d binaries from GitHub
export async function getServeD() {
  const distFolder = join(dirname(__dirname), "dist")
  const platform = assetMap[process.platform]
  const downloadFolder = join(distFolder, platform)

  await remove(distFolder)
  await ensureDir(distFolder)

  const assets = ((await downloadRelease(
    /* username */ "Pure-D",
    /* repo */ "serve-d",
    /* download folder */ distFolder,
    /* filter release */ undefined,
    /* filter asset */ (asset) => asset.name.indexOf(platform) >= 0,
    true
  )) as unknown) as string[]

  const asset = assets[0] // Assume there is only one possibility
  if (extname(asset) === ".xz") {
    await decompress(asset, downloadFolder, {
      plugins: [await import("decompress-tarxz")],
    })
  } else {
    await decompress(asset, downloadFolder)
  }
  remove(asset)
}
