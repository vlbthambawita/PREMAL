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

---

## 3. The shape of a deck

An arc that reliably works. Keep the *order* even when you change the parts — students who move
between your materials learn the rhythm and stop spending attention on navigation.

| # | Slide | Job |
|---|---|---|
| 1 | **Title** | The subject and **one sentence** on what it is for. Not the abstract's words — yours. |
| 2 | **The problem, in plain words** | An everyday analogy first, the technical statement second. |
| 3 | **What you need to know first** | *Only* what this specific topic needs. Link elsewhere for the rest. A four-line slide is a good slide. |
| 4 | **The one big idea** | One sentence, one diagram. If they remember one slide, this is it. Resist adding a second idea. |
| 5–8 | **How it works, step by step** | Built up progressively so each piece lands in order. This is the body. |
| 9 | **A tiny worked example** | Concrete numbers on a toy case. This is where "I followed the words" becomes "I see the mechanism". Never skip it. |
| 10 | **Hands-on** | The student drives it themselves. See §6. |
| 11 | **What it costs** | Every method pays something — time, accuracy, assumptions, complexity. Name the price. |
| 12 | **What it does *not* solve** | Honest limits. This slide is why the whole deck is trustworthy. |
| 13 | **Where it sits** | The map: this idea's place among its neighbours. Keeps a course navigable. |
| 14 | **Key terms** | Glossary of every term you introduced, one line each. |
| 15 | **Check yourself** | 2–3 questions with hidden answers. See §9. |
| 16 | **Where to go next** | Three or four specific onward paths, each with a reason to take it. |

Slide counts are guidance, not a cage. Split a crowded step slide in two. But keep every numbered
section present.

---

## 4. How to explain a hard idea

Six moves, in rough order of power.

### 4.1 Analogy first, technical statement second

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

### 4.2 Invent it, break it, fix it

The strongest structure available for a technical idea, because it makes the real design feel
*inevitable* instead of arbitrary.

1. **Invent** the naive version with the student. Make it as simple as possible — one line if you
   can. Show that it genuinely works on an example.
2. **Break** it. Find the smallest case that fails, and let them see it fail.
3. **Fix** it — and the real design turns out to be the fix.

A student who has watched the simple version fail will never again ask "why is this so
complicated?", because they watched the complication get earned. Compare: presenting the finished
design and listing its features, which teaches nothing about *why*.

### 4.3 Concrete numbers, small enough to check

Pick values a student can verify with mental arithmetic, then say plainly that the real thing uses
the same three lines with 15-digit numbers. Toy scale is a pedagogical choice, not a simplification
you should be embarrassed about — but label it, or you have misled them about the real cost.

### 4.4 Show the reversal

Wherever the new setting inverts an intuition the student already has, say so explicitly and put
the two side by side.

> In ordinary code, wide layers are cheap and deep ones are expensive. Under encryption it is the
> other way round.

Unstated reversals are where confusion breeds, because the student silently keeps applying the old
rule and blames themselves when nothing adds up.

### 4.5 Name things after they have been seen

Introduce the phenomenon, let the student watch it happen, *then* give it its name. "That growth
you just watched is called noise, and the point where it ruins the answer is the noise budget."
Names given first are noise; names given after are handles.

### 4.6 Build up, don't dump

Reveal a complex slide one piece at a time, in the order you would say them aloud. A diagram with
nine boxes appearing at once is a wall; the same diagram assembled in four steps is a story. The
same applies to prose: three bullets revealed in sequence out-teach a paragraph containing the same
words.

---

## 5. Visualizations that stick

### 5.1 Rules

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

### 5.2 Fix a colour vocabulary and never break it

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

### 5.3 Things worth drawing that people usually write instead

- A **budget draining** (time, memory, depth, error tolerance) as a bar, not a number.
- A **conversation between parties** as arrows over time, not a paragraph about rounds.
- **A data layout** as labelled cells, not as index notation.
- **Growth** as a shape — the difference between linear and quadratic is a picture, not a word.
- **A taxonomy** as a small tree with the current item highlighted, repeated in every deck of the
  course so students always know where they are.

---

## 6. Interactivity

An interactive widget is not decoration; it is the fastest known way to convert a rule into an
intuition. But most are useless. These rules separate the two.

### 6.1 The widget must actually compute

