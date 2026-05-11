# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

PREMAL is a literature collection for a research project on **Fully Homomorphic Encryption (FHE) for Privacy-Preserving Machine Learning** — with emphasis on medical/healthcare applications, federated learning, and encrypted neural network inference. There is no application code yet; the repository currently exists as a curated reading set under `papers/`.

## Repository layout notes

- `papers/` contains ~50 PDFs (FHE + ML survey, primitives, federated learning, medical imaging, activation-function design, etc.). The directory is **gitignored** — PDFs live only on the maintainer's machine and are not part of version control. Do not attempt to commit them.
- `README.md` is currently empty.
- There is no source tree, build system, package manifest, or test suite. If future work introduces code, this file should be updated with the actual build/test commands rather than placeholders.

## Working with the PDF library

When asked about a specific paper, read the PDF directly via the Read tool (it supports PDFs; use the `pages` parameter for files over 10 pages). Filenames follow the pattern `Author et al. - YEAR - Title.pdf`, which is enough to locate a work by author or year without opening every file.
