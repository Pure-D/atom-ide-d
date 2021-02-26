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
pnpm build-commit
```

Then publish based on the change (patch, minor, major):

```
apm publish patch
```
