# Deck template and style guide

Every deck in `src/` follows this skeleton. Read `src/primer-fhe-transformers.md` for a
complete worked example — it is the reference implementation, not just a sample.

**Audience:** a student who knows a little machine learning and *no cryptography*. They have seen a
transformer diagram once. They have never heard of CKKS, ciphertext slots, or multiplicative depth.

**The one rule that matters:** if a sentence would not survive being read aloud to that student,
rewrite it. Short sentences. Define every symbol the first time it appears. No unexplained acronym,
ever — including in slide titles.

---

## Headmatter

Copy this verbatim, changing only the four marked fields.

```yaml
---
theme: default
title: "NEXUS — Secure Transformer Inference Made Non-interactive"   # CHANGE
info: |
  PREMAL teaching deck. Zhang et al., NDSS 2025.                     # CHANGE
class: text-center
transition: slide-left
mdc: true
fonts:
  sans: Inter
  mono: Fira Code
drawings:
  persist: false
---
```

`mdc: true` is what makes `**ciphertext**{.ct}` work. Do not remove it.

---

## The 15 slides

Slide counts are a guide, not a cage — split a step slide in two if it is crowded. But keep the
*order*, and keep every numbered section present. Students move between decks; the rhythm is the
point.

### 1. Title
`layout: cover`. Paper title, authors, venue and year, and **one sentence** saying what the paper
is trying to do — in plain words, not the abstract's words.

### 2. The problem, in plain words
Analogy first, technical statement second. Use `<div class="analogy">` (it self-prefixes with
"Think of it like this — "). Then two or three bullets stating the problem precisely.

### 3. What you need to know first
*Only* the background this specific paper needs. Link back to the primer rather than re-teaching
CKKS: `[Primer deck](../primer-fhe-transformers/)`. If the paper needs nothing new, say so and move
on — a four-line slide is a good slide.

### 4. The one big idea
One sentence in a `<div class="big-idea">`, and one diagram. If a student remembers a single slide
from the deck, this is it. Resist putting a second idea here.

### 5–7. How it works, step by step
Two or three slides. Build them up with `<v-clicks>` so each piece lands in order. Mermaid for
architecture and dataflow; the shared components for anything the collection repeats.

### 8. A tiny worked example
Concrete numbers on a toy case — a 4-slot ciphertext, a 2×2 matrix, a 3-token sequence. This is the
slide that converts "I followed the words" into "I see the mechanism". Never skip it.

### 9. Threat model
Who is honest, who is curious, what each party learns, and what leaks anyway. Same three-row table
on every deck so students can compare across papers:

```md
| Party | Sees | Never sees |
|---|---|---|
| Client | its own input, the final answer | the model weights |
| Server | ciphertexts, the model | the input, the answer |
| Network observer | message sizes and timing | contents |
```

Add a `<div class="warn">` for anything that leaks in practice (round counts, sequence length,
activation sparsity patterns).

### 10. Results
Three to five numbers that matter, drawn with `<CostBars>`. Not a screenshot of the paper's table.
Always name the hardware the numbers were measured on — a footnote is fine, silence is not.

### 11. What it costs
The trade-off the paper accepts: multiplicative depth, interaction rounds, accuracy loss, client
compute, memory. Every paper pays something. Name it.

### 12. What it does not solve
Honest limitations, stated plainly. Include limits the authors admit *and* limits visible from the
outside. This slide is why the deck is trustworthy.

### 13. Where it sits
The lineage slide. A small mermaid graph placing this paper among its neighbours, with the current
paper highlighted. Keeps the collection navigable.

### 14. Key terms
`<dl class="glossary">` with every term the deck introduced, one line each.

### 15. Check yourself
Two or three questions, answers hidden behind `<v-click>` and wrapped in `<div class="answer">`.
Questions should test the mechanism, not recall of a number.

---

## Colour semantics — fixed across all 60 decks

Never use these colours to mean anything else.

| Class | Colour | Means |
|---|---|---|
| `.ct` | blue | encrypted / ciphertext |
| `.pt` | grey | plaintext |
| `.cost` | orange | the expensive operation |
| `.win` | green | this paper's contribution |
| `.leak` | red | what leaks or what breaks |

Inline use with MDC: `the **input**{.ct} stays encrypted while **weights**{.pt} are in the clear`.

In mermaid, use `classDef` with the same hex values:

```
classDef ct fill:#ddf4ff,stroke:#0969da,color:#0969da
classDef pt fill:#f0f2f4,stroke:#656d76,color:#656d76
classDef cost fill:#fff1e5,stroke:#bc4c00,color:#bc4c00
classDef win fill:#dafbe1,stroke:#1a7f37,color:#1a7f37
```

## Callout boxes

| Markup | Use for |
|---|---|
| `<div class="analogy">…</div>` | everyday comparison (auto-prefixed) |
| `<div class="big-idea">…</div>` | the single core claim |
| `<div class="note">…</div>` | an aside worth keeping |
| `<div class="warn">…</div>` | a leak, a caveat, a wrong intuition to unlearn |

## Shared components

```html
<SlotGrid :values="[3,1,4,1]" label="ct_x" :highlight="[0]" :total-slots="8192" />
<SlotGrid :values="[3,1,4,1]" label="rot(ct_x, 1)" :rotate="1" />
<DepthBar :total="24" :steps="[
  { label: 'Q·Kᵀ', cost: 1 },
  { label: 'softmax poly', cost: 8, expensive: true },
  { label: 'bootstrap', bootstrap: true },
]" caption="depth budget across one attention head" />
<RoundTrip :rounds="4" real-rounds="10,509" label="BOLT" note="one round per non-linear op" />
<RoundTrip :rounds="1" non-interactive label="NEXUS" note="client may go offline" />
<CostBars unit="s" log :items="[
  { label: 'plaintext', value: 0.02 },
  { label: 'BOLT', value: 185 },
  { label: 'NEXUS', value: 37.3, highlight: true },
]" />
```

## The four hard operators — the spine of the collection

Every deck should make clear which of these four the paper attacks. Use the same names each time.

| Operator | Why it is hard under FHE |
|---|---|
| **Softmax** | needs `exp` and a division, over a range that depends on the data |
| **LayerNorm** | needs an inverse square root, again data-dependent |
| **GELU** | not a polynomial — but the easiest of the four to approximate |
| **Attention matmul** | ciphertext × ciphertext, so it burns depth and needs rotations |

## Sourcing

Every number and every claim carries a section or table reference into the paper, as
`<span class="src">[§5.2]</span>` or in the slide footer. If you cannot find the reference, do not
state the number.

Do not invent results. If the paper does not report end-to-end latency, say "not reported" — that
is useful information for a student comparing papers.

## Length and overflow

Target 15–18 slides. Slides are 980×552 at the default aspect ratio; a slide with more than about
eight bullet lines plus a diagram will overflow. Build the deck and look at it before committing.
