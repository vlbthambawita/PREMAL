<!--
  TinyNet — one encrypted forward pass, stage by stage.

  A two-input network small enough to check on paper, run the way a server
  actually runs it: the inputs are ciphertexts, the weights are plaintext, and
  every stage reports what it did to the two budgets that decide whether the
  answer survives — noise and level.

  The value arithmetic is exact. The noise arithmetic follows the real rules
  (add → add, plaintext multiply → scale by the weight, ct×ct → multiply) at
  toy magnitudes, so the shape is honest even though the numbers are not from
  any particular parameter set.
-->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // Noise a fresh ciphertext arrives with, and the level budget.
  startNoise: { type: Number, default: 1 },
  levels: { type: Number, default: 4 },
  // |e| must stay under this or decryption returns the wrong number.
  threshold: { type: Number, default: 60 },
})

const x1 = ref(3)
const x2 = ref(1)
// Fresh-ciphertext noise is a parameter choice, so it is the student's to move:
// it is the only dial here that can push the forward pass past its budget.
const e0 = ref(props.startNoise)
const revealed = ref(false)

// Layer 1: two neurons, plaintext weights. Layer 2: one output neuron.
const W1 = [[2, -1], [1, 1]]
const B1 = [1, 0]
const W2 = [1, -1]
const B2 = 2

const stages = computed(() => {
  const out = []
  let noise = e0.value
  let level = props.levels

  // Stage 1 — plaintext-weight multiply. Noise scales by the largest |w|.
  const h1 = [
    W1[0][0] * x1.value + W1[0][1] * x2.value + B1[0],
    W1[1][0] * x1.value + W1[1][1] * x2.value + B1[1],
  ]
  const w1max = Math.max(...W1.flat().map(Math.abs))
  noise = noise * w1max * 2 // two scaled ciphertexts added together
  level -= 1
  out.push({
    name: 'linear layer 1',
    detail: 'ct × plaintext weights, then add',
    values: h1,
    noise,
    level,
    kind: 'cheap',
  })

  // Stage 2 — the activation. Squaring is ct × ct: noise multiplies.
  const a1 = h1.map((v) => v * v)
  noise = noise * noise
  level -= 1
  out.push({
    name: 'activation: square',
    detail: 'ct × ct — the expensive one',
    values: a1,
    noise,
    level,
    kind: 'costly',
  })

  // Stage 3 — output neuron.
  const y = W2[0] * a1[0] + W2[1] * a1[1] + B2
  const w2max = Math.max(...W2.map(Math.abs))
  noise = noise * w2max * 2
  level -= 1
  out.push({
    name: 'linear layer 2',
    detail: 'ct × plaintext weights, then add',
    values: [y],
    noise,
    level,
    kind: 'cheap',
  })
  return out
})

const final = computed(() => stages.value[stages.value.length - 1])
const plain = computed(() => final.value.values[0])
const survived = computed(() => final.value.noise < props.threshold && final.value.level >= 0)
// What decryption actually hands back once the noise has swamped the value.
const garbled = computed(() => plain.value + Math.round(final.value.noise / 7) + 3)
const pct = (n) => Math.min(100, (n / props.threshold) * 100)
</script>

