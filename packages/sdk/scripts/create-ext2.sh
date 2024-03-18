#!/usr/bin/env bash
set -e

#if [ -n "${DEBUG:-}" ]; then
  set -x
#fi

genext2fs                           \
    --tarball "$G2FS_TAR_PATH"      \
    --block-size "$G2FS_BLOCK_SIZE" \
    --faketime                      \
    -r "$G2FS_EXTRA_SIZE"           \
    "$G2FS_EXT2_PATH"
