# Making teaching materials that actually teach

A general method for building slide decks and other explanatory materials that carry a student
from "I have never heard of this" to "I could explain the mechanism to someone else".

Written for technical subjects where the difficulty is *conceptual* — cryptography, distributed
systems, machine learning, compilers, statistics — but nothing here is specific to a field or to a
slide tool. Companion to `slidev/DECK_TEMPLATE.md`, which applies these rules to one particular
collection.

---

## 1. Five principles

Everything below follows from these.

1. **Teach the mechanism, not the vocabulary.** A student who can define "bootstrapping" has
   learned a word. A student who has watched a noise budget run out and be refilled has learned the
   thing. Words are labels you attach *after* the idea has landed.
2. **Concrete before abstract, always.** Four numbers a student can check by hand beat a general
   formula they must take on faith. Give the special case first, then say "and this works for any
   n".
3. **The student must be able to break it.** Understanding is knowing the boundary — when the
   method fails and why. A demonstration that only ever succeeds teaches the happy path and hides
   the concept.
4. **Every claim carries its source.** A number without a reference is a rumour. An illustrative
   value must be labelled illustrative. Teaching materials are trusted more than papers are, so
   they must earn it harder.
5. **One idea per slide, one slide per idea.** If you cannot say what a slide is for in one
   sentence, it is two slides.

---

## 2. Before you write anything: answer three questions

Write the answers down. They govern every later decision.

| Question | Why it decides things |
|---|---|
| **Who is the student, exactly?** "Second-year undergraduate who has seen linear algebra and no cryptography." | Sets which words need defining and which can be assumed. Vague audiences produce material that is simultaneously too hard and too slow. |
| **What is the one thing they must remember in six months?** One sentence. | Becomes the "big idea" slide, and everything else is either building to it or following from it. If you cannot name it, you are not ready to write. |
| **What will they be able to *do* afterwards?** "Read any paper in this field and say which of four problems it attacks." | Turns a lecture into a capability, and gives you the self-check questions at the end. |

**The one rule that enforces all three:** if a sentence would not survive being read aloud to that
specific student, rewrite it.

There is a fourth question — *what kind of material is this?* — and because it changes the shape of
everything downstream, it gets its own section next.

---

## 3. First, decide what kind of thing you are teaching

The same idea is taught differently depending on **how settled it is**. Decide this before you
sketch the arc, because it changes what the student's real question is, what earns their trust, and
which slides you are not allowed to cut.

### 3.1 The four kinds

| Kind | What it is | The student's real question | What earns their trust |
|---|---|---|---|
| **Settled mechanism** | How something works, agreed by everyone. TCP, backpropagation, how CKKS encrypts. | *How does it work?* | A worked example they can check by hand |
| **A single paper's claim** | One group's system or result. Usually recent, usually contested or untested. | *Is this true, and what is actually new?* | Evidence, scope, and honest limits |
| **A field** | A body of papers that disagree. A survey, a literature map, "the state of X". | *How do I navigate this?* | A taxonomy that survives contact with the papers |
| **A practice** | How to do something well. Craft, not knowledge. | *How do I do it?* | Worked cases and named failure modes |

### 3.2 How to tell which you have

The test is **independent corroboration, not age**.

- Would three experts, asked separately, state it the same way? → settled mechanism.
- Does it appear in textbooks or in multiple independent implementations? → settled mechanism.
- Is the evidence one group's experiments, on their own hardware, with no independent replication?
  → a claim, however famous the venue and however recent or old.

A five-year-old paper with a thousand citations and no reproduction is still a claim. A two-year-old
technique reimplemented by four independent groups is closer to settled. Prestige is not evidence.

### 3.3 What changes

| | Settled mechanism | A paper's claim | A field |
|---|---|---|---|
| **The big-idea slide** says | *how it works* | **the delta** — what is new here, with the inherited machinery named and set aside | **the axis of disagreement** — what the papers actually differ about |
| **Sourcing** | none needed for the mechanism; cite the scope conditions | every number carries a section or table reference | every comparison carries the conditions it was measured under |
| **Cannot be cut** | the worked example | *what it costs* and *what it does not solve* | the warning that the numbers are not comparable |
| **Structure that works** | invent → break → fix (§5.2) | problem → delta → mechanism → evidence → limits | one organising question, answered by every paper in turn |
| **Biggest trap** | staying abstract | teaching the paper in the paper's own order | a taxonomy that flatters the survey and fits nothing |

### 3.4 If it is a paper, do not teach it in its own order

