const { download, extract } = require("gitly")
const { dirname, join } = require("path")
const { rm, mkdir, mv } = require("shelljs")

;(async function main() {
  const source = await download("Pure-D/code-d")
  const distFolder = join(dirname(__dirname), "grammars")
  rm("-rf", distFolder)
  mkdir("-p", distFolder)

  const extractFolder = join(distFolder, "temp")
  mkdir("-p", extractFolder)
  await extract(source, extractFolder)

  mv(join(extractFolder, "syntaxes") + "/*", distFolder)
  rm("-rf", extractFolder)
  rm("-rf", distFolder + "/*.yml")
})()
