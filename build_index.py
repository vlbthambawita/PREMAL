#!/usr/bin/env python3
"""Regenerate index.md sections from summaries/*.md YAML front matter.

Replaces three marker-delimited regions in index.md:
  <!-- STATS:START -->     ... <!-- STATS:END -->
  <!-- FEATURED:START -->  ... <!-- FEATURED:END -->
  <!-- TABLE:START -->     ... <!-- TABLE:END -->

Run after adding or editing any summary file:
    python3 build_index.py
"""
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML required. Install with: pip3 install pyyaml")

REPO = Path(__file__).parent
SUMMARIES_DIR = REPO / "summaries"
INDEX = REPO / "index.md"

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_front_matter(path):
    text = path.read_text()
    m = FRONT_MATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1))
    except yaml.YAMLError as e:
        print(f"  WARN: YAML error in {path.name}: {e}", file=sys.stderr)
        return None


def collect_entries():
    entries = []
    for path in sorted(SUMMARIES_DIR.glob("*.md")):
        if path.name == "index.md":
            continue
        fm = parse_front_matter(path)
        if not fm:
            print(f"  skip {path.name}: no front matter", file=sys.stderr)
            continue
        if "comparison" not in fm or "frontpage" not in fm:
            print(f"  skip {path.name}: missing comparison: or frontpage: block", file=sys.stderr)
            continue
        entries.append({
            "path": path,
            "top": fm,
            "comparison": fm.get("comparison", {}) or {},
            "frontpage": fm.get("frontpage", {}) or {},
        })
    return entries


def latency_value(e):
    v = e["comparison"].get("single_inference_seconds")
    if isinstance(v, (int, float)):
        return v
    return float("inf")


def author_short(authors):
    if not authors:
        return ""
    first = authors[0]
    surname = first.split()[-1] if first else ""
    return f"{surname} et al." if len(authors) > 1 else surname


def scheme_bucket(s):
    """Normalize FHE scheme strings into a small set of buckets for stats."""
    if not s:
        return "?"
    low = s.lower()
    if "hybrid" in low or "+" in low:
        return "Hybrid"
    for tag in ("CKKS", "BFV", "BGV", "TFHE"):
        if tag.lower() in low:
            return tag
    return s


def render_stats(entries):
    n = len(entries)
    years = sorted({e["comparison"].get("year") for e in entries
                    if isinstance(e["comparison"].get("year"), int)})
    year_range = f"{years[0]}–{years[-1]}" if years else "?"
    schemes, domains, tasks = {}, {}, {}
    for e in entries:
        s = scheme_bucket(e["comparison"].get("fhe_scheme", ""))
        schemes[s] = schemes.get(s, 0) + 1
        d = e["frontpage"].get("domain", "?")
        domains[d] = domains.get(d, 0) + 1
        t = e["frontpage"].get("task", "?")
        tasks[t] = tasks.get(t, 0) + 1

    def fmt(counts):
        return ", ".join(f"{k} (×{v})" for k, v in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])))

    return (f'<div class="stats">\n'
            f"<strong>{n} papers</strong> · {year_range} · "
            f"schemes: {fmt(schemes)} · "
            f"domains: {fmt(domains)} · "
            f"tasks: {fmt(tasks)}\n"
            f"</div>")


def render_featured(entries):
    featured = [e for e in entries if e["frontpage"].get("featured") is True]
    featured.sort(key=lambda e: -(e["comparison"].get("year") or 0))
    if not featured:
        return '<p><em>No featured papers yet — set <code>featured: true</code> on a summary.</em></p>'
    cards = ['<div class="card-grid">']
    for e in featured:
        slug = e["frontpage"].get("slug", "")
        title = (e["top"].get("title") or "").strip()
        year = e["comparison"].get("year", "")
        hook = e["frontpage"].get("hook", "").strip()
        scheme = e["comparison"].get("fhe_scheme", "")
        authors = author_short(e["top"].get("authors") or [])
        cards.append(
            f'  <div class="card">\n'
            f'    <h4><a href="summaries/{slug}/">{title}</a> <span class="badge">{year}</span></h4>\n'
            f'    <div class="meta">{authors} · {scheme}</div>\n'
            f'    <div class="hook"><em>{hook}</em></div>\n'
            f'  </div>'
        )
    cards.append("</div>")
    return "\n".join(cards)


