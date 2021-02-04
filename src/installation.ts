import { promises as fsp } from "fs"
const { copyFile } = fsp
import pathExists from "path-exists"
import { join, dirname } from "path"

const distFolder = join(dirname(__dirname), "dist")

const exeExtention = process.platform === "win32" ? ".exe" : ""
const serveDExeFileName = `serve-d${exeExtention}`
const bundledServerMap = {
  win32: join(distFolder, "windows", serveDExeFileName),
  darwin: join(distFolder, "osx", serveDExeFileName),
  linux: join(distFolder, "linux", serveDExeFileName),
}

async function getCodeDBinFolder() {
  if (process.platform === "linux") {
    if (await pathExists(join(process.env["HOME"], ".local", "share")))
      return join(process.env["HOME"], ".local", "share", "code-d", "bin")
    else return join(process.env["HOME"], ".code-d", "bin")
  } else if (process.platform === "win32") {
    return join(process.env["APPDATA"], "code-d", "bin")
  } else {
    return join(process.env["HOME"], ".code-d", "bin")
  }
}

async function isServeDInstalled(serveDPath: string) {
  return pathExists(serveDPath)
}

export async function installServeD() {
  const codeDBinFolder = await getCodeDBinFolder()
  const serveDPath = join(codeDBinFolder, serveDExeFileName)
  if (!(await isServeDInstalled(serveDPath))) {
    await copyFile(bundledServerMap[process.platform], serveDPath)
  }
  return serveDPath
}
