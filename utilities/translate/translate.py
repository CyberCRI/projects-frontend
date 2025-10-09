#!/usr/bin/env python3

import json
import re
import sys
from collections import defaultdict
from functools import cache

import argostranslate.package
import argostranslate.translate

# Download and install Argos Translate package
argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()


@cache
def install_need_lang(from_code, to_code):
    try:
        package_to_install = next(
            filter(
                lambda x: x.from_code == from_code and x.to_code == to_code,
                available_packages,
            )
        )
    except StopIteration:
        raise ValueError(f"Target lang '{to_code}' is not supported")
    argostranslate.package.install_from_path(package_to_install.download())


def translate(info):
    # Translate text, but keep placeholders like "{ my_variable }" intact
    placeholder_base = 132154654

    value = info["value"]
    placeholders = re.findall(r"\{\s*[^}]+\s*\}", value)

    for index, placeholder in enumerate(placeholders):
        # replace the placeholder with a unique identifier
        unique_placeholder = str(placeholder_base + index)
        value = value.replace(placeholder, unique_placeholder)

    result = {}
    for to_code in info["to"]:
        translated = argostranslate.translate.translate(value, info["from"], to_code)
        for index, placeholder in enumerate(placeholders):
            # replace the unique identifier with the original placeholder
            unique_placeholder = str(placeholder_base + index)
            translated = translated.replace(unique_placeholder, placeholder)

        result[to_code] = translated

    return result


if __name__ == "__main__":
    json_from = " ".join(sys.argv[1:])
    totranslate = json.loads(json_from)
    results = {}

    ignored = defaultdict(set)
    for info in totranslate.values():
        for code in info["to"]:
            try:
                install_need_lang(info["from"], code)
            except Exception:
                ignored[info["from"]].add(code)

    for k, info in totranslate.items():
        # remove ingore from-> to lang
        info["to"] = list(set(info["to"]) - ignored[info["from"]])
        results[k] = translate(info)

    for i in list(ignored):
        ignored[i] = list(ignored[i])
        if not ignored[i]:
            del ignored[i]

    results["__INGORED__"] = dict(ignored)
    print(json.dumps(results))
