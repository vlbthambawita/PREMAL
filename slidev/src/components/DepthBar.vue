<!--
  DepthBar — the multiplicative-depth budget of a levelled CKKS ciphertext,
  drawn as a draining bar.

  Every ciphertext starts with a fixed number of levels. Each multiplication
  spends one. When the bar empties you must bootstrap (expensive) or stop.
  This component makes "depth" concrete for students who have only ever
  thought about FLOPs.

    <DepthBar :total="24" :steps="[
      { label: 'QK^T',    cost: 1 },
      { label: 'softmax approx', cost: 8, expensive: true },
      { label: 'bootstrap', bootstrap: true },
      { label: 'GELU approx',   cost: 4 },
    ]" />
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, required: true },
  // [{ label, cost }] or { label, bootstrap: true } to refill.
  steps: { type: Array, default: () => [] },
  caption: { type: String, default: '' },
})

// Walk the steps, recording how full the bar is after each one.
const trace = computed(() => {
  let left = props.total
  return props.steps.map((s) => {
    if (s.bootstrap) {
      const before = left
      left = props.total
      return { ...s, before, after: left, spent: 0 }
    }
    const before = left
    left = Math.max(0, left - (s.cost ?? 0))
    return { ...s, before, after: left, spent: s.cost ?? 0 }
  })
})

const pct = (n) => `${Math.max(0, Math.min(100, (n / props.total) * 100))}%`
</script>

<template>
  <div class="depthbar">
    <div v-for="(s, i) in trace" :key="i" class="row">
      <div class="rowlabel" :class="{ boot: s.bootstrap, hot: s.expensive }">
        {{ s.label }}
      </div>
      <div class="track">
        <div
          class="fill"
          :class="{ boot: s.bootstrap, hot: s.expensive, empty: s.after === 0 }"
          :style="{ width: pct(s.after) }"
        />
      </div>
      <div class="spend">
        <span v-if="s.bootstrap" class="is-boot">refill → {{ s.after }}</span>
        <span v-else>−{{ s.spent }} → {{ s.after }}</span>
      </div>
    </div>
    <div v-if="caption" class="caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.depthbar {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0.6rem 0;
  font-size: 0.82rem;
}

.row {
  display: grid;
  grid-template-columns: 13.5rem 1fr 7rem;
  align-items: center;
  gap: 0.6rem;
}

.rowlabel {
  text-align: right;
  color: var(--premal-pt);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
}

.rowlabel.hot { color: var(--premal-cost); font-weight: 700; }
.rowlabel.boot { color: var(--premal-contrib); font-weight: 700; }

.track {
  height: 0.85rem;
  background: var(--premal-pt-bg);
  border: 1px solid var(--premal-border);
  border-radius: 3px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--premal-ct);
  transition: width 0.3s ease;
}

.fill.hot { background: var(--premal-cost); }
.fill.boot { background: var(--premal-contrib); }
.fill.empty { background: var(--premal-leak); }

.spend {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: var(--premal-pt);
}

.spend .is-boot { color: var(--premal-contrib); font-weight: 600; }

.caption {
  margin-top: 0.3rem;
  font-size: 0.75rem;
  color: var(--premal-pt);
  text-align: center;
}
</style>
