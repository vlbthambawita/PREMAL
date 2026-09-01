<!--
  RotateSum — the rotate-and-add trick, one step at a time.

  A dot product needs the sum of every slot, but a ciphertext has no indexing.
  The answer is to fold the vector onto itself: rotate by n/2 and add, then n/4,
  then n/8. After log2(n) steps every slot holds the total. Students who have
  only seen "sum the array" need to watch this happen once.

    <RotateSum :values="[3,1,4,1,5,9,2,6]" />
-->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  values: { type: Array, default: () => [3, 1, 4, 1, 5, 9, 2, 6] },
  autoLabel: { type: String, default: 'ct' },
})

const step = ref(0)
const n = computed(() => props.values.length)
const totalSteps = computed(() => Math.log2(n.value))

// State after `step` folds.
function stateAfter(k) {
  let cur = [...props.values]
  let shift = n.value / 2
  for (let i = 0; i < k; i++) {
    const rot = cur.map((_, j) => cur[(j + shift) % n.value])
    cur = cur.map((v, j) => v + rot[j])
    shift /= 2
  }
  return cur
}

const current = computed(() => stateAfter(step.value))
const shift = computed(() => n.value / 2 ** (step.value + 1))
const rotated = computed(() => current.value.map((_, j) => current.value[(j + shift.value) % n.value]))
const next = computed(() => current.value.map((v, j) => v + rotated.value[j]))
const done = computed(() => step.value >= totalSteps.value)
const total = computed(() => props.values.reduce((a, b) => a + b, 0))
</script>

<template>
  <div class="rs">
    <div class="rows">
      <div class="rowline">
        <span class="rl">{{ autoLabel }}</span>
        <div class="row">
          <div v-for="(v, i) in current" :key="i" class="cell" :class="{ hot: done && i === 0 }">{{ v }}</div>
        </div>
      </div>

      <template v-if="!done">
        <div class="rowline sub">
          <span class="rl">rot(·, {{ shift }})</span>
          <div class="row">
            <div v-for="(v, i) in rotated" :key="i" class="cell ghost">{{ v }}</div>
          </div>
        </div>
        <div class="rowline">
          <span class="rl">sum →</span>
          <div class="row">
            <div v-for="(v, i) in next" :key="i" class="cell pending">{{ v }}</div>
          </div>
        </div>
      </template>
    </div>

    <div class="bar">
      <button @click="step = Math.min(totalSteps, step + 1)" :disabled="done">
        rotate by {{ done ? '—' : shift }} and add
      </button>
      <button class="ghostbtn" @click="step = 0">reset</button>
      <span class="count">
        rotations used: <b>{{ step }}</b> of log₂({{ n }}) = {{ totalSteps }}
      </span>
      <span v-if="done" class="finish">every slot holds {{ total }}</span>
    </div>
  </div>
</template>

<style scoped>
.rs { margin: 0.5rem 0; font-size: 0.78rem; }

.rows { display: flex; flex-direction: column; gap: 0.25rem; }

.rowline { display: flex; align-items: center; gap: 0.5rem; }
.rowline.sub { opacity: 0.85; }

.rl {
  width: 6.2rem;
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  color: var(--premal-pt);
}

.row { display: flex; gap: 2px; }

.cell {
  min-width: 2.2rem;
  height: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  border: 1px solid var(--premal-ct);
  background: var(--premal-ct-bg);
  color: var(--premal-ct);
  border-radius: 3px;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.cell.ghost {
  border-style: dashed;
  border-color: var(--premal-cost);
  background: var(--premal-cost-bg);
  color: var(--premal-cost);
}

.cell.pending {
  border-color: var(--premal-border);
  background: #fff;
  color: var(--premal-pt);
}

.cell.hot {
  border-color: var(--premal-contrib);
  background: var(--premal-contrib-bg);
  color: var(--premal-contrib);
  font-weight: 700;
  transform: scale(1.06);
}

.bar {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

button {
  font: inherit;
  font-size: 0.74rem;
  padding: 0.22rem 0.55rem;
  border: 1px solid var(--premal-ct);
  color: var(--premal-ct);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) { background: var(--premal-ct-bg); }
button:disabled { opacity: 0.45; cursor: default; }
button.ghostbtn { border-color: var(--premal-border); color: var(--premal-pt); }

.count { font-size: 0.72rem; color: var(--premal-pt); }
.finish { font-size: 0.72rem; color: var(--premal-contrib); font-weight: 700; }
</style>
