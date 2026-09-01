<!--
  PolyPlot — why "just approximate it with a polynomial" is harder than it sounds.

  Draws the real activation against its polynomial stand-ins and reports the
  worst error over whatever range the student drags to. The point lands by
  itself: the fit is fine where it was fitted and diverges immediately outside,
  which is exactly the failure mode encrypted networks hit when an activation
  sees a larger value than the designer expected.
-->
<script setup>
import { computed, ref } from 'vue'

const range = ref(4)
const showSquare = ref(true)
const showQuad = ref(true)

const W = 420
const H = 190
const PAD = 22

// The two stand-ins students meet first in this literature.
const square = (x) => x * x
// The quadratic MPCFormer uses in place of ReLU (from Chou et al.).
const quad = (x) => 0.125 * x * x + 0.25 * x + 0.5
const relu = (x) => Math.max(0, x)

const xs = computed(() => {
  const r = range.value
  return Array.from({ length: 161 }, (_, i) => -r + (2 * r * i) / 160)
})

const yBound = computed(() => {
  let hi = 1
  for (const x of xs.value) {
    hi = Math.max(hi, relu(x))
    if (showQuad.value) hi = Math.max(hi, Math.abs(quad(x)))
    if (showSquare.value) hi = Math.max(hi, square(x))
  }
  return hi
})

const sx = (x) => PAD + ((x + range.value) / (2 * range.value)) * (W - 2 * PAD)
const sy = (y) => H - PAD - (y / yBound.value) * (H - 2 * PAD)

const path = (f) =>
  xs.value.map((x, i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`).join(' ')

function maxErr(f) {
  return Math.max(...xs.value.map((x) => Math.abs(f(x) - relu(x))))
}

const errSquare = computed(() => maxErr(square))
const errQuad = computed(() => maxErr(quad))
</script>

<template>
  <div class="pp">
    <svg :viewBox="`0 0 ${W} ${H}`" class="plot">
      <line :x1="PAD" :y1="sy(0)" :x2="W - PAD" :y2="sy(0)" class="axis" />
      <line :x1="sx(0)" :y1="PAD - 10" :x2="sx(0)" :y2="H - PAD" class="axis" />
      <path :d="path(relu)" class="relu" />
      <path v-if="showSquare" :d="path(square)" class="sq" />
      <path v-if="showQuad" :d="path(quad)" class="qd" />
      <text :x="W - PAD" :y="sy(0) + 12" class="tick" text-anchor="end">x = {{ range }}</text>
      <text :x="PAD" :y="sy(0) + 12" class="tick">x = −{{ range }}</text>
    </svg>

    <div class="side">
      <label class="ctl">
        <span>input range ±</span>
        <input type="range" min="1" max="10" step="1" v-model.number="range">
        <b>{{ range }}</b>
      </label>
      <label class="chk"><input type="checkbox" v-model="showSquare"> <span class="k sq">x²</span> worst error <b :class="{ bad: errSquare > 2 }">{{ errSquare.toFixed(2) }}</b></label>
      <label class="chk"><input type="checkbox" v-model="showQuad"> <span class="k qd">0.125x² + 0.25x + 0.5</span> worst error <b :class="{ bad: errQuad > 2 }">{{ errQuad.toFixed(2) }}</b></label>
      <div class="legend"><span class="k relu">ReLU</span> the function we actually want</div>
      <div class="hint">Drag the range out and watch both errors explode. Encrypted networks cannot clamp what they cannot compare.</div>
    </div>
  </div>
</template>

<style scoped>
.pp {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 0.7rem;
  align-items: center;
  margin: 0.4rem 0;
  font-size: 0.76rem;
}

.plot {
  width: 100%;
  border: 1px solid var(--premal-border);
  border-radius: 6px;
  background: #fff;
}

.axis { stroke: var(--premal-border); stroke-width: 1; }
.relu { fill: none; stroke: var(--premal-pt); stroke-width: 2.5; }
.sq { fill: none; stroke: var(--premal-cost); stroke-width: 2; stroke-dasharray: 5 3; }
.qd { fill: none; stroke: var(--premal-ct); stroke-width: 2; }
.tick { font-size: 9px; fill: var(--premal-pt); font-family: ui-monospace, monospace; }

.ctl {
  display: grid;
  grid-template-columns: 5.6rem 1fr 1.4rem;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.35rem;
}

.ctl input { accent-color: var(--premal-ct); }
.ctl b { font-family: ui-monospace, monospace; color: var(--premal-ct); }

.chk { display: block; margin-bottom: 0.3rem; line-height: 1.5; }
.chk b { font-family: ui-monospace, monospace; }
.chk b.bad { color: var(--premal-leak); }

.k {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  padding: 0.05em 0.3em;
  border-radius: 3px;
}

.k.relu { background: var(--premal-pt-bg); color: var(--premal-pt); }
.k.sq { background: var(--premal-cost-bg); color: var(--premal-cost); }
.k.qd { background: var(--premal-ct-bg); color: var(--premal-ct); }

.legend { margin: 0.3rem 0; color: var(--premal-pt); }

.hint {
  margin-top: 0.3rem;
  font-size: 0.71rem;
  color: var(--premal-pt);
  border-left: 3px solid var(--premal-cost);
  padding-left: 0.45rem;
}
</style>
