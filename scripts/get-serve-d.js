// script to download serve-d binaries from GitHub

const downloadRelease = require("@terascope/fetch-github-release")
const { join, dirname, basename, extname } = require("path")
const { rm, mkdir } = require("shelljs")
const decompress = require("decompress")
const decompressTarxz = require("decompress-tarxz")

;(async () => {
  const distFolder = join(dirname(__dirname), "dist")
  rm("-rf", distFolder)
  mkdir("-p", distFolder)
  const assets = await downloadRelease("Pure-D", "serve-d", distFolder, undefined, undefined, true)
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
    rm("-rf", asset)
  }
})()
