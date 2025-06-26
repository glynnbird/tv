#!/bin/bash
export NODE_VERSION=22.16.0

# build frontend
echo "Building frontend 🏢"
cd frontend
npm ci
npm run generate
mv dist ../
cd ..

# build functions
echo "Building functions ƛ😉"
cd code
npm ci
./build.sh
cd ..
