#!/bin/bash
npm audit fix --force
npm install rollup @rollup/plugin-node-resolve rollup-plugin-terser rollup-plugin-postcss --save-dev 2>> BuildErrors.txt