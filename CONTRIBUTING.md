### Development

```
git clone https://github.com/Pure-D/atom-ide-d
cd atom-ide-d
apm link .
pnpm install
pnpm dev
atom .
```

Use semantic-release commit style: "fix: did something"

Run `pnpm format && pnpm lint` before committing

### Releasing

Update changelog then:

```
pnpm install
pnpm get.serve-d
pnpm build-commit
apm publish patch # minor, major
```
