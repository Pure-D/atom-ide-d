import { copy } from "fs-extra"
import pathExists from "path-exists"
import { join, dirname } from "path"
import semverCompare from "semver/functions/compare"

import { execFile as execFileRaw } from "child_process"
import { promisify } from "util"
const execFile = promisify(execFileRaw)

const distFolder = join(dirname(__dirname), "dist")

const exeExtention = process.platform === "win32" ? ".exe" : ""
const serveDExeFileName = `serve-d${exeExtention}`
const bundledServerMap = {
  win32: join(distFolder, "windows"),
  darwin: join(distFolder, "osx"),
  linux: join(distFolder, "linux"),
}

async function getCodeDBinFolder() {
  const home = process.env["HOME"]
  if (home && process.platform === "linux") {
    if (await pathExists(join(home, ".local", "share"))) {
      return join(home, ".local", "share", "code-d", "bin")
    } else {
      return join(home, ".code-d", "bin")
    }
  } else if (process.platform === "win32") {
    const appdata = process.env["APPDATA"]
    if (appdata) {
      return join(appdata, "code-d", "bin")
    }
  } else if (home) {
    return join(home, ".code-d", "bin")
  }
  return ""
}

async function isServeDInstalled(serveDPath: string) {
  return pathExists(serveDPath)
}

/** get the version of serve-d */
async function getServeDVersion(file: string) {
  try {
    const output = (await execFile(file, ["--version"])).stderr
    const version = output.match(/v(\d\S*)\s/)[1]
    return version
  } catch (e) {
    console.error(e)
    return null
  }
}

/** Check if the given serve-d is up to date against the target version */
export async function isServeDUpToDate(givenFile: string, targetFile: string) {
  const givenVersion = await getServeDVersion(givenFile)
  const targetVersion = await getServeDVersion(targetFile)
  return givenVersion && targetVersion && semverCompare(givenVersion, targetVersion) !== -1
}

async function copyServeD(codeDBinFolder: string) {
  atom.notifications.addInfo("Installing serve-d...")
  // copy the whole served folder
  await copy(bundledServerMap[process.platform], codeDBinFolder, { overwrite: true })
  atom.notifications.addSuccess("Serve-d was installed")
}

export async function installServeD() {
  const codeDBinFolder = await getCodeDBinFolder()
  const serveDPath = join(codeDBinFolder, serveDExeFileName)
  const bundledServeDPath = join(bundledServerMap[process.platform], serveDExeFileName)
  if (!(await isServeDInstalled(serveDPath)) || !(await isServeDUpToDate(serveDPath, bundledServeDPath))) {
    await copyServeD(codeDBinFolder)
  }
  return serveDPath
}
