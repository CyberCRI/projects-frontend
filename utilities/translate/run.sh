#!/usr/bin/env bash

cd "$(realpath "$(dirname "$0")")"

uv venv -p 3.11
source .venv/bin/activate
uv pip install argostranslate
uv run translate.py $@
