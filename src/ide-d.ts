import { AutoLanguageClient } from "atom-languageclient"

class DLanguageClient extends AutoLanguageClient {
  async activate() {
    super.activate()
    if (!atom.packages.isPackageLoaded("atom-ide-base")) {
      // install if not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      await (await import("atom-package-deps")).install("ide-d", true)
      // enable if disabled
      atom.packages.enablePackage("atom-ide-base")
      atom.notifications.addSuccess("ide-d: atom-ide-base was installed and enabled...")
    }
  }

  /* eslint-disable class-methods-use-this */
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
  /* eslint-enable class-methods-use-this */

  async startServerProcess(projectPath: string) {
    // import only when a D file is opened.
    const { installServeD } = await import("./installation")

    const serveDPath = await installServeD()

    const serveD = super.spawn(serveDPath, ["--require", "workspaces"], {
      cwd: projectPath,
    })

    return serveD
  }
}

module.exports = new DLanguageClient()
