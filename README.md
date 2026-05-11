# PREMAL

Curated map of papers on Privacy-Preserving Machine Learning with Fully Homomorphic Encryption.

The site lives at `index.md` and is served by GitHub Pages (Jekyll, no theme — a minimal custom layout in `_layouts/default.html` loads Mermaid from a CDN for diagram rendering).

- **Site entry point:** `index.md`
- **Per-paper summaries:** `summaries/<slug>.md`
- **Extraction templates** (how new entries are produced): `extraction-template.md`, `frontpage-template.md`
- **PDFs:** `papers/` (gitignored; convert to text with `pdftotext -layout` before extracting)

## Local preview

```
bundle install
bundle exec jekyll serve
```

The site builds at `http://127.0.0.1:4000`.

## Publishing

Enable GitHub Pages in repo settings → Pages → Source: `main` branch, `/` (root). The included `_config.yml`, `_layouts/default.html`, and `Gemfile` are configured for the github-pages gem; no other setup needed.
