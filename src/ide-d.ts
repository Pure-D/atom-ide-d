import { AutoLanguageClient } from "atom-languageclient"
import { installServeD } from "./installation"

class DLanguageClient extends AutoLanguageClient {
  activate() {
    super.activate()
    if (!atom.packages.isPackageLoaded("atom-ide-base")) {
      // install if not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("atom-package-deps").install("ide-d", true)
      // enable if disabled
      atom.packages.enablePackage("atom-ide-base")
    }
  }

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
