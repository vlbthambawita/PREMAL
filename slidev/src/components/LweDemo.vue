<!--
  LweDemo — a working (toy-sized) lattice ciphertext the student can poke.

  Everything on screen is computed, not narrated: the ciphertext really is
  b = <a,s> + Δ·m + e mod q, decryption really is round((b − <a,s>)/Δ), and the
  "wrong answer" state appears exactly when |e| ≥ Δ/2. The numbers are tiny so
  the arithmetic can be checked by hand; the behaviour is the real behaviour.

    <LweDemo />                       full lab with operation buttons
    <LweDemo :show-ops="false" />     just encrypt/decrypt
-->
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // Ciphertext modulus. Small enough to do in your head.
  q: { type: Number, default: 64 },
  // Plaintext space: messages are 0 … p-1.
  p: { type: Number, default: 4 },
  // Secret key and the ciphertext's random part.
  s: { type: Array, default: () => [3, 1] },
  a: { type: Array, default: () => [5, 9] },
  initialM: { type: Number, default: 1 },
  initialE: { type: Number, default: 2 },
  showOps: { type: Boolean, default: true },
})

const m = ref(props.initialM)
const e = ref(props.initialE)
const log = ref([])

const delta = computed(() => props.q / props.p)
const budget = computed(() => delta.value / 2)
const dot = computed(() => props.a.reduce((acc, ai, i) => acc + ai * props.s[i], 0))
const mod = (x) => ((x % props.q) + props.q) % props.q

// b = <a,s> + Δ·m + e  (mod q)
const b = computed(() => mod(dot.value + delta.value * m.value + e.value))
// Decryption strips the mask, then rounds away the noise.
const stripped = computed(() => mod(b.value - dot.value))
const recovered = computed(() => Math.round(stripped.value / delta.value) % props.p)

const ok = computed(() => recovered.value === mod(m.value) % props.p && Math.abs(e.value) < budget.value)
const overflowed = computed(() => m.value >= props.p)
const noisePct = computed(() => Math.min(100, (Math.abs(e.value) / budget.value) * 100))

function apply(kind) {
  if (kind === 'add') {
    m.value += 1
    e.value += 3
    log.value.push('+ ct(1), noise 3')
  } else if (kind === 'scale') {
    m.value *= 2
    e.value *= 2
    log.value.push('× plaintext 2')
  } else if (kind === 'ctmul') {
    m.value = m.value * m.value
    e.value = e.value * e.value
    log.value.push('× another ciphertext')
  } else if (kind === 'boot') {
    e.value = 1
    log.value.push('bootstrap')
  }
}

function reset() {
  m.value = props.initialM
  e.value = props.initialE
  log.value = []
}
</script>

