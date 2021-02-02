import { AutoLanguageClient } from "atom-languageclient"
import { spawn } from "child_process"

import { join, dirname } from "path"

const distFolder = join(dirname(__dirname), "dist")
const serverByOS = {
  win32: join(distFolder, "windows", "serve-d.exe"),
  darwin: join(distFolder, "osx", "serve-d"),
  linux: join(distFolder, "linux", "serve-d"),
}

class DLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ["source.d"]
  }
  getLanguageName() {
    return "D"
  }
  getServerName() {
    return "serve-d"
  }

  startServerProcess(projectPath: string) {
    const serveD = spawn(serverByOS[process.platform], [], {
      cwd: projectPath,
    })
    return serveD
  }
}

module.exports = new DLanguageClient()