def render_row(e):
    c, f, top = e["comparison"], e["frontpage"], e["top"]
    slug = f.get("slug", "")
    title = (top.get("title") or "").strip()
    novelty = f.get("novelty_tag", "")
    title_cell = (f'[{title}](summaries/{slug}/)'
                  + (f'<br><span class="badge">{novelty}</span>' if novelty else ''))
    year = c.get("year", "")
    hook = (f.get("hook") or "").strip()
    scheme = c.get("fhe_scheme", "")
    model = c.get("architecture", "")
    dataset = f.get("dataset_headline", "")
    accuracy = f.get("headline_accuracy", "")
    lat = c.get("single_inference_seconds")
    hw = c.get("single_inference_hardware", "")
    if isinstance(lat, (int, float)):
        # escape double quotes for HTML attribute
        hw_safe = str(hw).replace('"', "&quot;")
        lat_cell = f'<span title="{hw_safe}">{lat}</span>'
    else:
        lat_cell = "—"
    code_avail = f.get("code_available", "no")
    code_url = f.get("code_url", "") or ""
    code_cell = f"[GitHub]({code_url})" if (code_avail == "yes" or code_avail is True) and code_url else "—"

    def esc(s):
        # Escape pipe so it doesn't break the table.
        return (str(s) or "").replace("|", "\\|")

    return (f"| {esc(title_cell)} | {year} | *{esc(hook)}* | {esc(scheme)} | "
            f"{esc(model)} | {esc(dataset)} | {esc(accuracy)} | {lat_cell} | {code_cell} |")


def render_table(entries):
    entries = sorted(entries,
                     key=lambda e: (-(e["comparison"].get("year") or 0), latency_value(e)))
    header = [
        "| Title | Year | Hook | FHE | Model | Dataset | Accuracy | Inference (s) | Code |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    return "\n".join(header + [render_row(e) for e in entries])


def replace_block(text, start_marker, end_marker, replacement):
    pattern = re.compile(re.escape(start_marker) + r".*?" + re.escape(end_marker), re.DOTALL)
    if not pattern.search(text):
        print(f"  WARN: markers not found in index.md: {start_marker} / {end_marker}", file=sys.stderr)
        return text
    # count=1 so a literal marker mentioned later in prose (e.g. in "How to contribute")
    # is not also rewritten.
    return pattern.sub(f"{start_marker}\n\n{replacement}\n\n{end_marker}", text, count=1)


def render_summaries_index(entries):
    """Chronological newest-first list of all per-paper pages."""
    entries = sorted(entries, key=lambda e: -(e["comparison"].get("year") or 0))
    lines = [
        "---",
        "layout: default",
        "title: All papers",
        "---",
        "",
        "# All paper summaries",
        "",
        "Newest first. For the cross-paper comparison table, filters, and stats see the [home page]({{ '/' | relative_url }}).",
        "",
    ]
    for e in entries:
        slug = e["frontpage"].get("slug", "")
        title = (e["top"].get("title") or "").strip()
        year = e["comparison"].get("year", "")
        authors = author_short(e["top"].get("authors") or [])
        scheme = e["comparison"].get("fhe_scheme", "")
        lines.append(f"- {year} · [{title}]({slug}/) — {authors} — {scheme}")
    return "\n".join(lines) + "\n"


def main():
    entries = collect_entries()
    if not entries:
        sys.exit("No summary files found under summaries/.")
    text = INDEX.read_text()
    text = replace_block(text, "<!-- STATS:START -->", "<!-- STATS:END -->", render_stats(entries))
    text = replace_block(text, "<!-- FEATURED:START -->", "<!-- FEATURED:END -->", render_featured(entries))
    text = replace_block(text, "<!-- TABLE:START -->", "<!-- TABLE:END -->", render_table(entries))
    INDEX.write_text(text)
    (SUMMARIES_DIR / "index.md").write_text(render_summaries_index(entries))
    print(f"Wrote {INDEX} with {len(entries)} papers.")
    print(f"Wrote {SUMMARIES_DIR / 'index.md'} with {len(entries)} papers.")


if __name__ == "__main__":
    main()