Papers are written to defend a contribution against reviewers: related work, preliminaries, method,
then twelve pages of evaluation. That order is hostile to a learner. Reorder to §4 every time — the
paper's Section 3 is usually your slide 5. And strip the authors' framing: say what the work does
in your own words first, then note where the abstract oversells.

Two arc changes specifically for a paper:

- **The big-idea slide becomes the delta.** Not "here is the clever thing" but "here is what is new
  *here*, and here is the machinery it inherited". Students habitually credit a whole pipeline to
  the paper that added one stage to it.
- **"What it costs" and "what it does not solve" stop being optional.** For a settled mechanism they
  are good practice. For a paper they are the reason a student should trust your deck over the
  abstract. Include limits the authors admit *and* limits visible from outside.

### 3.5 Most material is mixed — so mark the seams

A real deck teaches some settled mechanism and some contested claims. The failure is letting them
wear the same voice, because the student cannot then tell which parts to hold loosely.

Make the difference **visible on the slide**:

> A ciphertext multiplication multiplies the noise of both operands.
>
> This system reports 37.3 s for BERT-Base — amortised over 32 batched inputs, on 4×A100
> <span class="src">[Table VI]</span>.

The first is stated plainly because it is how the mechanism works. The second carries its number,
its conditions and its source, because it is a measurement someone made once. Same slide, two
different kinds of truth, and the student can see which is which.

**And "settled" is not "unconditional".** Established results have scope conditions — assumptions,
parameter ranges, hardware regimes. State them. A mechanism taught without its boundary is the
thing students later misapply.

### 3.6 The prior question: does this paper deserve a deck at all?

Often the *concept* deserves the teaching and the paper is merely the best case study for it.

- **One deck per paper** is right when the goal is navigating a literature — a reading map, a
  survey course, a lab's onboarding.
- **One deck per concept, with two or three papers as evidence**, teaches better for almost
  everything else. Three paper decks covering one idea leave a student with three stories and no
  idea; one concept deck with three pieces of evidence leaves them with the idea and a sense of how
  well it is supported.

Ask which you are building before you write sixty decks of the wrong one.

---

## 4. The shape of a deck

An arc that reliably works. Keep the *order* even when you change the parts — students who move
between your materials learn the rhythm and stop spending attention on navigation.

| # | Slide | Job |
|---|---|---|
| 1 | **Title** | The subject and **one sentence** on what it is for. Not the abstract's words — yours. |
| 2 | **The problem, in plain words** | An everyday analogy first, the technical statement second. |
| 3 | **What you need to know first** | *Only* what this specific topic needs. Link elsewhere for the rest. A four-line slide is a good slide. |
| 4 | **The one big idea** | One sentence, one diagram. If they remember one slide, this is it. Resist adding a second idea. For a paper this slide is **the delta** (§3.3); for a field, the axis of disagreement. |
| 5–8 | **How it works, step by step** | Built up progressively so each piece lands in order. This is the body. |
| 9 | **A tiny worked example** | Concrete numbers on a toy case. This is where "I followed the words" becomes "I see the mechanism". Never skip it. |
| 10 | **Hands-on** | The student drives it themselves. See §7. |
| 11 | **What it costs** | Every method pays something — time, accuracy, assumptions, complexity. Name the price. |
| 12 | **What it does *not* solve** | Honest limits. This slide is why the whole deck is trustworthy. |
| 13 | **Where it sits** | The map: this idea's place among its neighbours. Keeps a course navigable. |
| 14 | **Key terms** | Glossary of every term you introduced, one line each. |
| 15 | **Check yourself** | 2–3 questions with hidden answers. See §10. |
| 16 | **Where to go next** | Three or four specific onward paths, each with a reason to take it. |

Slide counts are guidance, not a cage. Split a crowded step slide in two. But keep every numbered
section present.

---

## 5. How to explain a hard idea

Six moves, in rough order of power.

### 5.1 Analogy first, technical statement second

Open with something from ordinary life, then immediately give the precise version. The analogy buys
you the student's attention and a mental shape to hang details on; the technical statement stops
the analogy from becoming the belief.

> Think of it like a glovebox in a laboratory: you lock the sample inside, the technician reaches
> in through sealed gloves and rearranges it, and hands the box back still locked.
>
> Formally: an encryption scheme is homomorphic if operations on ciphertexts correspond to
> meaningful operations on the plaintexts.

**Then retire the analogy.** Say where it breaks before a student discovers the gap and distrusts
everything else. Every analogy is wrong somewhere; the honest move is to name where.

### 5.2 Invent it, break it, fix it

The strongest structure available for a technical idea, because it makes the real design feel
*inevitable* instead of arbitrary.

