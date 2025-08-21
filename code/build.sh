#!/bin/bash
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/add.js -- add.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/del.js -- del.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/get.js -- get.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/list.js -- list.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/toggle.js -- toggle.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/img.js -- img.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/ai.js -- ai.js
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/archivelist.js -- archivelist.js

