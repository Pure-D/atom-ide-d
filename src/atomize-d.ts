import { AutoLanguageClient } from "atom-languageclient"

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

  startServerProcess() {
    return super.spawnChildNode([serverByOS[process.platform]])
  }
}

module.exports = new DLanguageClient()
