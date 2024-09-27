#!/usr/bin/env node
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// locales.js
var require_locales = __commonJS({
  "locales.js"(exports, module) {
    module.exports = {
      en: {
        intro: "\u{1F680} NPM Script Runner",
        selectProject: "\u{1F4C1} Select project location",
        projectPathRequired: "Project path is required!",
        noPackageJson: "No package.json found in the selected path!",
        noScripts: "No available scripts found.",
        selectScript: "\u{1F527} Select a script to run:",
        runLastScript: "Do you want to run the last script",
        running: "\u{1F4E6} Running script:",
        success: "\u2705 Script executed successfully!",
        failure: "\u274C Script execution failed, exit code:",
        interrupted: "\u{1F6D1} Script interrupted by user",
        thanks: "Thank you for using NPM Script Runner",
        operationCancelled: "Operation cancelled",
        helpTitle: "\u{1F680} NPM Script Runner (nrs) Help",
        availableCommands: "Available commands:",
        showHelp: "Show this help information",
        listScripts: "List and select scripts to run",
        advancedMode: "Enter advanced mode: select project path and run scripts",
        searchScripts: "Search for scripts and run matching ones",
        runRecentScript: "Run the most recently used script",
        runRecentScriptN: "Run the nth most recently used script",
        listRecentScripts: "View the list of recently used scripts",
        listAllScripts: "Display all available scripts",
        examples: "Examples:",
        searchScriptsTest: "Search for scripts containing 'test' and run",
        runRecentScript2: "Run the 2nd most recently used script",
        changeLanguage: "Change the display language (available: en, zh)",
        languageChanged: "Language changed to English",
        unsupportedLanguage: "Unsupported language. Please use 'en' for English or 'zh' for Chinese.",
        recentCommands: "Recently used scripts in",
        noRecentScript: "No recent script found at index",
        availableScripts: "Available scripts:",
        version: "NPM Script Runner version:"
      },
      zh: {
        intro: "\u{1F680} NPM \u811A\u672C\u8FD0\u884C\u5668",
        selectProject: "\u{1F4C1} \u9009\u62E9\u9879\u76EE\u4F4D\u7F6E",
        projectPathRequired: "\u9879\u76EE\u8DEF\u5F84\u5FC5\u586B\uFF01",
        noPackageJson: "\u6240\u9009\u8DEF\u5F84\u4E0B\u6CA1\u6709\u627E\u5230 package.json \u6587\u4EF6\uFF01",
        noScripts: "\u6CA1\u6709\u627E\u5230\u53EF\u7528\u7684\u811A\u672C\u3002",
        selectScript: "\u{1F527} \u9009\u62E9\u8981\u8FD0\u884C\u7684\u811A\u672C:",
        runLastScript: "\u662F\u5426\u8FD0\u884C\u4E0A\u6B21\u7684\u811A\u672C",
        running: "\u{1F4E6} \u6B63\u5728\u8FD0\u884C\u811A\u672C:",
        success: "\u2705 \u811A\u672C\u6267\u884C\u6210\u529F\uFF01",
        failure: "\u274C \u811A\u672C\u6267\u884C\u5931\u8D25\uFF0C\u9000\u51FA\u7801:",
        interrupted: "\u{1F6D1} \u811A\u672C\u88AB\u7528\u6237\u4E2D\u65AD",
        thanks: "\u611F\u8C22\u4F7F\u7528 NPM \u811A\u672C\u8FD0\u884C\u5668",
        operationCancelled: "\u64CD\u4F5C\u5DF2\u53D6\u6D88",
        // ... 添加更多中文翻译
        version: "NPM \u811A\u672C\u8FD0\u884C\u5668\u7248\u672C\uFF1A",
        changeLanguage: "\u66F4\u6539\u663E\u793A\u8BED\u8A00\uFF08\u53EF\u7528\uFF1Aen, zh\uFF09",
        languageChanged: "\u8BED\u8A00\u5DF2\u66F4\u6539\u4E3A\u4E2D\u6587"
      }
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "scriptz-cli",
      version: "0.0.3",
      description: "A CLI tool to visualize and run npm scripts",
      main: "lib/index.cjs",
      module: "lib/index.mjs",
      exports: {
        ".": {
          require: "./lib/index.cjs",
          import: "./lib/index.mjs"
        }
      },
      bin: {
        nrs: "lib/index.cjs"
      },
      scripts: {
        start: "node run-script.js",
        build: "node build.js",
        prepublishOnly: "npm run build"
      },
      files: [
        "lib",
        "README.md",
        "README.zh-cn.md",
        "demo.png",
        "LICENSE"
      ],
      dependencies: {
        "@clack/prompts": "^0.7.0",
        commander: "^12.1.0",
        picocolors: "^1.1.0"
      },
      devDependencies: {
        esbuild: "^0.19.0"
      },
      keywords: [
        "npm",
        "scripts",
        "cli",
        "tool"
      ],
      author: "zzcyes",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/zzcyes/scriptz-cli.git"
      },
      bugs: {
        url: "https://github.com/zzcyes/scriptz-cli/issues"
      },
      homepage: "https://github.com/zzcyes/scriptz-cli#readme"
    };
  }
});

