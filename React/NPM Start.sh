#!/bin/bash
if [ ! -d "./test-react-app/src" ]; then
  exit 1
fi
cd test-react-app
npm install apex4x
npm start