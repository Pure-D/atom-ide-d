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
```

Checkout to master branch (main is not supported by apm yet)

```
git checkout master
```

Then publish based on the change (patch, minor, major):

```
apm publish patch
```
