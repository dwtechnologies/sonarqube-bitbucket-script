#!/bin/sh

# KMS decrypt
export $(kmsdecryptenv)

set -x

yarn start
