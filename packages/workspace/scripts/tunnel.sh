#!/usr/bin/env bash
set -e

cd /tmp

if [ ! -f ./code ]; then
  curl --silent --location \
    "https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64" \
    | tar -xz
fi

exec ./code tunnel \
  --accept-server-license-terms \
  --name "slurm-${SLURM_JOB_ID}"