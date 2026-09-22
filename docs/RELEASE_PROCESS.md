# Release process

This page is for maintainers promoting work from `main` to `production`, and for handling a bug on `production` directly. If you're contributing a change, you don't need this page — see [`CONTRIBUTING.md`](../CONTRIBUTING.md) instead; your PR always targets `main`.

## Branch roles

| Branch | What it is | Who pushes to it |
|---|---|---|
| `main` | Active development and integration — "what we're currently building." Every PR lands here first. | Contributors and maintainers, via PR |
| `production` | Live, stable code — "what users are currently running." | Only a maintainer, via an explicit release PR or a hotfix PR |
| `feature/*`, `fix/*` | Work in progress, branched off `main` | Whoever's making the change |
| `hotfix/*` | A fix for a bug already live on `production` | A maintainer, branched off `production` |

`main → production` is the normal direction. `production → main` only happens as part of a hotfix (below) — never as a routine merge.

## Normal feature flow

Identical whether you're the maintainer or an external contributor working from a fork:

```bash
git checkout main
git pull origin main
git checkout -b feat/something
# ... make the change ...
git push -u origin feat/something
```

Open a pull request against `main`. CI runs `server`'s typecheck and `client`'s lint + build. A maintainer reviews and merges.

## Promoting `main` to `production`

Don't merge individual feature branches into `production`, and don't do it automatically as part of merging to `main`. Promotion is its own explicit decision:

1. Confirm `main` is in a state you're willing to ship — it's been running as the integration branch, so this is a checkpoint, not a fresh test.
2. Open a pull request from `main` into `production`, titled `Release: vX.Y.Z`, with a description like:

   ```markdown
   ## What's included

   - Semantic search improvements
   - Browser extension fixes

   ## Testing

   - [x] Typecheck / lint / build (CI)
   - [x] Manually verified on main

   ## Database changes

   - [ ] None
   ```

3. CI runs the same checks against the merge result. Review it yourself (or have a trusted maintainer review it, once one exists), and merge.

## Tagging a release

After merging a release PR:

```bash
git checkout production
git pull origin production
git tag v0.x.0
git push origin v0.x.0
```

This gives you a fixed point to roll back to if something goes wrong later.

## Hotfixing `production`

If `production` breaks, don't patch it by hand or merge `main` wholesale (`main` may have unrelated in-progress work on it). Branch directly off `production`:

```bash
git checkout production
git pull origin production
git checkout -b hotfix/fix-something
# ... fix it ...
git push -u origin hotfix/fix-something
```

Open a PR: `hotfix/fix-something` → `production`. Once merged and tagged, **port the same fix into `main` too** — cherry-pick the commit or open a matching PR against `main`. This step is easy to forget and important: without it, the next `main → production` release silently reintroduces the bug you just fixed, because `main` never had the fix in the first place.

```
hotfix/fix-something
   │         │
   ↓         ↓
production  main
```

## Summary

- Contribute: PR into `main`. Always.
- Ship: an explicit `main → production` release PR, then tag.
- Production broke: `hotfix/*` off `production` → PR into `production` → port the same fix into `main`.
