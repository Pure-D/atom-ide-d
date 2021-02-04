import { AutoLanguageClient } from "atom-languageclient"
import { spawn } from "child_process"
import { installServeD } from "./installation"

class DLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ["source.d", "D"]
  }
  getLanguageName() {
    return "D"
  }
  getServerName() {
    return "serve-d"
  }

  getConnectionType(): "stdio" {
    return "stdio"
  }

  async startServerProcess(projectPath: string) {
    const serveDPath = await installServeD()

    const serveD = spawn(serveDPath, [], {
      cwd: projectPath,
    })

    serveD.on("error", (err) => {
      atom.notifications.addError(err.message, { description: err.name, stack: err.stack })
    })

    serveD.on("close", (code, signal) => {
      if (code !== 0 && signal == null) {
        atom.notifications.addError(
          "Unable to start the Serve-D language server.\nCheck the dev tools console for more information."
        )
      }
    })

    serveD.on("exit", () => {
      atom.notifications.addError("Serve-D crashed.\nCheck the dev tools console for more information.")
    })

    return serveD
  }
}

module.exports = new DLanguageClient()
