import { copy } from "fs-extra"
import pathExists from "path-exists"
import { join, dirname } from "path"
import semverCompare from "semver/functions/compare"

import { execFile as execFileRaw } from "child_process"
import { promisify } from "util"
const execFile = promisify(execFileRaw)

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
    const version = output.match(/v(\d\S*)\s/)?.[1]
    return version
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/** Check if the given serve-d is up to date against the target version */
export async function isServeDUpToDate(givenFile: string, targetFile: string) {
  const givenVersion = await getServeDVersion(givenFile)
  const targetVersion = await getServeDVersion(targetFile)
  if (givenVersion && targetVersion) {
    return semverCompare(givenVersion, targetVersion) !== -1
  } else {
    // assume given version is old
    return -1
  }
}

async function copyServeD(bundledServerFolder: string, codeDBinFolder: string) {
  atom.notifications.addInfo("Installing serve-d...")
  // copy the whole served folder
  await copy(bundledServerFolder, codeDBinFolder, { overwrite: true })
  atom.notifications.addSuccess("Serve-d was installed")
}

export async function installServeD() {
  const distFolder = join(dirname(__dirname), "dist")

  const exeExtention = process.platform === "win32" ? ".exe" : ""
  const serveDExeFileName = `serve-d${exeExtention}`

  const bundledServerFolder = join(distFolder, process.platform)

  const codeDBinFolder = await getCodeDBinFolder()
  const serveDPath = join(codeDBinFolder, serveDExeFileName)

  if (bundledServerFolder) {
    const bundledServeDPath = join(bundledServerFolder, serveDExeFileName)
    if (!(await isServeDInstalled(serveDPath)) || !(await isServeDUpToDate(serveDPath, bundledServeDPath))) {
      await copyServeD(bundledServerFolder, codeDBinFolder)
    }
  } else {
    if (!(await isServeDInstalled(serveDPath))) {
      atom.notifications.addError(
        `serve-d binary is not available for ${process.platform}.
        Please built it from the source, place it under ${codeDBinFolder}, and restart Atom.`
      )
    }
  }
  return serveDPath
}
