#!/usr/bin/env python3
"""Regenerate slidev/PROGRESS.md from _data/decks.yml.

    python3 slidev/progress.py

decks.yml is the source of truth; this file is the readable view of it. Run
after every mark-done.py so the two never drift.
"""
import io
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
# Authoring order: surveys early so the lineage slide in later decks has a map.
ORDER = ['primer', 'surveys', 'fhe-native', 'hybrid', 'training', 'medical', 'systems', 'mpc']

data = yaml.safe_load((ROOT / '_data' / 'decks.yml').read_text())
mods = {m['key']: m['name'] for m in data['modules']}
decks = data['decks']
done_total = sum(1 for d in decks if d['status'] == 'done')

out = io.StringIO()
w = out.write
w(f"""# Deck progress

**{done_total} of {len(decks)} decks written.**

`_data/decks.yml` is the source of truth for what the `/slides/` page shows. When a deck is
finished: `python3 slidev/mark-done.py <slug> <slides>` then `python3 slidev/progress.py`.

## Infrastructure

- [x] Node installed; Slidev project in `slidev/` with `package-lock.json` committed
- [x] Shared styles (`src/styles/index.css`) — fixed colour semantics across all decks
- [x] Shared components: `SlotGrid`, `DepthBar`, `RoundTrip`, `CostBars`
- [x] `DECK_TEMPLATE.md` — the 15-slide skeleton and style guide
- [x] `build.sh` — per-deck `--base` so decks work under `/PREMAL/`
- [x] `check.mjs` — headless overflow check of every slide of every deck
- [x] `.github/workflows/pages.yml` — builds decks + Jekyll, deploys to Pages
- [x] `_data/decks.yml` — {len(decks)} records, drives the tile page
- [x] `slides.md` — `/slides/` tile page with search and filter chips
- [x] "Slides" link in the site nav

**One manual step remains:** repo → Settings → Pages → Source → **GitHub Actions**. Until that is
flipped, Pages serves `main` at root and the built decks will not appear.

## Order of work

Primer → surveys → FHE-native → hybrid → training → medical → systems → MPC baselines.

## Decks

""")
for key in ORDER:
    group = [d for d in decks if d['module'] == key]
    if not group:
        continue
    done = sum(1 for d in group if d['status'] == 'done')
    w(f"### {mods[key]} — {done}/{len(group)}\n\n")
    for d in group:
        box = 'x' if d['status'] == 'done' else ' '
        slides = f" · {d['slides']} slides" if d.get('slides') else ''
        w(f"- [{box}] `{d['slug']}` — {d['title']} ({d['authors']}, {d['year']}){slides}\n")
    w("\n")

w("""## Local commands

```sh
cd slidev
npm install                       # once
npx slidev src/nexus-2024.md      # live preview while authoring
./build.sh                        # build every deck into ../decks/
./build.sh nexus-2024             # build one
node check.mjs                    # overflow-check every built deck
BASE_PREFIX=/ ./build.sh          # root-served preview instead of /PREMAL/
```

Full site, the way CI builds it — Jekyll first, then the decks written straight into `_site/`:

```sh
JEKYLL_ENV=production JEKYLL_NO_BUNDLER_REQUIRE=true BUNDLE_GEMFILE=/dev/null jekyll build
OUT_ROOT="$PWD/_site/decks" ./slidev/build.sh
```

**Never let Jekyll copy the decks.** It silently drops files whose names begin with an underscore,
and every Slidev deck imports a chunk Vite names `_plugin-vue_export-helper-<hash>.js`. The result
is a blank page with a single 404 in the console. `decks/` is therefore in Jekyll's `exclude:`
list, the decks are written into `_site/` after Jekyll runs, and the workflow asserts afterwards
that every asset each deck's `index.html` references is actually present.
""")
(ROOT / 'slidev' / 'PROGRESS.md').write_text(out.getvalue())
print(f'PROGRESS.md: {done_total}/{len(decks)} decks')
