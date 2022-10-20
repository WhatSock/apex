#!/bin/bash
npm audit fix --force
npm -g install static-server
npm -g install prettier
npm -g install js-beautify
npm -g install uglify-js
npm -g install linkinator