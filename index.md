---
layout: default
title: PREMAL — Privacy-Preserving ML with FHE
description: A curated map of papers on privacy-preserving machine learning using fully homomorphic encryption.
---

# PREMAL — Privacy-Preserving ML with FHE

A curated map of papers on **machine learning under Fully Homomorphic Encryption**. Each entry is summarized into a per-paper page with pipeline and architecture diagrams, threat model, results, and limitations.

Scope: end-to-end FHE for ML — inference, training, federated aggregation. Out of scope: pure MPC, pure differential privacy, and trusted-execution-environment work. Hybrid schemes are in.

## At a glance

<div class="stats">
<strong>5 papers</strong> · 2021–2025 · schemes: CKKS (×3), BFV (×1), TFHE / RLWE (×1) · domains: generic-vision (×3), medical (×2) · tasks: inference (×4), training (×1)
</div>

## Featured

<div class="card-grid">
  <div class="card">
    <h4><a href="summaries/badawi-2021-hcnn/">HCNN — First Homomorphic CNN on GPUs</a> <span class="badge">2021</span></h4>
    <div class="meta">Al Badawi et al. · IEEE TETC · BFV</div>
    <div class="hook"><em>First GPU-accelerated FHE CNN; MNIST in 5.16 s and CIFAR-10 in 304 s under BFV.</em></div>
  </div>
  <div class="card">
    <h4><a href="summaries/biswas-2025-hybrid-inference/">Practical and Private Hybrid ML Inference</a> <span class="badge">2025</span></h4>
    <div class="meta">Biswas et al. · arXiv · TFHE / RLWE (hybrid)</div>
    <div class="hook"><em>Server runs encrypted linear layers; client runs plaintext ReLU. No bootstrapping, no polynomial approximations.</em></div>
  </div>
</div>

## All papers

Sorted by year (newest first), then by single-inference latency (ascending). Hover the inference time to see the hardware it was measured on.

<!-- TABLE:START -->

| Title | Year | Hook | FHE | Model | Dataset | Accuracy | Inference (s) | Code |
|---|---|---|---|---|---|---|---|---|
| [Practical and Private Hybrid ML Inference with FHE](summaries/biswas-2025-hybrid-inference/)<br><span class="badge">Hybrid client/server FHE</span> | 2025 | *Server runs encrypted linear layers, client runs plaintext ReLU, no bootstrapping.* | TFHE-based RLWE (hybrid) | ResNet-20 / 18 / 34 | CIFAR-10, Tiny-ImageNet | 90.00% on CIFAR-10 (−1.70 vs ORION) | <span title="NVIDIA A100-SXM4 80GB GPU + AMD EPYC 7543 (24 cores @ 2.80GHz), 1.25 MB/s network, ResNet-20/CIFAR-10">13.65</span> | — |
| [Private pathological assessment via ML + HE](summaries/badawi-2024-pathology/)<br><span class="badge">FHE SVM kernels</span> | 2024 | *CKKS-based SVM inference on encrypted medical tabular and imaging data in seconds at 128-bit security.* | CKKS | SVM (linear, RBF, sigmoid) | WBC, CHD, BreastMNIST, PneumoniaMNIST | F1 0.85 (PneumoniaMNIST, RBF); F1 0.96 (WBC, Sigmoid) | <span title="12th Gen Intel Core i7-12700H, 64 GB RAM, Ubuntu 22.04, OpenFHE v1.1.1 (multi-threaded)">2.03</span> | [GitHub](https://github.com/caesaretos/svm-fhe) |
| [Practical Privacy-Preserving ML using FHE](summaries/brand-2023-practical-ppml/)<br><span class="badge">FHE SVM training</span> | 2023 | *Trains a linear SVM on 8,000 encrypted samples in under 45 seconds via levelled CKKS and client-assisted Newton.* | CKKS | SVM (linear) | Wisconsin Breast Cancer | 99.1% (same as plaintext) | — *(training paper)* | — |
| [Homomorphic Encryption for ML and AI Applications](summaries/arnold-2022-fhe-ml-survey/)<br><span class="badge">Nuclear NDT motivation</span> | 2022 | *Argonne proof-of-concept: CKKS-encrypted FCNN on MNIST trades 7.7 pts accuracy for 150,000× slowdown.* | CKKS | FCNN (784 → 100 → 10) | MNIST | 76.1% (−7.7 vs 83.8% plaintext) | <span title="Hardware not reported in paper">295.3</span> | — |
| [HCNN: First Homomorphic CNN on Encrypted Data with GPUs](summaries/badawi-2021-hcnn/)<br><span class="badge">First GPU HCNN</span> | 2021 | *First GPU-accelerated FHE CNN; MNIST in 5.16 s and CIFAR-10 in 304 s under BFV.* | BFV | CNN (5-layer + square activation) | MNIST, CIFAR-10 | 99% MNIST / 77.55% CIFAR-10 (scalar) | <span title="NVIDIA Tesla V100 (5120 cores, 16 GB HBM2), A*FV GPU library; amortized 0.63 ms per image when packing 8192 images">5.16</span> | — |

<!-- TABLE:END -->

The table is generated from the `comparison:` and `frontpage:` YAML blocks at the top of each `summaries/*.md` file. Do not edit rows by hand — edit the per-paper file and re-run the build (see *How to contribute*).

## Glossary

- **CKKS** — Approximate homomorphic encryption for fixed-point vectors. Operations are over polynomials with a rescaling step; tolerates small precision loss, so it dominates ML inference work.
- **BFV** / **BGV** — Exact integer homomorphic schemes. No approximation, but require careful modulus-chain budgeting for multi-layer networks.
- **TFHE** — Bit-level homomorphic encryption supporting fast programmable bootstrapping; cheap nonlinearity, expensive linear ops compared to CKKS.
- **Bootstrapping** — Refreshing a ciphertext to reduce accumulated noise so further homomorphic operations are possible. Expensive; many schemes avoid it via "levelled" parameter sets.
- **Polynomial activation** — A low-degree polynomial (often degree 2–4) that approximates ReLU / sigmoid / softmax over a training-time input range, since true ReLU is not FHE-friendly.
- **SIMD packing** — Encoding many input values into one ciphertext slot vector so a single homomorphic op processes them in parallel (used by CKKS/BFV/BGV).
- **Hybrid (client/server) FHE** — A protocol where the server holds the encrypted state for linear ops, but hands intermediate results to the client to run the nonlinearity in plaintext, then re-encrypts. Avoids bootstrapping at the cost of client interactivity and per-layer ciphertext transfers.

## How to contribute

To add a paper:

1. Drop the PDF into `papers/` (gitignored — local only).
2. Convert it to text: `pdftotext -layout papers/<filename>.pdf /tmp/<slug>.txt`.
3. Copy `extraction-template.md` to `summaries/<slug>.md` and fill in every section from the text, including the `comparison:` and `frontpage:` YAML blocks. Follow the slug convention `firstauthor-year-shortid` (lowercase, hyphenated).
4. Add a row to the table above between the `<!-- TABLE:START -->` and `<!-- TABLE:END -->` markers, sorted by year desc then latency asc.

See `extraction-template.md` (per-paper schema) and `frontpage-template.md` (front-page schema, controlled vocabularies, anti-patterns).
