# Plan — "Slides" tab: teaching slide decks for the Transformer + FHE collection

**Branch:** `feature/transformer-fhe-slides` (merge to `main` when complete)
**Status:** in progress — infrastructure done, 7 of 60 decks written (primer + all of Module 1).
Live checklist: `slidev/PROGRESS.md`. Settled since this plan was written: Node installed,
deployment via GitHub Actions (Option A, workflow committed), HETAL still planned as one merged
deck, decks live in `slidev/src/` rather than `slidev/decks/`.
**Goal:** add a new tab to the PREMAL site containing one Slidev deck per paper in
`papers_Transformer_FHE/` (60 PDFs), written in very simple English with diagrams, so that a
student with no cryptography background can learn the concept of each paper.

---

## 0. Prerequisite — Node.js is not installed

Slidev requires Node ≥ 18. This machine has `brew` and `pdftotext` but **no `node`/`npm`**:

```
$ node -v
zsh: command not found: node
```

**I need your OK to run:** `brew install node`

If you would rather not install Node globally, the alternatives are (a) install `nvm` and pin a
local Node, or (b) drop Slidev and build the decks with reveal.js loaded from a CDN — no build step
at all, but a much weaker authoring experience (no Vue components, no `v-click` animation
ergonomics). **Recommendation: `brew install node`.** Everything below assumes Slidev.

---

## 1. What gets built

```
PREMAL/
├─ _layouts/default.html        ← add "Slides" link to the site nav
├─ slides.md                    ← NEW. Jekyll page at /PREMAL/slides/ — the tiled index
├─ _data/decks.yml              ← NEW. One record per deck; drives the tiles (no hand-written HTML)
├─ slidev/                      ← NEW. Slidev source project (excluded from Jekyll)
│  ├─ package.json
│  ├─ build.sh                  ← loops over every deck, sets --base per deck
│  ├─ styles/index.css          ← PREMAL colours applied to every deck
│  ├─ components/               ← reusable teaching visuals (see §4)
│  │  ├─ SlotGrid.vue           ← draws a CKKS ciphertext as a row of SIMD slots
│  │  ├─ DepthBar.vue           ← multiplicative-depth / bootstrap budget meter
│  │  ├─ RoundTrip.vue          ← client↔server interaction-round animation
│  │  └─ CostBars.vue           ← simple horizontal bar chart for latency / bandwidth
│  ├─ DECK_TEMPLATE.md          ← the canonical 15-slide skeleton (see §3)
│  └─ decks/<slug>.md           ← 60 deck sources
└─ decks/<slug>/index.html      ← BUILT output, served at /PREMAL/decks/<slug>/
```

Notes on the layout choice:

- Slidev sources live in `slidev/decks/`, built output in `decks/`. Keeping the two apart avoids any
  collision between Jekyll's page rendering and Slidev's SPA output.
- The landing page is `slides.md` → `/PREMAL/slides/` (the repo already uses `permalink: pretty`).
- `_config.yml` gains `slidev/` and `SLIDES_PLAN.md` to its `exclude:` list. Slidev's built HTML has
  no YAML front matter, so Jekyll copies it through verbatim — no Liquid escaping problems.
- `slidev/node_modules/` goes in `.gitignore`.

---

## 2. Deployment — how the built decks reach GitHub Pages

Today Pages serves `main` at root, so a static site with no build step. 60 Slidev SPAs are roughly
**1.5–2.5 MB each once built (~100 MB total)**, which is a lot to carry in git history.

**Option A — GitHub Actions (recommended).** Add `.github/workflows/pages.yml` that installs Node,
runs `slidev/build.sh`, runs `jekyll build`, and publishes the merged `_site/` via
`actions/deploy-pages`. Nothing built is ever committed; `decks/` stays gitignored.
*You must flip one setting by hand:* repo → Settings → Pages → Source → **GitHub Actions**.

**Option B — commit the built output.** Zero settings changes, works with Pages as configured today,
but adds ~100 MB to the repo and every rebuild churns it.

**Recommendation: A.** I will write the workflow either way; tell me which you want.

---

## 3. The deck template — how each paper is taught

Every deck follows the same 15-slide skeleton so students build a rhythm across the collection.
Written at roughly a good-undergraduate reading level: short sentences, no unexplained jargon, every
symbol defined the first time it appears.

| # | Slide | What it does |
|---|---|---|
| 1 | **Title** | Paper, authors, venue/year, and one sentence: *what this paper is trying to do* |
| 2 | **The problem, in plain words** | An everyday analogy first, the technical statement second |
| 3 | **What you need to know first** | Only the background this specific paper needs — nothing more |
| 4 | **The one big idea** | A single sentence and a single diagram. If a student remembers one slide, this one |
| 5–7 | **How it works, step by step** | 2–3 slides, built up with `v-click` so each piece appears in order |
| 8 | **A tiny worked example** | Concrete numbers on a 2×2 or 4-slot toy case — makes the mechanism real |
| 9 | **Threat model** | Who is honest, who is curious, what leaks. Same visual on every deck |
| 10 | **Results** | 3–5 numbers that matter, as bars, not a screenshot of the paper's table |
| 11 | **What it costs** | The trade-off the paper accepts (depth, rounds, accuracy, client compute) |
| 12 | **What it does *not* solve** | Honest limitations, stated plainly |
| 13 | **Where it sits** | This paper's place in the lineage — the map slide, shared across decks |
| 14 | **Key terms** | Glossary of every term introduced, one line each |
| 15 | **Check yourself** | 2–3 questions with click-to-reveal answers |