1. **Invent** the naive version with the student. Make it as simple as possible — one line if you
   can. Show that it genuinely works on an example.
2. **Break** it. Find the smallest case that fails, and let them see it fail.
3. **Fix** it — and the real design turns out to be the fix.

A student who has watched the simple version fail will never again ask "why is this so
complicated?", because they watched the complication get earned. Compare: presenting the finished
design and listing its features, which teaches nothing about *why*.

### 5.3 Concrete numbers, small enough to check

Pick values a student can verify with mental arithmetic, then say plainly that the real thing uses
the same three lines with 15-digit numbers. Toy scale is a pedagogical choice, not a simplification
you should be embarrassed about — but label it, or you have misled them about the real cost.

### 5.4 Show the reversal

Wherever the new setting inverts an intuition the student already has, say so explicitly and put
the two side by side.

> In ordinary code, wide layers are cheap and deep ones are expensive. Under encryption it is the
> other way round.

Unstated reversals are where confusion breeds, because the student silently keeps applying the old
rule and blames themselves when nothing adds up.

### 5.5 Name things after they have been seen

Introduce the phenomenon, let the student watch it happen, *then* give it its name. "That growth
you just watched is called noise, and the point where it ruins the answer is the noise budget."
Names given first are noise; names given after are handles.

### 5.6 Build up, don't dump

Reveal a complex slide one piece at a time, in the order you would say them aloud. A diagram with
nine boxes appearing at once is a wall; the same diagram assembled in four steps is a story. The
same applies to prose: three bullets revealed in sequence out-teach a paragraph containing the same
words.

---

## 6. Visualizations that stick

### 6.1 Rules

- **One visual, one idea.** Two ideas in a diagram means neither is remembered.
- **Show state changing, not the final state.** A before/after pair beats a labelled end result. A
  thing the student can *step* beats both.
- **Draw the mechanism, not the artefact.** A diagram of how the parts interact teaches; a
  screenshot of someone's results table does not.
- **Never a chart without units and a baseline.** What is measured, in what units, compared to
  what, on what hardware. If you can't say, don't chart it.
- **Reuse the same picture for the same concept** across an entire course. Recognition is free
  learning; a new metaphor for an old idea costs the student a re-derivation.
- **Prefer a drawn diagram to a photo of a whiteboard, and a small table to a big one.** If a table
  has more than about five rows, it is a chart or an appendix.

### 6.2 Fix a colour vocabulary and never break it

Decide once, at the start of a course, what each colour *means* — then use it identically in every
diagram, chart, callout and inline mention. Students stop needing legends.

| Colour | Might mean |
|---|---|
| Blue | the protected / transformed thing |
| Grey | the ordinary / plaintext thing |
| Orange | the expensive step |
| Green | the contribution, or the correct outcome |
| Red | the failure, the leak, the thing that breaks |

Write the choice into a shared stylesheet so it cannot drift. And never encode meaning in colour
*alone* — pair it with a label, a shape or a position, so the material still works for a colourblind
student and in a bad projector.

### 6.3 Things worth drawing that people usually write instead

- A **budget draining** (time, memory, depth, error tolerance) as a bar, not a number.
- A **conversation between parties** as arrows over time, not a paragraph about rounds.
- **A data layout** as labelled cells, not as index notation.
- **Growth** as a shape — the difference between linear and quadratic is a picture, not a word.
- **A taxonomy** as a small tree with the current item highlighted, repeated in every deck of the
  course so students always know where they are.

---

## 7. Interactivity

An interactive widget is not decoration; it is the fastest known way to convert a rule into an
intuition. But most are useless. These rules separate the two.

### 7.1 The widget must actually compute

Never fake it. If the panel shows `b = 59`, it must have calculated 59 from the inputs, and it must
recalculate when they change. A canned animation that *depicts* a computation teaches a student to
trust a picture; a real one lets them try the case you didn't think of and get a right answer. It
also protects you: fake demos drift out of agreement with the text and nobody notices.

### 7.2 Make failure reachable — this is the important one

Every hands-on element should have a setting where **it visibly goes wrong**, and the student
should be told how to find it.

> **Press "× ciphertext" twice.**

If every input produces success, you have built a toy. The moment of learning is watching the
output turn wrong and understanding *which* dial did it. Design the parameter ranges so the
failure boundary sits inside them — and check that it does, because a control that cannot change
the outcome is a control that teaches nothing.

### 7.3 Budget your controls

Two or three controls per widget. Each one should map to exactly one concept the student is meant
to isolate. A panel with eight sliders is a flight simulator: the student wiggles things at random
and concludes nothing. If you need more dials, you need another widget.

