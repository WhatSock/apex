#!/bin/bash
npm install -g create-react-app
npx create-react-app test-react-app
cp -r "./src"/* "./test-react-app/src"
cd test-react-app
npm install apex4x
npm start