Consistency rules across all 60 decks:

- **Same colour meaning everywhere:** blue = encrypted/ciphertext, grey = plaintext, orange = the
  expensive operation, green = the paper's contribution.
- **Same four "hard operators"** framing (softmax, LayerNorm, GELU, ct×ct matmul) recurs so students
  see each paper as an answer to the same question.
- Every claim on a results slide carries a section/table reference into the source paper.
- Mermaid for flow/architecture; the Vue components in §4 for anything repeated.

---

## 4. Shared teaching visuals (built once, used everywhere)

| Component | Teaches |
|---|---|
| `SlotGrid.vue` | SIMD packing — why one ciphertext holds thousands of numbers, and why rotation is needed to add neighbours |
| `DepthBar.vue` | Multiplicative depth draining as layers run, and where bootstrapping refills it |
| `RoundTrip.vue` | Interactive vs non-interactive protocols — animates the client↔server rounds so "10,509 rounds" becomes visceral |
| `CostBars.vue` | Log-scale latency/bandwidth comparison, consistent axis styling across every deck |

Plus a **"Deck 00 — Primer"**: *Why transformers are hard to encrypt.* One extra deck covering CKKS,
SIMD slots, noise and bootstrapping, multiplicative depth, and the four hard operators. Every other
deck links back to it instead of re-explaining. This is the piece that makes the other 59 teachable,
so I'd like to write it first.

---

## 5. Deck inventory — 60 PDFs → 60 decks

Grouped into 8 modules; the tile page shows these as sections and as filter chips.

**One merge to flag:** `2023 - HETAL ICML proceedings version.pdf` and `2024 - HETAL - Efficient
Privacy-preserving Transfer Learning...pdf` are two versions of the same work. I propose **one HETAL
deck** covering both. That makes 59 paper decks + 1 primer = **60 decks**. Say the word if you'd
rather have two.

### Module 0 — Primer (1)
`primer-fhe-transformers` — Why transformers are hard to encrypt (written by me, not a paper)

### Module 1 — Surveys & where the field stands (6)
| Slug | Paper |
|---|---|
| `survey-private-transformer-inference-2024` | A Survey on Private Transformer Inference |
| `sok-approx-he-llm-2026` | SoK: Private LLM Inference using Approximate HE |
| `ppml-systematic-review-2025` | Towards Efficient PPML — A Systematic Review |
| `pragmatic-crypto-comparison-2026` | A Pragmatic Comparison of Cryptographic Computation Technologies |
| `fhe-vs-garbled-circuits-2025` | Comparison of FHE and Garbled Circuit Techniques |
| `shuffling-defense-insecurity-2026` | On the In-Security of the Shuffling Defense |

### Module 2 — FHE-native, non-interactive inference (12)
| Slug | Paper |
|---|---|
| `thex-2022` | THE-X |
| `polynomial-transformers-2023` | Converting Transformers to Polynomial Form (Zimerman et al.) |
| `power-softmax-2024` | Power-Softmax |
| `nexus-2024` | NEXUS |
| `thor-2024` | THOR |
| `ellmo-2026` | ELLMo |
| `euston-2026` | Euston |
| `stip-2026` | STIP |
| `atlas-2026` | ATLAS |
| `private-llm-inference-edbt-2026` | Private LLM Inference with HE (EDBT) |
| `fhe-llama3-2026` | FHE on Llama 3 |
| `secure-transformer-protocol-2023` | Secure Transformer Inference Protocol |

### Module 3 — Hybrid HE + MPC (16)
| Slug | Paper |
|---|---|
| `iron-2022` | Iron |
| `bolt-2023` | BOLT |
| `bumblebee-2023` | BumbleBee |
| `nimbus-2024` | Nimbus |
| `ciphergpt-2023` | CipherGPT |
| `cipherformer-2024` | CipherFormer |
| `east-2023` | East |
| `primer-2023` | Primer |
| `blb-2025` | BLB — Breaking the Layer Barrier |
| `encformer-2026` | EncFormer |
| `ensi-2025` | ENSI |
| `cipherprune-2025` | CipherPrune |
| `comet-2025` | Comet |
| `key-switching-overhead-2026` | Reducing Key-Switching Overhead |
| `encrypted-prompt-2023` | LLMs Can Understand Encrypted Prompt |
| `high-accuracy-ppl-acl-2025` | Efficient and High-Accuracy Privacy-Preserving Language Modeling |