<template>
  <div class="tn">
    <div class="inputs">
      <label class="ctl"><span>x₁</span><input type="range" min="0" max="5" step="1" v-model.number="x1"><b>{{ x1 }}</b></label>
      <label class="ctl"><span>x₂</span><input type="range" min="0" max="5" step="1" v-model.number="x2"><b>{{ x2 }}</b></label>
      <label class="ctl"><span>e₀</span><input type="range" min="1" max="3" step="1" v-model.number="e0"><b>{{ e0 }}</b></label>
      <div class="enc">ct(x₁), ct(x₂) · fresh noise {{ e0 }} each · {{ levels }} levels</div>
      <button @click="revealed = !revealed">{{ revealed ? 'hide' : 'decrypt the result' }}</button>
    </div>

    <div class="pipe">
      <div v-for="(s, i) in stages" :key="i" class="stage" :class="s.kind">
        <div class="shead">
          <b>{{ s.name }}</b>
          <span class="sdetail">{{ s.detail }}</span>
        </div>
        <div class="svals">
          <span v-for="(v, j) in s.values" :key="j" class="chip">{{ v }}</span>
          <span class="lock">🔒 still encrypted</span>
        </div>
        <div class="meters">
          <div class="meter">
            <div class="mtrack"><div class="mfill" :class="{ over: s.noise >= threshold }" :style="{ width: pct(s.noise) + '%' }" /></div>
            <span class="mlabel">noise {{ s.noise }} / {{ threshold }}</span>
          </div>
          <span class="lvl" :class="{ out: s.level < 0 }">levels left {{ s.level }}</span>
        </div>
      </div>
    </div>

    <div class="result" :class="revealed ? (survived ? 'good' : 'bad') : 'idle'">
      <template v-if="!revealed">
        <b>?</b>
        <span>the server never learns this number</span>
      </template>
      <template v-else-if="survived">
        <b>{{ plain }}</b>
        <span>plaintext answer {{ plain }} ✓ noise stayed under budget</span>
      </template>
      <template v-else>
        <b>{{ garbled }}</b>
        <span>plaintext answer was {{ plain }} ✗ noise swamped the value</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tn {
  display: grid;
  grid-template-columns: 8.5rem 1fr 8.5rem;
  gap: 0.6rem;
  align-items: start;
  margin: 0.4rem 0;
  font-size: 0.76rem;
}

.inputs {
  border: 1px solid var(--premal-border);
  border-radius: 6px;
  padding: 0.5rem;
  background: var(--premal-pt-bg);
}

.ctl {
  display: grid;
  grid-template-columns: 1.2rem 1fr 1.1rem;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.2rem;
}

.ctl input { width: 100%; accent-color: var(--premal-ct); }
.ctl b { font-family: ui-monospace, monospace; color: var(--premal-ct); }

.enc {
  font-size: 0.67rem;
  color: var(--premal-ct);
  margin: 0.3rem 0;
  line-height: 1.35;
}

.inputs button {
  width: 100%;
  font: inherit;
  font-size: 0.72rem;
  padding: 0.25rem;
  border: 1px solid var(--premal-contrib);
  color: var(--premal-contrib);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.inputs button:hover { background: var(--premal-contrib-bg); }

.pipe { display: flex; flex-direction: column; gap: 0.3rem; }

.stage {
  border: 1px solid var(--premal-border);
  border-left: 3px solid var(--premal-ct);
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
  background: #fff;
}

.stage.costly { border-left-color: var(--premal-cost); }

.shead { display: flex; align-items: baseline; gap: 0.4rem; }
.shead b { color: var(--premal-ct); font-size: 0.75rem; }
.stage.costly .shead b { color: var(--premal-cost); }
.sdetail { font-size: 0.68rem; color: var(--premal-pt); }

.svals { display: flex; align-items: center; gap: 0.3rem; margin: 0.15rem 0; }

.chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.74rem;
  padding: 0.05rem 0.4rem;
  border: 1px solid var(--premal-ct);
  background: var(--premal-ct-bg);
  color: var(--premal-ct);
  border-radius: 3px;
  transition: transform 0.2s ease;
}

.lock { font-size: 0.65rem; color: var(--premal-pt); }

.meters { display: flex; align-items: center; gap: 0.5rem; }
.meter { flex: 1; display: flex; align-items: center; gap: 0.35rem; }

.mtrack {
  flex: 1;
  height: 0.42rem;
  border: 1px solid var(--premal-border);
  border-radius: 2px;
  overflow: hidden;
  background: var(--premal-pt-bg);
}

.mfill {
  height: 100%;
  background: var(--premal-ct);
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease;
}

.mfill.over { background: var(--premal-leak); }

.mlabel, .lvl {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.66rem;
  color: var(--premal-pt);
  white-space: nowrap;
}

.lvl.out { color: var(--premal-leak); font-weight: 700; }

.result {
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid var(--premal-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.result b {
  display: block;
  font-size: 1.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.result span { font-size: 0.68rem; line-height: 1.3; display: block; margin-top: 0.2rem; }
.result.idle { background: var(--premal-pt-bg); color: var(--premal-pt); }
.result.good { background: var(--premal-contrib-bg); border-color: var(--premal-contrib); color: var(--premal-contrib); }
.result.bad { background: var(--premal-leak-bg); border-color: var(--premal-leak); color: var(--premal-leak); }
</style>
