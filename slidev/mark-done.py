#!/usr/bin/env python3
"""Flip a deck to status: done in _data/decks.yml and record its slide count.

    python3 slidev/mark-done.py <slug> <slides>

Edits the file textually rather than re-dumping the YAML, so comments,
ordering and quoting survive untouched.
"""
import re
import sys
from pathlib import Path

slug, count = sys.argv[1], int(sys.argv[2])
path = Path(__file__).resolve().parent.parent / '_data' / 'decks.yml'
text = path.read_text()

block = re.search(rf'(  - slug: {re.escape(slug)}\n)(.*?)(?=\n  - slug: |\Z)', text, re.S)
if not block:
    sys.exit(f'no record for {slug} in {path}')

body = block.group(2)
if 'status: todo' not in body:
    sys.exit(f'{slug} is not marked todo — nothing to do')
body = body.replace('status: todo', 'status: done')
if 'slides:' in body:
    body = re.sub(r'slides: \d+', f'slides: {count}', body)
else:
    body = re.sub(r'(\n    strategy: .*\n)', rf'\1    slides: {count}\n', body, count=1)

path.write_text(text[:block.start(2)] + body + text[block.end(2):])
print(f'{slug}: done, {count} slides')
