import { AutoLanguageClient } from "atom-languageclient"
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

    const serveD = super.spawn(serveDPath, [], {
      cwd: projectPath,
    })

    return serveD
  }
}

module.exports = new DLanguageClient()