<template>
  <div class="lwe">
    <div class="panel">
      <div class="ptitle">1 · Encrypt</div>
      <label class="ctl">
        <span>message <code>m</code></span>
        <input type="range" min="0" max="3" step="1" v-model.number="m">
        <b class="val">{{ m }}</b>
      </label>
      <label class="ctl">
        <span>noise <code>e</code></span>
        <input type="range" :min="-12" :max="12" step="1" v-model.number="e">
        <b class="val" :class="{ bad: Math.abs(e) >= budget }">{{ e > 0 ? '+' : '' }}{{ e }}</b>
      </label>
      <div class="eq">
        <div><code>b = ⟨a,s⟩ + Δ·m + e mod q</code></div>
        <div class="work">
          <code>= {{ dot }} + {{ delta }}·{{ m }} + {{ e }} mod {{ q }}</code>
        </div>
        <div class="out">ct = ( a = [{{ a.join(', ') }}], b = <b>{{ b }}</b> )</div>
      </div>
    </div>

    <div class="panel">
      <div class="ptitle">2 · Decrypt</div>
      <div class="eq">
        <div><code>b − ⟨a,s⟩ = {{ b }} − {{ dot }} = {{ stripped }}</code></div>
        <div class="work"><code>{{ stripped }} / Δ = {{ (stripped / delta).toFixed(3) }} → round</code></div>
      </div>
      <div class="verdict" :class="ok ? 'good' : 'bad'">
        recovered m = <b>{{ recovered }}</b>
        <span v-if="ok"> ✓ correct</span>
        <span v-else-if="overflowed"> ✗ message overflowed p = {{ p }}</span>
        <span v-else> ✗ wrong — noise passed Δ/2 = {{ budget }}</span>
      </div>
      <div class="gauge">
        <div class="gtrack">
          <div class="gfill" :class="{ over: Math.abs(e) >= budget }" :style="{ width: noisePct + '%' }" />
        </div>
        <div class="glabel">|e| = {{ Math.abs(e) }} of {{ budget }}</div>
      </div>
    </div>

    <div class="panel ops" v-if="showOps">
      <div class="ptitle">3 · Do homomorphic work</div>
      <button @click="apply('add')">add a ciphertext</button>
      <button @click="apply('scale')">× plaintext 2</button>
      <button @click="apply('ctmul')" class="danger">× ciphertext</button>
      <button @click="apply('boot')" class="good">bootstrap</button>
      <button @click="reset" class="ghost">reset</button>
      <div class="log">
        <span v-for="(l, i) in log.slice(-4)" :key="i">{{ l }}</span>
        <span v-if="!log.length" class="dim">no operations yet</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lwe {
  display: grid;
  grid-template-columns: 1.15fr 1.15fr 0.85fr;
  gap: 0.6rem;
  margin: 0.5rem 0;
  font-size: 0.78rem;
}

.panel {
  border: 1px solid var(--premal-border);
  border-radius: 6px;
  padding: 0.5rem 0.6rem;
  background: var(--premal-pt-bg);
}

.ptitle {
  font-weight: 700;
  color: var(--premal-ct);
  font-size: 0.75rem;
  margin-bottom: 0.35rem;
}

.ctl {
  display: grid;
  grid-template-columns: 5.4rem 1fr 2rem;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.25rem;
}

.ctl span { color: var(--premal-pt); }
.ctl input { width: 100%; accent-color: var(--premal-ct); }

.val {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--premal-ct);
  text-align: right;
}

.val.bad { color: var(--premal-leak); }

.eq {
  margin-top: 0.35rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--premal-pt);
}

.eq .work { color: var(--premal-ct); }

.out {
  margin-top: 0.2rem;
  color: var(--premal-ct);
  font-weight: 600;
}

.verdict {
  margin-top: 0.4rem;
  padding: 0.3rem 0.45rem;
  border-radius: 4px;
  font-size: 0.76rem;
  transition: background 0.25s ease, color 0.25s ease;
}

.verdict.good { background: var(--premal-contrib-bg); color: var(--premal-contrib); }
.verdict.bad { background: var(--premal-leak-bg); color: var(--premal-leak); }

.gauge { margin-top: 0.4rem; }

.gtrack {
  height: 0.6rem;
  border: 1px solid var(--premal-border);
  border-radius: 3px;
  background: #fff;
  overflow: hidden;
}

.gfill {
  height: 100%;
  background: var(--premal-ct);
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease;
}

.gfill.over { background: var(--premal-leak); }

.glabel {
  font-size: 0.68rem;
  color: var(--premal-pt);
  margin-top: 0.15rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.ops button {
  display: block;
  width: 100%;
  margin-bottom: 0.25rem;
  padding: 0.25rem 0.4rem;
  font: inherit;
  font-size: 0.73rem;
  border: 1px solid var(--premal-ct);
  color: var(--premal-ct);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease;
}

.ops button:hover { background: var(--premal-ct-bg); }
.ops button:active { transform: translateY(1px); }
.ops button.danger { border-color: var(--premal-cost); color: var(--premal-cost); }
.ops button.good { border-color: var(--premal-contrib); color: var(--premal-contrib); }
.ops button.ghost { border-color: var(--premal-border); color: var(--premal-pt); }

.log {
  margin-top: 0.3rem;
  display: flex;
  flex-direction: column;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.66rem;
  color: var(--premal-pt);
}

.log .dim { opacity: 0.6; }
</style>
