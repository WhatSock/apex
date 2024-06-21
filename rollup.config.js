import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "./BuildBundle.js",
  output: {
    file: "Bundle/4X.js",
    format: "esm", // Changed to esm for module compatibility
  },
  plugins: [
    resolve(),
    commonjs(), // Added CommonJS plugin
    terser(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
      sourceMap: false,
    }),
  ],
};
