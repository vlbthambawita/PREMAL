#!/usr/bin/env bash
# Build every deck in src/ into ../decks/<slug>/.
#
# Each deck is built separately because --base has to be per-deck for the SPA
# router to resolve correctly under the /PREMAL/ project-page prefix.
#
#   ./build.sh                 build all decks
#   ./build.sh nexus-2024 ...  build only the named slugs
#
# BASE_PREFIX overrides the deployment prefix (set it to "/" for a root-served
# preview). OUT_ROOT overrides where the built decks land; CI points it straight
# at _site/decks so the SPA output never passes through Jekyll, which silently
# drops the chunks Vite names with a leading underscore.
set -euo pipefail

cd "$(dirname "$0")"

BASE_PREFIX="${BASE_PREFIX:-/PREMAL}"
if [ -n "${OUT_ROOT:-}" ]; then
  mkdir -p "$OUT_ROOT"
  OUT_ROOT="$(cd "$OUT_ROOT" && pwd)"
else
  OUT_ROOT="$(cd .. && pwd)/decks"
fi

if [ "$#" -gt 0 ]; then
  slugs=("$@")
else
  slugs=()
  for f in src/*.md; do
    [ -e "$f" ] || continue
    slugs+=("$(basename "$f" .md)")
  done
fi

if [ "${#slugs[@]}" -eq 0 ]; then
  echo "no decks found in src/" >&2
  exit 1
fi

mkdir -p "$OUT_ROOT"

failed=()
for slug in "${slugs[@]}"; do
  src="src/${slug}.md"
  if [ ! -f "$src" ]; then
    echo "!! missing $src" >&2
    failed+=("$slug")
    continue
  fi
  echo "==> building $slug"
  if ! npx slidev build "$src" \
      --base "${BASE_PREFIX}/decks/${slug}/" \
      --out "${OUT_ROOT}/${slug}" \
      >/dev/null; then
    echo "!! build failed: $slug" >&2
    failed+=("$slug")
  fi
done

echo
echo "built $(( ${#slugs[@]} - ${#failed[@]} ))/${#slugs[@]} decks into ${OUT_ROOT}"
if [ "${#failed[@]}" -gt 0 ]; then
  printf 'failed: %s\n' "${failed[*]}" >&2
  exit 1
fi
