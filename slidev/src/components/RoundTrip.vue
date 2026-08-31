<!--
  RoundTrip — client↔server interaction rounds.

  The single biggest dividing line in this literature is "how many times does
  the client have to answer the server?". A number like BOLT's 10,509 rounds
  means nothing to a student until they watch messages bounce. This draws the
  bounce, then states the number.

    <RoundTrip :rounds="3" label="hybrid HE+MPC" note="one round per non-linear op" />
    <RoundTrip :rounds="1" non-interactive label="NEXUS" note="client may go offline" />
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  // How many bounces to actually draw (keep it small — 1 to 6).
  rounds: { type: Number, default: 3 },
  // The real number, when it is too large to draw.
  realRounds: { type: [Number, String], default: null },
  label: { type: String, default: '' },
  note: { type: String, default: '' },
  nonInteractive: { type: Boolean, default: false },
  clientLabel: { type: String, default: 'Client' },
  serverLabel: { type: String, default: 'Server' },
})

const bounces = computed(() => Array.from({ length: props.rounds }, (_, i) => i))
</script>

<template>
  <div class="roundtrip" :class="{ ni: nonInteractive }">
    <div v-if="label" class="rt-title">{{ label }}</div>
    <div class="rt-body">
      <div class="party">{{ clientLabel }}</div>
      <div class="lanes">
        <div v-for="i in bounces" :key="i" class="lane">
          <div class="arrow up"><span class="head">▶</span></div>
          <div class="arrow down"><span class="head">◀</span></div>
        </div>
      </div>
      <div class="party">{{ serverLabel }}</div>
    </div>
    <div class="rt-foot">
      <strong>{{ realRounds ?? rounds }}</strong>
      round{{ (realRounds ?? rounds) === 1 ? '' : 's' }}<template v-if="note"> · {{ note }}</template>
    </div>
  </div>
</template>

<style scoped>
.roundtrip {
  display: inline-flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem 0.7rem;
  max-width: 100%;
  border: 1px solid var(--premal-border);
  border-radius: 6px;
  background: var(--premal-pt-bg);
  margin: 0.4rem 0.6rem 0.4rem 0;
}

.roundtrip.ni {
  border-color: var(--premal-contrib);
  background: var(--premal-contrib-bg);
}

.rt-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--premal-pt);
}

.roundtrip.ni .rt-title { color: var(--premal-contrib); }

.rt-body {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.party {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--premal-ct);
  white-space: nowrap;
}

.lanes {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.lane {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.arrow {
  width: 1.9rem;
  height: 0;
  border-top: 2px solid var(--premal-cost);
  position: relative;
}

.roundtrip.ni .arrow { border-top-color: var(--premal-contrib); }

.arrow .head {
  position: absolute;
  top: -0.62rem;
  font-size: 0.6rem;
  color: var(--premal-cost);
}

.roundtrip.ni .arrow .head { color: var(--premal-contrib); }

.arrow.up .head { right: -0.2rem; }
.arrow.down .head { left: -0.2rem; }

.rt-foot {
  font-size: 0.75rem;
  color: var(--premal-pt);
}

.rt-foot strong { color: var(--premal-cost); }
.roundtrip.ni .rt-foot strong { color: var(--premal-contrib); }
</style>
