# Deck progress

**20 of 61 decks written.**

`_data/decks.yml` is the source of truth for what the `/slides/` page shows. When a deck is
finished: `python3 slidev/mark-done.py <slug> <slides>` then `python3 slidev/progress.py`.

## Infrastructure

- [x] Node installed; Slidev project in `slidev/` with `package-lock.json` committed
- [x] Shared styles (`src/styles/index.css`) — fixed colour semantics across all decks
- [x] Shared components: `SlotGrid`, `DepthBar`, `RoundTrip`, `CostBars`
- [x] Interactive components: `LweDemo`, `RotateSum`, `PolyPlot`, `TinyNet`
- [x] `interact-check.mjs` — drives the hands-on deck's widgets and checks their arithmetic
- [x] `DECK_TEMPLATE.md` — the 15-slide skeleton and style guide
- [x] `build.sh` — per-deck `--base` so decks work under `/PREMAL/`
- [x] `check.mjs` — headless overflow check of every slide of every deck
- [x] `.github/workflows/pages.yml` — builds decks + Jekyll, deploys to Pages
- [x] `_data/decks.yml` — 61 records, drives the tile page
- [x] `slides.md` — `/slides/` tile page with search and filter chips
- [x] "Slides" link in the site nav

**One manual step remains:** repo → Settings → Pages → Source → **GitHub Actions**. Until that is
flipped, Pages serves `main` at root and the built decks will not appear.

## Order of work

Primer → surveys → FHE-native → hybrid → training → medical → systems → MPC baselines.

## Decks

### Start here — 2/2

- [x] `primer-fhe-transformers` — Why transformers are hard to encrypt (PREMAL, 2026) · 15 slides
- [x] `fhe-by-hand` — FHE by hand — build the cipher, then run a network in it (PREMAL, 2026) · 21 slides

### Surveys & where the field stands — 6/6

- [x] `survey-private-transformer-inference-2024` — A Survey on Private Transformer Inference (Li et al., 2024) · 16 slides
- [x] `sok-approx-he-llm-2026` — SoK: Private LLM Inference using Approximate Homomorphic Encryption (Al Badawi et al., 2026) · 16 slides
- [x] `ppml-systematic-review-2025` — Towards Efficient Privacy-Preserving Machine Learning — A Systematic Review (Zeng et al., 2025) · 16 slides
- [x] `pragmatic-crypto-comparison-2026` — A Pragmatic Comparison of Cryptographic Computation Technologies for ML (Taubert et al., 2026) · 16 slides
- [x] `fhe-vs-garbled-circuits-2025` — Comparison of FHE and Garbled Circuit Techniques in PPML Inference (Cheerla et al., 2025) · 16 slides
- [x] `shuffling-defense-insecurity-2026` — On the (In-)Security of the Shuffling Defense in Transformer Secure Inference (Li et al., 2026) · 16 slides

### FHE-native, non-interactive inference — 12/12

- [x] `thex-2022` — THE-X — Privacy-Preserving Transformer Inference with HE (Chen et al., 2022) · 18 slides
- [x] `polynomial-transformers-2023` — Converting Transformers to Polynomial Form for Secure Inference (Zimerman et al., 2023) · 20 slides
- [x] `power-softmax-2024` — PowerSoftmax — Towards Secure LLM Inference over Encrypted Data (Zimerman et al., 2024) · 20 slides
- [x] `nexus-2024` — NEXUS — Secure Transformer Inference Made Non-interactive (Zhang et al., 2024) · 21 slides
- [x] `thor-2024` — THOR — Secure Transformer Inference with Homomorphic Encryption (Moon et al., 2024) · 20 slides
- [x] `ellmo-2026` — ELLMo — Packing- and Depth-Aware Encrypted Transformer Inference (Guzelhan et al., 2026) · 19 slides
- [x] `euston-2026` — Euston — Efficient and User-Friendly Secure Transformer Inference (Gao et al., 2026) · 18 slides
- [x] `stip-2026` — STIP — Non-Interactive Transformer Inference via Compact Packing (Wang et al., 2026) · 19 slides
- [x] `atlas-2026` — ATLAS — Automated Approximation of Transformers (Xie et al., 2026) · 19 slides
- [x] `private-llm-inference-edbt-2026` — Private LLM Inference with Homomorphic Encryption (tutorial) (Lim et al., 2026) · 18 slides
- [x] `fhe-llama3-2026` — Fully Homomorphic Encryption on Llama 3 (Abdennebi et al., 2026) · 17 slides
- [x] `secure-transformer-protocol-2023` — Secure Transformer Inference Protocol (Yuan et al., 2023) · 18 slides

### Hybrid HE + MPC — 0/16

- [ ] `iron-2022` — Iron — Private Inference on Transformers (Hao et al., 2022)
- [ ] `bolt-2023` — BOLT — Privacy-Preserving, Accurate and Efficient Inference (Pang et al., 2023)
- [ ] `bumblebee-2023` — BumbleBee — Secure Two-party Inference for Large Transformers (Lu et al., 2023)
- [ ] `nimbus-2024` — Nimbus — Secure and Efficient Two-Party Inference for Transformers (Li et al., 2024)
- [ ] `ciphergpt-2023` — CipherGPT — Secure Two-Party GPT Inference (Hou et al., 2023)
- [ ] `cipherformer-2024` — CipherFormer — Private Inference with Low Round Complexity (Wang & Kuang, 2024)
- [ ] `east-2023` — East — Efficient and Accurate Secure Transformer Framework (Ding et al., 2023)
- [ ] `primer-2023` — Primer — Fast Private Transformer Inference on Encrypted Data (Zheng et al., 2023)
- [ ] `blb-2025` — BLB — Breaking the Layer Barrier (Xu et al., 2025)
- [ ] `encformer-2026` — EncFormer — Secure and Efficient Transformer Inference (Zhu et al., 2026)
- [ ] `ensi-2025` — ENSI — Efficient Non-Interactive Secure Inference for LLMs (He et al., 2025)
- [ ] `cipherprune-2025` — CipherPrune — Efficient and Scalable Private Transformer Inference (Zhang et al., 2025)
- [ ] `comet-2025` — Comet — Private Inference by Predicting Activation Sparsity (Yan et al., 2025)
- [ ] `key-switching-overhead-2026` — Reducing Key-Switching Overhead in Two-Party Transformer Inference (Yang et al., 2026)
- [ ] `encrypted-prompt-2023` — LLMs Can Understand Encrypted Prompt (Liu & Liu, 2023)
- [ ] `high-accuracy-ppl-acl-2025` — Powerformer — High-Accuracy Privacy-Preserving Language Modeling (Park et al., 2025)

