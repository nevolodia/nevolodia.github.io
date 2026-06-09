# RULES — NOT NEGOTIABLE

1. **NEVER `git commit`. NEVER `git push`. Such use of git is HIGHLY PROHIBITED.**
   Only the owner commits. Leave all changes uncommitted in the working tree.
2. The GitHub remote (origin) is for the owner's use only. Claude never pushes, fetch is fine.
3. Never add accessibility markup (no `aria-*`, no `alt` on images, no a11y attributes of any kind).

# Workflow notes

- Toolchain is **Bun** (no node/npm on this host): `bun install`, `bun run build`.
- To preview for the owner: build, then serve `build/` with `bunx serve -l 4324`.
