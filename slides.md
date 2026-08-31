---
layout: default
title: Slides — teaching decks for Transformer + FHE
description: One slide deck per paper on running transformers under fully homomorphic encryption, written for students with no cryptography background.
---

<style>
  .deck-intro { max-width: 62ch; }
  .startrow {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.9rem;
    margin: 1.2rem 0 2rem;
  }
  .startrow .card { border-left: 4px solid var(--link); }
  .deck-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin: 1.5rem 0 0.5rem;
    padding: 0.8rem;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 6px;
  }
  .deck-controls input[type="search"] {
    flex: 1 1 15rem;
    min-width: 12rem;
    padding: 0.4rem 0.6rem;
    font: inherit;
    font-size: 0.9rem;
    border: 1px solid var(--border);
    border-radius: 6px;
  }
  .chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .chip {
    font: inherit;
    font-size: 0.8rem;
    padding: 0.2rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: #fff;
    color: var(--fg);
    cursor: pointer;
  }
  .chip:hover { border-color: var(--link); }
  .chip[aria-pressed="true"] { background: var(--badge-bg); border-color: var(--link); color: var(--badge-fg); font-weight: 600; }
  .chip-group-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
  .deck-count { font-size: 0.85rem; color: var(--muted); margin: 0.4rem 0 1rem; }

  .module-section h2 { font-size: 1.2rem; border: 0; margin: 2rem 0 0.2rem; padding: 0; }
  .module-section h2 .swatch {
    display: inline-block; width: 0.7rem; height: 0.7rem;
    border-radius: 2px; margin-right: 0.45rem;
  }
  .module-section > p.mod-count { font-size: 0.82rem; color: var(--muted); margin: 0 0 0.7rem; }

  .deck-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 0.85rem;
  }
  .deck-tile {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-left: 4px solid var(--muted);
    border-radius: 6px;
    padding: 0.7rem 0.85rem;
    background: #fff;
    text-decoration: none;
    color: inherit;
  }
  a.deck-tile:hover { border-color: var(--link); box-shadow: 0 1px 6px rgba(9,105,218,0.12); }
  a.deck-tile:focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
  .deck-tile .t-title { font-weight: 600; font-size: 0.95rem; line-height: 1.3; }
  .deck-tile .t-meta { color: var(--muted); font-size: 0.8rem; margin: 0.25rem 0 0.4rem; }
  .deck-tile .t-hook { font-size: 0.86rem; line-height: 1.4; }
  .deck-tile .t-foot { margin-top: auto; padding-top: 0.5rem; font-size: 0.75rem; color: var(--muted); }
  .deck-tile.is-todo { background: #fbfcfd; opacity: 0.72; cursor: default; }
  .deck-tile.is-todo .t-title { font-weight: 500; }
  .tag {
    display: inline-block; font-size: 0.72rem; padding: 0.05em 0.45em;
    border: 1px solid var(--border); border-radius: 3px; margin-right: 0.3rem;
    background: var(--bg-soft);
  }
  .no-results { display: none; color: var(--muted); font-style: italic; margin: 1.5rem 0; }
  @media (max-width: 560px) { .deck-grid { grid-template-columns: 1fr; } }
</style>

# Slide decks

One deck per paper in the Transformer + FHE collection, written for a student who knows a
little machine learning and **no cryptography**. Every deck follows the same fifteen-slide
shape — the problem in plain words, the one big idea, a worked example with real numbers,
the threat model, the results, and what the paper does *not* solve.

{% assign done = site.data.decks.decks | where: "status", "done" %}

<div class="startrow">
  <div class="card">
    <h4><a href="{{ '/decks/primer-fhe-transformers/' | relative_url }}">Start here — Why transformers are hard to encrypt</a></h4>
    <div class="meta">Primer · 16 slides</div>
    <div class="hook">CKKS, slots, noise, depth, bootstrapping, and the four hard operators. Every other deck assumes this one.</div>
  </div>
  <div class="card">
    <h4>Then: the map</h4>
    <div class="meta">Survey (2024) · SoK (2026)</div>
    <div class="hook">The survey gives you the taxonomy; the SoK gives you the honest scorecard of what works today.</div>
  </div>
  <div class="card">
    <h4>Reading the colours</h4>
    <div class="meta">the same in every deck</div>
    <div class="hook">
      <span style="color:#0969da;font-weight:600">blue</span> = encrypted ·
      <span style="color:#656d76;font-weight:600">grey</span> = plaintext ·
      <span style="color:#bc4c00;font-weight:600">orange</span> = the expensive step ·
      <span style="color:#1a7f37;font-weight:600">green</span> = this paper's contribution ·
      <span style="color:#cf222e;font-weight:600">red</span> = what leaks
    </div>
  </div>
</div>

<div class="deck-controls">
  <input type="search" id="deck-search" placeholder="Search title, authors, or idea…" aria-label="Search decks">
  <div class="chips" role="group" aria-label="Filter by approach">
    <span class="chip-group-label">Approach</span>
    <button class="chip" data-filter="strategy" data-value="a" aria-pressed="false">FHE-only</button>
    <button class="chip" data-filter="strategy" data-value="b" aria-pressed="false">Hybrid HE+MPC</button>
    <button class="chip" data-filter="strategy" data-value="c" aria-pressed="false">Redesigned model</button>
    <button class="chip" data-filter="strategy" data-value="m" aria-pressed="false">MPC only</button>
  </div>
  <div class="chips" role="group" aria-label="Filter by availability">
    <span class="chip-group-label">Status</span>
    <button class="chip" data-filter="status" data-value="done" aria-pressed="false">Written</button>
  </div>
</div>

<p class="deck-count" id="deck-count">{{ done | size }} of {{ site.data.decks.decks | size }} decks written so far. The rest are listed below and are being added module by module.</p>

{% for module in site.data.decks.modules %}
  {% assign mdecks = site.data.decks.decks | where: "module", module.key %}
  {% if mdecks.size > 0 %}
<section class="module-section" data-module="{{ module.key }}">

<h2 id="mod-{{ module.key }}"><span class="swatch" style="background:{{ module.colour }}"></span>{{ module.name }}</h2>

<p class="mod-count">{{ mdecks | size }} deck{% if mdecks.size != 1 %}s{% endif %}</p>

<div class="deck-grid">
{% for deck in mdecks %}
  {% capture inner %}
    <span class="t-title">{{ deck.title }}</span>
    <span class="t-meta">{{ deck.authors }} · {{ deck.year }}</span>
    <span class="t-hook">{{ deck.hook }}</span>
    <span class="t-foot">
      {% case deck.strategy %}
        {% when 'a' %}<span class="tag">FHE-only</span>
        {% when 'b' %}<span class="tag">HE + MPC</span>
        {% when 'c' %}<span class="tag">model redesign</span>
        {% when 'm' %}<span class="tag">MPC</span>
      {% endcase %}
      {% if deck.status == 'done' %}{{ deck.slides }} slides →{% else %}deck not written yet{% endif %}
    </span>
  {% endcapture %}
  {% if deck.status == 'done' %}
  <a class="deck-tile" style="border-left-color:{{ module.colour }}" href="{{ '/decks/' | append: deck.slug | append: '/' | relative_url }}"
     data-search="{{ deck.title | append: ' ' | append: deck.authors | append: ' ' | append: deck.year | append: ' ' | append: deck.hook | downcase | strip_newlines | escape }}"
     data-strategy="{{ deck.strategy }}" data-status="done">{{ inner }}</a>
  {% else %}
  <div class="deck-tile is-todo" style="border-left-color:{{ module.colour }}"
     data-search="{{ deck.title | append: ' ' | append: deck.authors | append: ' ' | append: deck.year | append: ' ' | append: deck.hook | downcase | strip_newlines | escape }}"
     data-strategy="{{ deck.strategy }}" data-status="todo">{{ inner }}</div>
  {% endif %}
{% endfor %}
</div>
</section>
  {% endif %}
{% endfor %}

<p class="no-results" id="no-results">No deck matches that filter.</p>

<script>
  // Vanilla filtering — no build step, no dependencies. Chips are additive
  // within a group (OR) and intersecting across groups (AND).
  (function () {
    const search = document.getElementById('deck-search');
    const chips = [...document.querySelectorAll('.chip')];
    const tiles = [...document.querySelectorAll('.deck-tile')];
    const sections = [...document.querySelectorAll('.module-section')];
    const count = document.getElementById('deck-count');
    const empty = document.getElementById('no-results');

    function active(filter) {
      return chips
        .filter((c) => c.dataset.filter === filter && c.getAttribute('aria-pressed') === 'true')
        .map((c) => c.dataset.value);
    }

    function apply() {
      const q = search.value.trim().toLowerCase();
      const strategies = active('strategy');
      const statuses = active('status');
      let shown = 0;

      for (const tile of tiles) {
        const ok =
          (!q || tile.dataset.search.includes(q)) &&
          (strategies.length === 0 || strategies.includes(tile.dataset.strategy)) &&
          (statuses.length === 0 || statuses.includes(tile.dataset.status));
        tile.hidden = !ok;
        if (ok) shown++;
      }

      // Hide a module heading when nothing under it survived the filter.
      for (const section of sections) {
        const any = [...section.querySelectorAll('.deck-tile')].some((t) => !t.hidden);
        section.hidden = !any;
      }

      const filtering = q || strategies.length || statuses.length;
      count.textContent = filtering
        ? `${shown} deck${shown === 1 ? '' : 's'} match.`
        : count.dataset.original;
      empty.style.display = shown === 0 ? 'block' : 'none';
    }

    count.dataset.original = count.textContent;
    search.addEventListener('input', apply);
    for (const chip of chips) {
      chip.addEventListener('click', () => {
        chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        apply();
      });
    }
  })();
</script>
