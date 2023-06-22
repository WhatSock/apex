import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "./BuildBundle.js",
  output: {
    file: "Bundle/4X.js",
    format: "iife",
  },
  plugins: [
    resolve(),
    terser(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
      sourceMap: false,
    }),
  ],
};
