import { pathExists } from "fs-extra"
import { join, dirname } from "path"

import { execFile as execFileRaw } from "child_process"
import { promisify } from "util"
const execFile = promisify(execFileRaw)

async function getCodeDBinFolder() {
  const home = process.env.HOME
  if (typeof home === "string" && home !== "" && process.platform === "linux") {
    if (await pathExists(join(home, ".local", "share"))) {
      return join(home, ".local", "share", "code-d", "bin")
    } else {
      return join(home, ".code-d", "bin")
    }
  } else if (process.platform === "win32") {
    const appdata = process.env.APPDATA
    if (typeof appdata === "string" && appdata !== "") {
      return join(appdata, "code-d", "bin")
    }
  } else if (typeof home === "string" && home !== "") {
    return join(home, ".code-d", "bin")
  }
  return ""
}

function isServeDInstalled(serveDPath: string) {
  return pathExists(serveDPath)
}

/** Get the version of serve-d */
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
async function isServeDUpToDate(givenFile: string, targetFile: string) {
  // @ts-ignore
  const semverCompare = (await import("semver/functions/compare")) as typeof import("semver/functions/compare")
  const [givenVersion, targetVersion] = await Promise.all([getServeDVersion(givenFile), getServeDVersion(targetFile)])
  if (
    typeof givenVersion === "string" &&
    typeof targetVersion === "string" &&
    givenVersion !== "" &&
    targetVersion !== ""
  ) {
    return semverCompare(givenVersion, targetVersion) !== -1
  } else {
    // assume given version is old
    return false
  }
}

async function copyServeD(bundledServerFolder: string, codeDBinFolder: string) {
  const { copy } = await import("fs-extra")
  atom.notifications.addInfo("Installing/Updating D servers...")
  // copy the whole served folder
  await copy(bundledServerFolder, codeDBinFolder, { overwrite: true })
  atom.notifications.addSuccess("D servers was installed/updated")
}

export async function installServeD() {
  const distFolder = join(dirname(__dirname), "dist")

  const exeExtention = process.platform === "win32" ? ".exe" : ""
  const serveDExeFileName = `serve-d${exeExtention}`

  const bundledServerFolder = join(distFolder, `${process.platform}-${process.arch}`)

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
