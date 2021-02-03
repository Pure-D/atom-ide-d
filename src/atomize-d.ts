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

  async startServerProcess(projectPath: string) {
    const serveD = spawn(serverByOS[process.platform], [], {
      cwd: projectPath,
    })

    serveD.on("error", (err) => {
      atom.notifications.addError(err.message, { description: err.name, stack: err.stack })
    })

    serveD.on("close", (code, signal) => {
      if (code !== 0 && signal == null) {
        atom.notifications.addError("Unable to start the Serve-D language server.\nCheck the dev tools console for more information.")
      }
    })

    serveD.on("exit", () => {
      atom.notifications.addError("Serve-D crashed.\nCheck the dev tools console for more information.")
    })

    return serveD
  }
}

module.exports = new DLanguageClient()
