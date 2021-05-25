import { download, extract } from "gitly"
import { dirname, join, extname } from "path"
import { remove, ensureDir, move, readdir } from "fs-extra"

async function main() {
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

  // remove excess files
  await Promise.all(
    (
      await readdir(distFolder)
    ).map(async (file) => {
      if (file !== "Readme.md" && extname(file) !== ".json") {
        await remove(join(distFolder, file))
      }
    })
  )
}

main().catch((e) => {
  throw e
})
