#!/usr/bin/env bash
set -e

#if [ -n "${DEBUG:-}" ]; then
  set -x
#fi

cartesi-machine                                                                 \
    --assert-rolling-template                                                   \
    --ram-length="$CM_RAM_LENGTH"                                               \
    --rollup                                                                    \
    --flash-drive=label:"$CM_FLASH_DRIVE_LABEL",filename:"$CM_FLASH_DRIVE_PATH" \
    --final-hash                                                                \
    --store="$CM_STORE_PATH"                                                    \
    -- "$CM_BOOTARGS"

chmod 755 "$CM_STORE_PATH"