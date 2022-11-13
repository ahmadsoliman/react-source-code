import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import autoprefixer from "autoprefixer";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, name: "react-lib" },
      { file: pkg.module, format: "esm", sourcemap: true },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        plugins: [autoprefixer()],
        sourceMap: true,
        inject: true,
        minimize: true,
        loaders: ["style-loader", "css-loader"],
      }),
      terser(),
    ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