### 7.4 The default state must already teach

Students who never touch a control should still learn from what is on screen. Open on a meaningful,
correct, representative case — not on zeros, not on an error state.

### 7.5 Show the working, not just the answer

Print the intermediate line: `b = ⟨a,s⟩ + Δ·m + e = 24 + 16 + 3 = 43`. The answer alone is a magic
box, which is exactly the thing you are trying to dispel. Seeing the arithmetic recompute as a
slider moves is where the rule becomes visible.

### 7.6 Immediate, and reversible

- Feedback within ~100 ms of the input. Anything slower breaks the cause–effect link.
- Always a **reset**. A student who has wandered into a confusing state must be able to get home
  without reloading.
- No dead ends and no lost work: the widget should be robust to every value its controls allow.

### 7.7 Tell them what to try

Beside every interactive element, put one instruction. "Drag the range out and watch both errors
explode." Left alone, most students click twice and move on. A specific prompt is the difference
between a widget being used and being decoration.

---

## 8. Animation

Motion is meaning. Use it for exactly that and nothing else.

- **Animate a transition, never an entrance.** A value sliding to a new position teaches that it
  moved. A title flying in from the left teaches nothing and costs attention.
- **Let the motion encode the operation.** If the concept is a rotation, the picture should rotate.
  If it is a fold, it should fold. The gesture is the explanation.
- **Keep it short** — 200–400 ms. Long animations are read as delays, and delays get skipped.
- **One motion at a time.** Two simultaneous animations compete and the student sees neither.
- **Respect `prefers-reduced-motion`**, and make sure the material is complete without any motion
  at all. Some people will read it on paper.
- **Never animate instead of explaining.** If the animation is the only place the idea appears, the
  idea is not in your material.

---

## 9. Honesty, which is also pedagogy

Teaching materials get quoted, and students calibrate their standards on them.

- **Cite every number** with a section, table or source, inline. If you cannot find the reference,
  do not state the number.
- **Label illustrative values.** "These magnitudes are toy values; the rules they follow are the
  real rules."
- **Report what is not known.** "Not reported by the authors" is useful information, not a gap.
- **Give the limits their own slide.** What the method does not solve, including limits the authors
  do not admit. This is the slide that makes the other fifteen believable.
- **Teach the student to read critically.** Show two numbers that look comparable and are not, and
  explain why. Nothing else you do will serve them as long.
- **When you simplify, say so** — one line, and say what the simplification hides.
- **Keep claims and settled facts in different voices** (§3.5). A measurement carries its number,
  its conditions and its source; a mechanism is stated plainly. Blurring the two teaches students to
  hold everything with the same, wrong, confidence.

---

## 10. Self-check questions

Two or three at the end, answers hidden until clicked.

- **Test the mechanism, not recall.** Bad: "How many rounds does X need?" Good: "X needs 7 rounds
  and Y needs 1. Why might X still be the right choice on a fast local network?"
- **Ask "why", "what would happen if", and "which would you choose"** — never "what is the
  definition of".
- **The answer should teach**, not just adjudicate. Two or three sentences that add something the
  slides did not spell out.
- **Aim for one question per major idea** in the deck. If an idea has no reasonable question, it
  might not have earned its slides.

---

## 11. Slide craft

- **A slide is a visual aid, not a document.** Roughly eight lines of text plus one visual is the
  ceiling. Detail that exceeds this belongs in speaker notes or a handout.
- **Titles are claims, not labels.** "Noise decides whether your answer survives" beats "Noise".
- **Define every symbol the first time it appears**, on the slide where it appears.
- **No unexplained acronym, ever** — including in titles.
- **Readable at the back of the room**: body text no smaller than ~18 pt equivalent, and check it
  at real projection size, not on your laptop.
- **Fixed aspect ratio discipline.** Decide the size, and verify nothing overflows it.
- **Dark and light** both need to work; so does printing.

---

## 12. Quality gates

Do not ship a deck that has not passed these. Automate the ones that can be automated — a check
that runs is worth ten that are remembered.

**Automated**

- [ ] Every slide fits its frame at the real aspect ratio, with all progressive reveals shown.
- [ ] Every interactive element still reacts, and its arithmetic is asserted against known-correct
      values.
- [ ] Every internal link resolves.
- [ ] Every asset the page references is actually present in the published output.

**By eye**

- [ ] Read every slide aloud as if to the target student. Rewrite anything that stumbles.
- [ ] Each visual: could a student say what it means without the narration?
- [ ] Each number: can you point at its source right now?
- [ ] Claims and settled facts are visibly different on the slide (§3.5), and every established
      result carries its scope conditions.
