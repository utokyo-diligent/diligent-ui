# UI implementation

Read the semantic token definitions and usage rules in [README.md](README.md) before changing UI. Use tokens by purpose, keep markup semantic, and check contrast when changing color combinations. `src/styles/tokens.css` is the source of truth for default values; keep the README and playground descriptions in sync when changing tokens. Domain-specific content belongs in the consuming project.

## Public repository

Keep organization-specific logos, photos, member information, internal links, credentials, and local configuration in the consuming project or its local environment. Use synthetic fixtures for the playground and tests. Before release, review the repository files and run `npm pack --dry-run` to review the package contents.
