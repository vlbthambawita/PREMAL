<!--
  SlotGrid — draws one ciphertext as a row of SIMD slots.

  Used everywhere the deck needs to explain packing: why a single CKKS
  ciphertext holds thousands of numbers at once, and why adding a number to
  its neighbour needs a rotation rather than an index lookup.

    <SlotGrid :values="[3,1,4,1,5]" label="ct_x" :highlight="[0,2]" />
    <SlotGrid :values="[3,1,4,1,5]" label="rot(ct_x, 2)" :rotate="2" />
    <SlotGrid :count="8" label="empty ciphertext" plaintext />
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Explicit slot contents. Omit to draw `count` empty slots.
  values: { type: Array, default: null },
  count: { type: Number, default: 8 },
  label: { type: String, default: '' },
  // Cyclically rotate the displayed values left by this many positions.
  rotate: { type: Number, default: 0 },
  // Indices to emphasise (after rotation).
  highlight: { type: Array, default: () => [] },
  // Draw in plaintext grey instead of ciphertext blue.
  plaintext: { type: Boolean, default: false },
  // Show "… N slots" after the row instead of pretending the row is the whole thing.
  totalSlots: { type: Number, default: 0 },
})

const cells = computed(() => {
  const base = props.values ?? Array(props.count).fill('')
  const n = base.length
  if (!props.rotate || n === 0) return base
  const r = ((props.rotate % n) + n) % n
  return base.map((_, i) => base[(i + r) % n])
})
</script>

<template>
  <div class="slotgrid" :class="{ 'is-plain': plaintext }">
    <div v-if="label" class="slotgrid-label">{{ label }}</div>
    <div class="slotgrid-row">
      <div
        v-for="(v, i) in cells"
        :key="i"
        class="slot"
        :class="{ hot: highlight.includes(i) }"
      >{{ v }}</div>
      <div v-if="totalSlots > cells.length" class="slotgrid-more">
        … {{ totalSlots.toLocaleString() }} slots
      </div>
    </div>
  </div>
</template>

<style scoped>
.slotgrid {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.4rem 0.6rem 0.4rem 0;
  vertical-align: top;
}

.slotgrid-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: var(--premal-ct);
  font-weight: 600;
}

.slotgrid.is-plain .slotgrid-label { color: var(--premal-pt); }

.slotgrid-row {
  display: flex;
  align-items: center;
  gap: 2px;
}

.slot {
  min-width: 2.1rem;
  height: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  border: 1px solid var(--premal-ct);
  background: var(--premal-ct-bg);
  color: var(--premal-ct);
  border-radius: 3px;
}

.slotgrid.is-plain .slot {
  border-color: var(--premal-border);
  background: var(--premal-pt-bg);
  color: var(--premal-pt);
}

.slot.hot {
  border-color: var(--premal-cost);
  background: var(--premal-cost-bg);
  color: var(--premal-cost);
  font-weight: 700;
}

.slotgrid-more {
  margin-left: 0.5rem;
  font-size: 0.72rem;
  color: var(--premal-pt);
  white-space: nowrap;
}
</style>
