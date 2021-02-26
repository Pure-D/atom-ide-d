import { download, extract } from "gitly"
import { dirname, join } from "path"
import { remove, ensureDir, move } from "fs-extra"
;(async function main() {
  const source = await download("Pure-D/code-d")
  const root = dirname(__dirname)
  const distFolder = join(root, "grammars")
  await remove(distFolder)
  await ensureDir(distFolder)

  const extractFolder = join(root, "temp")
  await ensureDir(extractFolder)
  await extract(source, extractFolder)

  await move(join(extractFolder, "syntaxes"), distFolder, { overwrite: true })
  await remove(extractFolder)
})()
