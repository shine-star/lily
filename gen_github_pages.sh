#!/bin/bash

cd `dirname $0`

yarn build
rm -rf docs/*
mkdir -p docs
cp index.html docs/
cp -r dist docs/
cp -r data docs/
