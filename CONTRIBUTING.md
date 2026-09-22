# Contributing to SaveForLatter

Thanks for considering a contribution — bug fixes, new features, documentation, or just fixing something that bugs you are all welcome.

By participating, you're expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug** — [open an issue](https://github.com/jyotishankar04/saveforlatter/issues/new) with steps to reproduce, what you expected, and what actually happened.
- **Suggest a feature** — open an issue describing the problem it solves, not just the feature itself.
- **Fix something** — browse [open issues](https://github.com/jyotishankar04/saveforlatter/issues), especially any marked `good first issue`, or fix something you've personally run into.
- **Improve the docs** — the README, `CLAUDE.md`, or the in-app Help Center are all fair game.

## Project structure

This is a monorepo of independent apps with no root workspace — see [`CLAUDE.md`](./CLAUDE.md) for the full layout, module conventions, and per-app commands before making changes. The short version:

- `server/` — Express + TypeScript API. `pnpm dev` / `pnpm typecheck` from inside it.
- `client/` — Next.js 16 web dashboard. `pnpm dev` / `pnpm lint` from inside it.
- `extension/` — Chrome MV3 browser extension. `pnpm dev` from inside it.

## Getting set up

See the [README](./README.md#getting-started) for the full local setup (Postgres, Redis, environment variables). In short: `cd` into the app you're changing, `pnpm install`, then `pnpm dev`.

Both `server/` and `client/` have a typecheck you should run before opening a PR:

```bash
cd server && pnpm typecheck
cd client && pnpm lint
```

There's no automated test suite yet — for now, describe how you tested a change (manually, in your PR description) rather than relying on CI to catch regressions.

## Making a change

1. Fork the repo and create a branch off `main` for your change.
2. Make your change, keeping it focused — a bug fix doesn't need an unrelated refactor riding along with it.
3. Run the relevant typecheck/lint command above.
4. Commit with a clear message describing *why* the change was made, not just what changed.
5. Open a pull request against `main`, describing what changed, why, and how you tested it.

## Code style

There's no linter configured on the server yet, and `client/`'s ESLint config is the source of truth there. Beyond that, match the conventions already in the file you're editing — this codebase leans toward small, focused modules and comments that explain *why* something is done a certain way, not *what* the code does (the code already says that).

## Questions

Not sure where to start, or want to talk through an idea before building it? Open an issue and ask — that's what they're for.