Never fake it. If the panel shows `b = 59`, it must have calculated 59 from the inputs, and it must
recalculate when they change. A canned animation that *depicts* a computation teaches a student to
trust a picture; a real one lets them try the case you didn't think of and get a right answer. It
also protects you: fake demos drift out of agreement with the text and nobody notices.

### 6.2 Make failure reachable — this is the important one

Every hands-on element should have a setting where **it visibly goes wrong**, and the student
should be told how to find it.

> **Press "× ciphertext" twice.**

If every input produces success, you have built a toy. The moment of learning is watching the
output turn wrong and understanding *which* dial did it. Design the parameter ranges so the
failure boundary sits inside them — and check that it does, because a control that cannot change
the outcome is a control that teaches nothing.

### 6.3 Budget your controls

Two or three controls per widget. Each one should map to exactly one concept the student is meant
to isolate. A panel with eight sliders is a flight simulator: the student wiggles things at random
and concludes nothing. If you need more dials, you need another widget.

### 6.4 The default state must already teach

Students who never touch a control should still learn from what is on screen. Open on a meaningful,
correct, representative case — not on zeros, not on an error state.

### 6.5 Show the working, not just the answer

Print the intermediate line: `b = ⟨a,s⟩ + Δ·m + e = 24 + 16 + 3 = 43`. The answer alone is a magic
box, which is exactly the thing you are trying to dispel. Seeing the arithmetic recompute as a
slider moves is where the rule becomes visible.

### 6.6 Immediate, and reversible

- Feedback within ~100 ms of the input. Anything slower breaks the cause–effect link.
- Always a **reset**. A student who has wandered into a confusing state must be able to get home
  without reloading.
- No dead ends and no lost work: the widget should be robust to every value its controls allow.

### 6.7 Tell them what to try

Beside every interactive element, put one instruction. "Drag the range out and watch both errors
explode." Left alone, most students click twice and move on. A specific prompt is the difference
between a widget being used and being decoration.

---

## 7. Animation

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

## 8. Honesty, which is also pedagogy

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

---

## 9. Self-check questions

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

## 10. Slide craft

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

## 11. Quality gates

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
- [ ] Each interactive: can you make it fail, and is the student told how?
- [ ] Light mode, dark mode, and print.
- [ ] Hand it to one person from the target audience and watch them use it **without helping**.
      Everywhere they hesitate is a defect in the material, not in the student.

---

## 12. Consistency across a course

Individual decks are easy; a coherent course is the hard part.

- **One skeleton**, reused. The arc in §3 should be recognisable in every deck.
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

## 13. Anti-patterns

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

---

## 14. The recipe

For a new topic, in order:

1. Write the **three answers** from §2. One paragraph total.
2. Write the **one sentence** the student must remember in six months.
3. Find the **smallest concrete example** that contains the whole idea. Work it by hand.
4. Find the **naive version** that fails, and the smallest case that breaks it.
5. Sketch the **arc** from §3 on paper. One line per slide. Fix the order before writing prose.
6. Decide the **one visual** for the big idea. If you cannot draw it, you do not understand it yet.
7. Choose **one or two hands-on moments** and, for each, the specific thing the student should try
   and the setting that makes it fail.
8. Write the slides. Short sentences. Define symbols. Cite numbers.
9. Write the **limits** slide honestly, and the **self-check** questions.
10. Build it and run the **automated gates** from §11.
11. Read every slide aloud. Cut a third of the words.
12. Watch one real student use it, in silence. Fix what made them pause.

---

## 15. Appendix — tooling that makes this cheap

Framework-independent, and worth building once per course:

- **An overflow checker.** Render every slide at its true size with all reveals shown, and fail on
  anything that spills. Reviewing 900 slides by eye does not happen; a script does it every build.
- **An interaction test.** Drive each widget's controls in a headless browser and assert the values
  it displays. This catches the silent failure where a component stops reacting and every slide
  still looks fine. Watch for stale mounted copies of neighbouring slides — target the visible one.
- **A data-driven index.** Generate the contents page from one machine-readable file listing every
  piece of material, so nothing is hand-maintained and unwritten items can be shown as unwritten.
- **A shared stylesheet** holding the colour vocabulary from §5.2, so semantics cannot drift
  between decks.
- **A component library** for the recurring visuals, versioned with the material.
- **Publish from a single command** that runs the build, the gates, and the deploy. A material set
  that is awkward to publish gets published rarely, and stale material teaches badly.
