import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: 'add.js',
    output: { format: 'esm', file: '../functions/api/add.js' },
  },
  {
    input: 'ai.js',
    output: { format: 'esm', file: '../functions/api/ai.js' },
  },
  {
    input: 'archivelist.js',
    output: { format: 'esm', file: '../functions/api/archivelist.js' },
  },
  {
    input: 'del.js',
    output: { format: 'esm', file: '../functions/api/del.js' },
  },
  {
    input: 'get.js',
    output: { format: 'esm', file: '../functions/api/get.js' },
  },
  {
    input: 'img.js',
    output: { format: 'esm', file: '../functions/api/img.js' },
  },
  {
    input: 'list.js',
    output: { format: 'esm', file: '../functions/api/list.js' },
  },
  {
    input: 'toggle.js',
    output: { format: 'esm', file: '../functions/api/toggle.js' },
  }
]);
