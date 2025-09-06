import { Config } from "bili";

const config: Config = {
  input: "src/index.ts",
  extendRollupConfig: (config) => {
    config.outputConfig.exports = "auto";
    return config;
  },
  output: {
    format: ["umd", "umd-min", "esm", "cjs"],
    moduleName: "PowiainaNum",
    sourceMap: false,
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify ? "PowiainaNum.min.js" : "PowiainaNum.js";
        case "esm":
          return "PowiainaNum.esm.js";
        case "cjs":
          return context.minify
            ? "PowiainaNum.min.cjs.js"
            : "PowiainaNum.cjs.js";
        default:
          return defaultFileName;
      }
    },
  },
};

export default config;
