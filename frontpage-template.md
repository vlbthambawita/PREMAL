# Front-Page Extraction Template

Defines (a) the structure of the site's landing page and (b) the per-paper fields that feed it. The detail-page template lives in `extraction-template.md`; this file is its index-page counterpart.

## How the site is wired

- `index.md` (or `README.md` when served by GitHub Pages with the default Jekyll setup) is the landing page. It uses the structure in the **Front-page layout** section below.
- `summaries/<slug>.md` is one detail page per paper, produced from `extraction-template.md`.
- The landing page's comparison table is *generated* from the `frontpage:` and `comparison:` YAML blocks at the top of each `summaries/*.md`. A small build script (Python or Node) reads every summary file, parses the front matter, and writes the table rows into `index.md` between two HTML comment markers (`<!-- TABLE:START --> ... <!-- TABLE:END -->`). The script itself is out of scope for this template — the contract is the field schema below.
- Do not edit the table rows by hand. Edit the per-paper `frontpage:` block, re-run the script, commit the regenerated `index.md`.

## How to use (per paper)

For every paper, append the `frontpage:` block below to the YAML front matter of its `summaries/<slug>.md` file (next to the existing `comparison:` block). Rules:

- Keep `hook` to **≤ 18 words**, written so a reader knows whether to click. Not a TL;DR ("This paper proposes…") — a hook ("First sub-second TFHE inference on chest X-rays via 4-bit quantization").
- `novelty_tag` is **2–5 words**, used as a small badge next to the title. Pick what makes this paper *different* from neighbouring ones — not what it shares with the field.
- Reuse values from the existing `comparison:` block where they overlap (`year`, `fhe_scheme`, `architecture`, `single_inference_seconds`). Do not duplicate the data — the build script reads both blocks and prefers `comparison:` when keys collide. The front-page-only fields are listed below.
- Use the controlled vocabularies in **Controlled values** so filter pills work. If a paper does not fit, propose a new value in the PR rather than inventing it inline.
- Use `"N/A"` for fields the paper does not report. Do not omit keys — the build script expects a stable schema.

## Per-paper `frontpage:` block

```yaml
frontpage:
  slug: <short-slug>                       # matches the filename, used to build the detail-page link
  hook: <≤18-word one-liner; the reason to click>
  novelty_tag: <2–5 words; e.g. "First TFHE CNN", "New poly activation", "Federated + HE">
  task: <one of: inference | training | federated-round | encrypted-search>
  model_family: <one of: FCNN | CNN | ResNet | Transformer | SVM | GNN | SNN | other>
  domain: <one of: medical | generic-vision | nlp | tabular | iot | bio | finance>
  dataset_headline: <single string; primary dataset, e.g. "MNIST", "CIFAR-10", "Chest X-ray". "Multiple" if 3+>
  headline_accuracy: <e.g. "98.7% (−0.4 vs plaintext)" or "Not reported">
  code_available: <one of: yes | no>
  code_url: <repo URL, or "">
  featured: <true | false>                 # set true for ~5 papers to surface in the "Featured" strip
```

Fields the build script pulls from the existing `comparison:` block (do not re-state here): `title_link`, `year`, `fhe_scheme`, `architecture`, `single_inference_seconds`, `single_inference_hardware`.

### Controlled values

Keeping these closed makes the filter pills usable. Add a new value only by PR.

- **task:** `inference`, `training`, `federated-round`, `encrypted-search`
- **model_family:** `FCNN`, `CNN`, `ResNet`, `Transformer`, `SVM`, `GNN`, `SNN`, `other`
- **domain:** `medical`, `generic-vision`, `nlp`, `tabular`, `iot`, `bio`, `finance`
- **code_available:** `yes`, `no`

## Front-page layout

This is the structure `index.md` should follow. Sections marked *generated* are written by the build script; sections marked *manual* are hand-edited.

### 1. Header *(manual)*

- Project name: **PREMAL — Privacy-Preserving ML with Fully Homomorphic Encryption**
- One-line tagline (≤ 15 words).
- Two-to-three sentence scope paragraph: what this site covers, what it does not (e.g. "Excludes MPC-only and DP-only work").

### 2. Stats strip *(generated)*

A single line, computed from the summaries:

> **N papers · YYYY–YYYY · schemes: CKKS (×a), BFV (×b), TFHE (×c), hybrid (×d) · domains: medical (×e), generic-vision (×f), …**

### 3. Filter pills *(generated, optional)*

If the site uses Jekyll or a JS layer, render filter chips for `year`, `fhe_scheme`, `task`, `domain`. On a plain-GitHub render this section can be omitted — the table is sortable enough.

### 4. Featured papers *(generated)*

Up to 5 cards, picked from entries with `featured: true`. Each card: title, hook, year, scheme badge, link. Use this slot for survey papers, foundational work, and the most recent strong result — refresh quarterly.

### 5. Comparison table *(generated)*

Between `<!-- TABLE:START -->` and `<!-- TABLE:END -->`. Columns, in order:

| # | Column | Source field | Notes |
|---|---|---|---|
| 1 | Title | `comparison.title_link` + `frontpage.novelty_tag` badge | Link points to `summaries/<slug>.md` |
| 2 | Year | `comparison.year` | Sortable |
| 3 | Hook | `frontpage.hook` | Italicized, single line |
| 4 | FHE scheme | `comparison.fhe_scheme` | |
| 5 | Model | `comparison.architecture` | |
| 6 | Dataset | `frontpage.dataset_headline` | |
| 7 | Accuracy | `frontpage.headline_accuracy` | |
| 8 | Inference (s) | `comparison.single_inference_seconds` | Tooltip / footnote with `single_inference_hardware` so the number is interpretable |
| 9 | Code | `frontpage.code_available` → badge linking to `code_url` if `yes` | |

Sort default: `year` descending, then `single_inference_seconds` ascending.

### 6. Glossary *(manual)*

Short definitions for the scheme acronyms (CKKS, BFV, BGV, TFHE) and the recurring jargon (bootstrapping, packing, polynomial activation). Two lines each, max.

### 7. How to contribute *(manual)*

One paragraph pointing at `extraction-template.md` and `frontpage-template.md` (this file), with the slug naming convention (`firstauthor-year-shortid`, lowercase, hyphenated).

## Anti-patterns to avoid

- **No abstracts on the front page.** If a reader wants the abstract they will open the detail page.
- **No per-paper thumbnails or diagrams in the table.** Mermaid does not render inside table cells on GitHub, and even if it did, 50+ rows of small diagrams is noise. Diagrams live on detail pages.
- **No "rating" or "quality" column.** This is a literature map, not a review aggregator.
- **No more than 9 columns.** Past that, horizontal scroll kills the table on a laptop.
