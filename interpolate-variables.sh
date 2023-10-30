#!/usr/bin/env bash

set -e

# Set the secrets as env vars
EXISTING_VARS=$(printenv | awk -F= '{print $1}'| grep DOCKER_INJECT_ | sed 's/^/\$/g' | paste -sd,)
export EXISTING_VARS;

echo "Interpolating variables in static files:"
echo -e "$EXISTING_VARS" | sed s/\$//g | sed s/,/\\n/g

for file in /usr/share/nginx/html/*.html /usr/share/nginx/html/assets/*.js;
do
  cat "$file" | envsubst "$EXISTING_VARS" > "$file.tmp" && cp "$file.tmp" "$file"
done

echo "Trying to find uninterpolated variables"
! (grep -o '\$DOCKER[A-Z|_]*' /usr/share/nginx/html/*.html /usr/share/nginx/html/assets/*.js)

if [[ $? -ne 0 ]]; then
  echo "Uninterpolated variables found, exiting"
  exit 1
fi
nginx -g 'daemon off;'