### Module 4 — Pure MPC baselines (context, tagged `[MPC]`) (5)
| Slug | Paper |
|---|---|
| `mpcformer-2023` | MPCFormer |
| `puma-2023` | PUMA |
| `secformer-2024` | SecFormer |
| `shaft-2025` | SHAFT |
| `sigma-2023` | SIGMA |

### Module 5 — Training & fine-tuning under encryption (5)
| Slug | Paper |
|---|---|
| `hetal-2023` | HETAL (ICML proceedings + extended version, merged) |
| `blindtuner-2024` | BlindTuner |
| `privtuner-2024` | PrivTuner (HE + LoRA) |
| `encryption-friendly-llm-2024` | Encryption-Friendly LLM Architecture |
| `inhibitor-2023` | The Inhibitor (architecture redesign for TFHE) |

### Module 6 — Systems & hardware acceleration (8)
| Slug | Paper |
|---|---|
| `encryptedllm-2025` | EncryptedLLM (GPU) |
| `cachemir-2026` | Cachemir (encrypted KV cache) |
| `cryptogen-2026` | CryptoGen (KV-cache reuse) |
| `aegis-2026` | AEGIS (multi-GPU, long sequence) |
| `fame-2025` | FAME (FPGA) |
| `chameleon-2024` | Chameleon (GPU scheme switching) |
| `multi-gpu-encrypted-2025` | A Scalable Multi-GPU Framework |
| `gpu-he-dataflow-2026` | Dataflow-Oriented Classification of GPU-Accelerated HE |

### Module 7 — Medical & federated (7)
| Slug | Paper |
|---|---|
| `medblindtuner-2024` | MedBlindTuner — *most directly relevant to PREMAL* |
| `federated-vit-medical-2025` | Privacy-Preserving Federated ViT with Lightweight HE in Medical AI |
| `fedshield-llm-2025` | FedShield-LLM |
| `dictpfl-2025` | DictPFL |
| `secure-aggregation-mphe-2025` | Secure Aggregation using Multiparty HE |
| `hybrid-he-fl-2026` | Towards PPFL using Hybrid HE |
| `disposable-key-vit-2024` | Disposable-key-based Image Encryption for ViT |

*Total: 1 + 6 + 12 + 16 + 5 + 5 + 8 + 7 = **60 decks**.*

---

## 6. The `/slides/` tile page

- Header explaining the collection and pointing new students at the Primer deck first.
- **Filter chips** (module, year, "FHE-only vs hybrid vs MPC") and a text search box — vanilla JS,
  no dependencies, matching the existing site's minimal style.
- **Tiles** in a responsive grid, generated from `_data/decks.yml`. Each tile:
  module colour stripe · paper title · authors · year badge · one-line hook · slide count ·
  link to the deck. Tiles are keyboard-navigable and the grid reflows to one column on mobile.
- A "start here" row at the top pinning the Primer, the 2024 survey, and the 2026 SoK.
- Site nav in `_layouts/default.html` becomes: Home · All papers · **Slides** · GitHub.

---

## 7. Authoring process per paper

1. `pdftotext -layout` the PDF into the scratchpad (verified working).
2. Read it — abstract, method, evaluation, limitations — and pull the numbers that matter.
3. Write `slidev/decks/<slug>.md` against `DECK_TEMPLATE.md`.
4. Add the record to `_data/decks.yml`.
5. Build the deck locally and eyeball it for overflow / broken diagrams.
6. Commit per module.

**Order of work:** Primer → Module 1 (surveys, so the map exists) → Module 2 → 3 → 5 → 7 → 6 → 4.

**Pace.** This is ~950 pages of reading and 60 decks of authoring; it will run over several
sessions. I'll keep `slidev/PROGRESS.md` as a checklist so you can see exactly where it stands and
stop or redirect at any module boundary. Module 1 will be delivered first as a sample so you can
correct the tone before I commit to the other 53 decks.

*Optional accelerator:* I can fan this out across parallel subagents (one per paper, shared template
and style guide) to cut the wall-clock substantially. Your standing instruction is not to use
subagents unless you ask, so I won't unless you say so here.

---

## 8. Verification before merge

- [ ] `bundle exec jekyll serve` builds clean; `/slides/` renders and every tile link resolves.
- [ ] All 60 decks build with no Vite errors; spot-check ~10 in a browser at 1280×720.
- [ ] No deck has overflowing slides at the default aspect ratio.
- [ ] Base paths correct — decks work under `/PREMAL/`, not just at root.
- [ ] Existing pages (home, `/summaries/`) unchanged.
- [ ] `papers_Transformer_FHE/` still gitignored; no PDF enters git.
- [ ] Dark-mode / print sanity check on a couple of decks.

---

## 9. Decisions I need from you

1. **`brew install node`** — yes / no (blocker).
2. **Deployment** — Option A (GitHub Actions, recommended) or Option B (commit built output)?
3. **HETAL** — one merged deck (my proposal) or two separate decks?
4. **Parallel subagents** to speed up authoring — yes / no?
5. Anything about the **template in §3** you want changed before I write 60 decks against it?