### Training & fine-tuning under encryption — 0/5

- [ ] `hetal-2023` — HETAL — Privacy-preserving Transfer Learning with HE (Lee et al., 2023)
- [ ] `blindtuner-2024` — BlindTuner — Encrypted Fine-tuning of Transformers (Panzade et al., 2024)
- [ ] `privtuner-2024` — PrivTuner — Homomorphic Encryption with LoRA (Li et al., 2024)
- [ ] `encryption-friendly-llm-2024` — Encryption-Friendly LLM Architecture (Rho et al., 2024)
- [ ] `inhibitor-2023` — The Inhibitor — ReLU and Addition-Based Attention under TFHE (Brännvall & Stoian, 2023)

### Medical & federated — 0/7

- [ ] `medblindtuner-2024` — MedBlindTuner — Fine-tuning on Biomedical Images with FHE (Panzade et al., 2024)
- [ ] `federated-vit-medical-2025` — Privacy-Preserving Federated Vision Transformer in Medical AI (Amin et al., 2025)
- [ ] `fedshield-llm-2025` — FedShield-LLM — Secure Federated Fine-Tuning of an LLM (Mia & Amini, 2025)
- [ ] `dictpfl-2025` — DictPFL — Private Federated Learning on Encrypted Gradients (Xue et al., 2025)
- [ ] `secure-aggregation-mphe-2025` — Secure Aggregation using Multiparty Homomorphic Encryption (Hosseini et al., 2025)
- [ ] `hybrid-he-fl-2026` — Towards Privacy-Preserving Federated Learning using Hybrid HE (Costa et al., 2026)
- [ ] `disposable-key-vit-2024` — Disposable-key-based Image Encryption for Vision Transformer (Aso et al., 2024)

### Systems & hardware acceleration — 0/8

- [ ] `encryptedllm-2025` — EncryptedLLM — LLM Inference via GPU-Accelerated FHE (de Castro et al., 2025)
- [ ] `cachemir-2026` — Cachemir — FHE Inference of Generative LLMs with KV Cache (Yu et al., 2026)
- [ ] `cryptogen-2026` — CryptoGen — Secure Generation with Encrypted KV-Cache Reuse (Zhang et al., 2026)
- [ ] `aegis-2026` — AEGIS — Long-Sequence HE Transformer Inference on Multi-GPU (Gong & Ran, 2026)
- [ ] `fame-2025` — FAME — FPGA Acceleration of Secure Matrix Multiplication (Xu et al., 2025)
- [ ] `chameleon-2024` — Chameleon — FHE Scheme Switching Acceleration on GPUs (Wang et al., 2024)
- [ ] `multi-gpu-encrypted-2025` — A Scalable Multi-GPU Framework for Encrypted Large-Model Inference (Jayashankar et al., 2025)
- [ ] `gpu-he-dataflow-2026` — Dataflow-Oriented Classification of GPU-Accelerated HE (Nozaki et al., 2026)

### Pure MPC baselines — 0/5

- [ ] `mpcformer-2023` — MPCFormer — Fast, Performant and Private Transformer Inference (Li et al., 2023)
- [ ] `puma-2023` — PUMA — Secure Inference of LLaMA-7B in Five Minutes (Dong et al., 2023)
- [ ] `secformer-2024` — SecFormer — Fast and Accurate Private Inference via SMPC (Luo et al., 2024)
- [ ] `shaft-2025` — SHAFT — Secure, Handy, Accurate and Fast Transformer Inference (Kei & Chow, 2025)
- [ ] `sigma-2023` — Sigma — Secure GPT Inference with Function Secret Sharing (Gupta et al., 2023)

## Local commands

```sh
cd slidev
npm install                       # once
npx slidev src/nexus-2024.md      # live preview while authoring
./build.sh                        # build every deck into ../decks/
./build.sh nexus-2024             # build one
node check.mjs                    # overflow-check every built deck
node interact-check.mjs           # drive the hands-on deck's widgets
BASE_PREFIX=/ ./build.sh          # root-served preview instead of /PREMAL/
```

Full site, the way CI builds it — Jekyll first, then the decks written straight into `_site/`:

```sh
JEKYLL_ENV=production JEKYLL_NO_BUNDLER_REQUIRE=true BUNDLE_GEMFILE=/dev/null jekyll build
OUT_ROOT="$PWD/_site/decks" ./slidev/build.sh
```

**Never let Jekyll copy the decks.** It silently drops files whose names begin with an underscore,
and every Slidev deck imports a chunk Vite names `_plugin-vue_export-helper-<hash>.js`. The result
is a blank page with a single 404 in the console. `decks/` is therefore in Jekyll's `exclude:`
list, the decks are written into `_site/` after Jekyll runs, and the workflow asserts afterwards
that every asset each deck's `index.html` references is actually present.
