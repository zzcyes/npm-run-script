const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const entryPoint = path.join(__dirname, "run-script.js");
const outDir = path.join(__dirname, "dist");

const commonConfig = {
  entryPoints: [entryPoint],
  bundle: true,
  platform: "node",
  target: "node14",
  external: ["@clack/prompts", "commander", "picocolors"],
};

const builds = [
  // CJS
  { ...commonConfig, outfile: path.join(outDir, "index.cjs"), format: "cjs" },
  // ESM
  { ...commonConfig, outfile: path.join(outDir, "index.mjs"), format: "esm" },
  // Minified CJS
  {
    ...commonConfig,
    outfile: path.join(outDir, "index.min.cjs"),
    format: "cjs",
    minify: true,
  },
  // Minified ESM
  {
    ...commonConfig,
    outfile: path.join(outDir, "index.min.mjs"),
    format: "esm",
    minify: true,
  },
];

Promise.all(builds.map((config) => esbuild.build(config)))
  .then(() => {
    // Create package.json in dist directory
    const packageJson = require("./package.json");
    const distPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      main: "index.cjs",
      module: "index.mjs",
      exports: {
        ".": {
          require: "./index.cjs",
          import: "./index.mjs",
        },
      },
      bin: {
        nrs: "index.cjs",
      },
      dependencies: packageJson.dependencies,
      author: packageJson.author,
      license: packageJson.license,
      repository: packageJson.repository,
      bugs: packageJson.bugs,
      homepage: packageJson.homepage,
    };

    fs.writeFile(
      path.join(outDir, "package.json"),
      JSON.stringify(distPackageJson, null, 2),
      (err) => {
        if (err) {
          console.error(
            "\x1b[31mFailed to create dist/package.json:",
            err,
            "\x1b[0m"
          );
          process.exit(1);
        }
        console.log(
          "\x1b[32mBuild completed. Different module formats generated. package.json has been created in the dist directory.\x1b[0m"
        );
      }
    );
  })
  .catch((error) => {
    console.error("Error during build process:", error);
    process.exit(1);
  });
