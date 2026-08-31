<!--
  CostBars — one consistent bar chart for every "how much faster / smaller"
  slide in the collection, so students compare shapes rather than re-reading
  a new axis on every deck.

  Numbers in this field span six orders of magnitude, so `log` is usually the
  honest choice — and the component says so on the chart when you use it.

    <CostBars
      unit="s"
      log
      :items="[
        { label: 'plaintext', value: 0.02, reference: true },
        { label: 'BOLT',      value: 185 },
        { label: 'NEXUS',     value: 37.3, highlight: true },
      ]" />

  Per-item flags: `highlight` / `good` (green, this paper's result),
  `reference` (neutral grey, a baseline rather than a cost), `note` (small
  caption under the number).
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  // [{ label, value, note?, highlight?, good? }]
  items: { type: Array, required: true },
  unit: { type: String, default: '' },
  log: { type: Boolean, default: false },
  caption: { type: String, default: '' },
  // Lower is better (latency, bandwidth). Set false for accuracy-style charts.
  lowerIsBetter: { type: Boolean, default: true },
})

const positive = computed(() => props.items.map((i) => Math.max(i.value, 1e-9)))
const maxV = computed(() => Math.max(...positive.value))
const minV = computed(() => Math.min(...positive.value))

function width(v) {
  const x = Math.max(v, 1e-9)
  if (!props.log) return `${(x / maxV.value) * 100}%`
  // Map [min/10, max] onto 4%..100% so the smallest bar stays visible.
  const lo = Math.log10(minV.value / 10)
  const hi = Math.log10(maxV.value)
  const t = (Math.log10(x) - lo) / (hi - lo || 1)
  return `${4 + t * 96}%`
}

function fmt(v) {
  if (v >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (v >= 10) return v.toFixed(0)
  if (v >= 1) return v.toFixed(1)
  return v.toPrecision(2)
}
</script>

<template>
  <div class="costbars">
    <div v-for="(it, i) in items" :key="i" class="row">
      <div class="lbl">{{ it.label }}</div>
      <div class="track">
        <div
          class="bar"
          :class="{ 'is-hi': it.highlight, 'is-good': it.good, 'is-ref': it.reference }"
          :style="{ width: width(it.value) }"
        />
      </div>
      <div class="val" :class="{ 'is-hi': it.highlight }">
        <span class="num">{{ fmt(it.value) }}<span v-if="unit" class="unit">{{ unit }}</span></span>
        <span v-if="it.note" class="subnote">{{ it.note }}</span>
      </div>
    </div>
    <div class="caption">
      <span v-if="log" class="logtag">log scale</span>
      <span v-if="caption">{{ caption }}</span>
      <span v-else-if="lowerIsBetter" class="dir">lower is better</span>
      <span v-else class="dir">higher is better</span>
    </div>
  </div>
</template>

<style scoped>
.costbars {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  margin: 0.6rem 0;
}

.row {
  display: grid;
  grid-template-columns: 10rem 1fr 12rem;
  align-items: center;
  gap: 0.6rem;
  min-height: 1.5rem;
}

.lbl {
  text-align: right;
  font-size: 0.82rem;
  color: var(--premal-pt);
  line-height: 1.15;
}

.track {
  height: 1rem;
  background: var(--premal-pt-bg);
  border-radius: 3px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: var(--premal-cost);
  border-radius: 3px;
  min-width: 2px;
}

.bar.is-hi,
.bar.is-good { background: var(--premal-contrib); }

/* A reference row (plaintext baseline) is context, not a cost — keep it neutral. */
.bar.is-ref { background: var(--premal-pt); opacity: 0.55; }

.val {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--premal-pt);
  line-height: 1.15;
}

.val .num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
}

.val.is-hi .num { color: var(--premal-contrib); font-weight: 700; }

.unit { opacity: 0.7; margin-left: 0.1rem; }

/* Deliberately not called .note — the global callout class of that name would
   turn this into a padded card. */
.subnote {
  font-size: 0.66rem;
  opacity: 0.75;
  line-height: 1.1;
}

.caption {
  margin-top: 0.25rem;
  text-align: center;
  font-size: 0.72rem;
  color: var(--premal-pt);
  display: flex;
  gap: 0.6rem;
  justify-content: center;
}

.logtag {
  border: 1px solid var(--premal-border);
  border-radius: 999px;
  padding: 0 0.45rem;
}

.dir { opacity: 0.8; }
</style>
