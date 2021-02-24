import { copy } from "fs-extra"
import pathExists from "path-exists"
import { join, dirname } from "path"

const distFolder = join(dirname(__dirname), "dist")

const exeExtention = process.platform === "win32" ? ".exe" : ""
const serveDExeFileName = `serve-d${exeExtention}`
const bundledServerMap = {
  win32: join(distFolder, "windows"),
  darwin: join(distFolder, "osx"),
  linux: join(distFolder, "linux"),
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
    // copy the whole served folder
    await copy(bundledServerMap[process.platform], codeDBinFolder)
  }
  return serveDPath
}
