import downloadRelease from "@terascope/fetch-github-release"
import { join, dirname, extname } from "path"
import { remove, ensureDir } from "fs-extra"
import { execFile as execFileRaw } from "child_process"
import { promisify } from "util"
const execFile = promisify(execFileRaw)

const assetMap = {
  win32: "windows",
  darwin: "osx",
  linux: "linux",
}

// function to download serve-d binaries from GitHub
export async function getServeD() {
  const distFolder = join(dirname(__dirname), "dist")
  const platform = assetMap[process.platform]
  const outputFolder = join(distFolder, platform)

  await remove(distFolder)
  await ensureDir(distFolder)

  const assets = ((await downloadRelease(
    /* username */ "Pure-D",
    /* repo */ "serve-d",
    /* download folder */ distFolder,
    /* filter release */ undefined,
    /* filter asset */ (asset) => asset.name.indexOf(platform) >= 0,
    process.platform !== "win32"
  )) as unknown) as string[]

  const asset = assets[0] // Assume there is only one possibility
  decompressTar(asset, outputFolder)

  remove(asset)
}

/** Decompress if it is a tar file */
async function decompressTar(filePath: string, outputFolder: string) {
  if (/\.tar\.(g|x)z/.test(filePath)) {
    // is tar file
    const mod = extname(filePath) == ".xz" ? "J" : "z"
    await execFile("tar", ["xvf" + mod, filePath], {
      cwd: outputFolder,
    })
  }
}