- [ ] Each interactive: can you make it fail, and is the student told how?
- [ ] Light mode, dark mode, and print.
- [ ] Hand it to one person from the target audience and watch them use it **without helping**.
      Everywhere they hesitate is a defect in the material, not in the student.

---

## 13. Consistency across a course

Individual decks are easy; a coherent course is the hard part.

- **One skeleton**, reused. The arc in §4 should be recognisable in every deck.
- **One component library.** Build the recurring visual once — the budget bar, the party diagram,
  the layout grid — and reuse it. Consistency is cheaper than novelty and teaches better.
- **One vocabulary.** Keep a glossary for the whole course and use exactly those words. Synonyms
  are a tax on the student.
- **A spine.** Pick a small set of recurring questions (for example: which of these four problems
  does this attack?) and answer them in every deck. Students stop meeting isolated topics and start
  seeing one subject.
- **A map slide** in every deck showing where this piece sits, with the current piece highlighted.
- **A single index** generated from data, not hand-written, so it cannot fall out of sync with what
  exists.
- **Track progress in a file** the whole team can read, and mark what is unwritten as unwritten —
  a link to nothing costs a student's trust.

---

## 14. Anti-patterns

| Symptom | Why it fails | Do instead |
|---|---|---|
| Definition-first slide | Names without referents are noise | Show the phenomenon, then name it |
| The wall of bullets | Nothing is emphasised, so nothing is remembered | One idea per slide, revealed in steps |
| A screenshot of a results table | Unreadable, and copies someone else's framing | Redraw the 3–5 numbers that matter |
| The demo that always works | Teaches the happy path, hides the concept | Make failure reachable and signposted |
| Decorative animation | Spends attention, returns nothing | Animate transitions only |
| "Obviously", "simply", "just" | Tells a stuck student the fault is theirs | Delete the word; if it were obvious you would not be teaching it |
| An unlabelled axis | Unfalsifiable, therefore uninformative | Units, baseline, conditions |
| A new metaphor for an old idea | Forces re-derivation | Reuse the earlier picture |
| A cliffhanger with no "next" | Momentum wasted | End with three specific onward paths |
| Perfect coverage | Everything is covered, nothing lands | Cut to the one idea, link the rest |
| Teaching a paper in the paper's order | Written to defend, not to teach | Reorder to the arc (§3.4) |
| A claim stated like a fact | Student cannot tell what to hold loosely | Give measurements their conditions (§3.5) |

---

## 15. The recipe

For a new topic, in order:

1. Write the **three answers** from §2. One paragraph total.
2. **Classify the material** (§3): settled mechanism, a paper's claim, a field, or a practice. If it
   is a paper, first ask whether the *concept* is the better subject (§3.6).
3. Write the **one sentence** the student must remember in six months — for a paper, make it the
   delta.
4. Find the **smallest concrete example** that contains the whole idea. Work it by hand.
5. Find the **naive version** that fails, and the smallest case that breaks it. (For a paper: find
   the limitation the abstract does not mention.)
6. Sketch the **arc** from §4 on paper. One line per slide. Fix the order before writing prose —
   never the paper's own order (§3.4).
7. Decide the **one visual** for the big idea. If you cannot draw it, you do not understand it yet.
8. Choose **one or two hands-on moments** and, for each, the specific thing the student should try
   and the setting that makes it fail.
9. Write the slides. Short sentences. Define symbols. Cite numbers, with their conditions.
10. Write the **limits** slide honestly, and the **self-check** questions.
11. Build it and run the **automated gates** from §12.
12. Read every slide aloud. Cut a third of the words.
13. Watch one real student use it, in silence. Fix what made them pause.

---

## 16. Appendix — tooling that makes this cheap

Framework-independent, and worth building once per course:

- **An overflow checker.** Render every slide at its true size with all reveals shown, and fail on
  anything that spills. Reviewing 900 slides by eye does not happen; a script does it every build.
- **An interaction test.** Drive each widget's controls in a headless browser and assert the values
  it displays. This catches the silent failure where a component stops reacting and every slide
  still looks fine. Watch for stale mounted copies of neighbouring slides — target the visible one.
- **A data-driven index.** Generate the contents page from one machine-readable file listing every
  piece of material, so nothing is hand-maintained and unwritten items can be shown as unwritten.
- **A shared stylesheet** holding the colour vocabulary from §6.2, so semantics cannot drift
  between decks.
- **A component library** for the recurring visuals, versioned with the material.
- **Publish from a single command** that runs the build, the gates, and the deploy. A material set
  that is awkward to publish gets published rarely, and stale material teaches badly.