// run-script.js
var require_run_script = __commonJS({
  "run-script.js"(exports, module) {
    var { Command } = __require("commander");
    var {
      intro,
      outro,
      select,
      confirm,
      isCancel,
      text
    } = __require("@clack/prompts");
    var { readFileSync, writeFileSync, existsSync } = __require("fs");
    var { spawn } = __require("child_process");
    var color = __require("picocolors");
    var path = __require("path");
    var locales = require_locales();
    var currentLocale = "en";
    var t = (key) => locales[currentLocale][key] || key;
    var program = new Command();
    var historyFile = path.join(__dirname, ".script-history.json");
    var loadHistory = () => existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, "utf8")) : {};
    var saveHistory = (projectPath, script) => {
      var _a;
      const history = loadHistory();
      history[projectPath] = [
        script,
        ...((_a = history[projectPath]) == null ? void 0 : _a.filter((cmd) => cmd !== script)) || []
      ].slice(0, 10);
      writeFileSync(historyFile, JSON.stringify(history, null, 2));
    };
    var getRecentCommands = (projectPath) => loadHistory()[projectPath] || [];
    var getRecentCommand = (projectPath, index) => getRecentCommands(projectPath)[index] || null;
    var listRecentCommands = (projectPath) => {
      const recentCommands = getRecentCommands(projectPath);
      console.log(color.cyan(`
${t("recentCommands")}: ${projectPath}`));
      recentCommands.forEach((cmd, index) => {
        console.log(`  ${color.yellow(index + 1)}: ${color.green(cmd)}`);
      });
    };
    var getProjectPath = async (advanced) => {
      if (!advanced)
        return process.cwd();
      const projectPath = await text({
        message: t("selectProject"),
        initialValue: process.cwd(),
        validate: (value) => {
          if (!value || value.length === 0)
            return t("projectPathRequired");
          if (!existsSync(path.join(value, "package.json")))
            return t("noPackageJson");
          return void 0;
        }
      });
      if (isCancel(projectPath)) {
        outro(color.yellow(t("operationCancelled")));
        process.exit(0);
      }
      return projectPath;
    };
    var getScripts = (projectPath) => {
      const scripts = JSON.parse(readFileSync(path.join(projectPath, "package.json"), "utf8")).scripts || {};
      if (Object.keys(scripts).length === 0) {
        outro(color.yellow(t("noScripts")));
        process.exit(0);
      }
      return scripts;
    };
    var getScriptChoices = (scripts) => Object.entries(scripts).map(([name, command]) => ({
      value: name,
      label: `${color.green(name)} ${color.dim(`- ${command}`)}`
    }));
    var selectScript = async (scriptChoices, listOnly, searchTerm) => {
      if (searchTerm) {
        const filteredChoices = scriptChoices.filter(
          (choice) => choice.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredChoices.length === 0) {
          console.log(color.yellow(t("noMatchingScripts")));
          process.exit(0);
        }
        const selectedScript = await select({
          message: t("selectMatchingScript"),
          options: filteredChoices
        });
        if (isCancel(selectedScript)) {
          outro(color.yellow(t("operationCancelled")));
          process.exit(0);
        }
        return selectedScript;
      }
      if (listOnly) {
        const selectedScript = await select({
          message: t("selectScript"),
          options: scriptChoices
        });
        if (isCancel(selectedScript)) {
          outro(color.yellow(t("operationCancelled")));
          process.exit(0);
        }
        return selectedScript;
      }
    };
    var runSelectedScript = (projectPath, selectedScript) => {
      if (!selectedScript) {
        outro(color.yellow(t("noScriptSelected")));
        process.exit(0);
      }
      console.log(`
${t("running")} ${color.cyan(selectedScript)}`);
      const child = spawn("npm", ["run", selectedScript], {
        stdio: "inherit",
        shell: true,
        cwd: projectPath
      });
      child.on("exit", (code) => {
        if (code === 0) {
          console.log(`
${t("success")}`);
        } else {
          console.log(`
${t("failure")} ${code}`);
        }
        outro(color.bgCyan(` ${t("thanks")} `));
      });
      process.on("SIGINT", () => {
        child.kill("SIGINT");
        console.log(`
${t("interrupted")}`);
        outro(color.bgCyan(` ${t("thanks")} `));
        process.exit(0);
      });
    };
    var runScript = async (options = {}) => {
      const { searchTerm, advanced, listOnly, recentIndex } = options;
      intro(
        `${color.bold(color.cyan(t("intro")))} ${color.dim(
          require_package().version
        )}`
      );
      const projectPath = await getProjectPath(advanced);
      const scripts = getScripts(projectPath);
      const scriptChoices = getScriptChoices(scripts);
      let selectedScript;
      if (recentIndex !== void 0) {
        selectedScript = getRecentCommand(projectPath, recentIndex);
        if (!selectedScript) {
          outro(color.yellow(`${t("noRecentScript")} ${recentIndex + 1}.`));
          process.exit(0);
        }
      } else if (searchTerm) {
        selectedScript = await selectScript(scriptChoices, false, searchTerm);
      } else if (!listOnly) {
        const recentCommands = getRecentCommands(projectPath);
        if (recentCommands.length > 0 && scripts[recentCommands[0]]) {
          const runLast = await confirm({
            message: `${t("runLastScript")} "${color.cyan(recentCommands[0])}"?`
          });
          if (isCancel(runLast)) {
            outro(color.yellow(t("operationCancelled")));
            process.exit(0);
          }
          if (runLast) {
            selectedScript = recentCommands[0];
          }
        }
      }
      if (!selectedScript) {
        selectedScript = await selectScript(scriptChoices, listOnly);
      }
      if (selectedScript) {
        saveHistory(projectPath, selectedScript);
        runSelectedScript(projectPath, selectedScript);
      } else {
        outro(color.bgCyan(` ${t("thanks")} `));
        process.exit(0);
      }
      return selectedScript;
    };
    var showHelp = () => {
      console.log(color.cyan(`
${t("helpTitle")}`));
      console.log(color.dim(`
${t("availableCommands")}`));
      console.log(`  ${color.green("nrs")}               ${t("listScripts")}`);
      console.log(`  ${color.green("nrs -l")}            ${t("listScripts")}`);
      console.log(`  ${color.green("nrs -la")}           ${t("advancedMode")}`);
      console.log(`  ${color.green("nrs -s <keyword>")}  ${t("searchScripts")}`);
      console.log(`  ${color.green("nrs -r")}            ${t("runRecentScript")}`);
      console.log(`  ${color.green("nrs -r --<n>")}      ${t("runRecentScriptN")}`);
      console.log(
        `  ${color.green("nrs -rl")}           ${t("listRecentScripts")}`
      );
      console.log(`  ${color.green("nrs --list-all")}    ${t("listAllScripts")}`);
      console.log(`  ${color.green("nrs --help")}        ${t("showHelp")}`);
      console.log(color.dim(`
${t("examples")}`));
      console.log(`  ${color.green("nrs -l")}            ${t("listScripts")}`);
      console.log(`  ${color.green("nrs -la")}           ${t("advancedMode")}`);
      console.log(
        `  ${color.green("nrs -s test")}       ${t("searchScriptsTest")}`
      );
      console.log(`  ${color.green("nrs -r --2")}        ${t("runRecentScript2")}`);
      console.log(`  ${color.green("nrs -v, --version")}  ${t("version")}`);
    };
    var showVersion = () => {
      const version = require_package().version;
      console.log(`${t("version")} ${color.cyan(version)}`);
    };
    program.name("nrs").description(t("intro")).version(require_package().version, "-v, --version", t("version")).option("-l, --list", t("listScripts")).option("-a, --advanced", t("advancedMode")).option("-s, --search <keyword>", t("searchScripts")).option("-r, --recent", t("runRecentScript")).option("-rl, --recent-list", t("listRecentScripts")).option("--list-all", t("listAllScripts")).action(async (options, command) => {
      if (command.args.length > 0) {
        console.log(
          color.yellow(t("unknownCommand", { command: command.args[0] }))
        );
        showHelp();
        return;
      }
      const projectPath = process.cwd();
      if (options.version) {
        showVersion();
        return;
      }
      if (options.lang) {
        if (options.lang === "zh" || options.lang === "en") {
          currentLocale = options.lang;
          console.log(t("languageChanged"));
        } else {
          console.log(color.yellow(t("unsupportedLanguage")));
          console.log(color.cyan(t("changeLanguage")));
        }
        return;
      }
      if (options.listAll) {
        const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
        const scripts = packageJson.scripts || {};
        console.log(color.cyan(`
${t("availableScripts")}`));
        Object.entries(scripts).forEach(([name, command2]) => {
          console.log(`  ${color.green(name)}: ${color.dim(command2)}`);
        });
      } else if (options.recentList) {
        listRecentCommands(projectPath);
      } else if (options.recent) {
        const recentIndex = program.args.find((arg) => arg.startsWith("--")) ? parseInt(program.args.find((arg) => arg.startsWith("--")).slice(2)) - 1 : 0;
        await runScript({ recentIndex, projectPath });
      } else if (options.list || options.advanced || options.search) {
        await runScript({
          searchTerm: options.search,
          advanced: options.advanced,
          listOnly: options.list,
          projectPath
        });
      } else {
        showHelp();
      }
    });
    program.parse(process.argv);
    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
    module.exports = {
      loadHistory,
      saveHistory,
      getProjectPath,
      getScripts,
      runSelectedScript,
      runScript,
      showHelp,
      showVersion
    };
  }
});
export default require_run_script();
