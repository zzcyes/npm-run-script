#!/usr/bin/env node

const { Command } = require("commander");
const {
  intro,
  outro,
  select,
  confirm,
  isCancel,
  text,
} = require("@clack/prompts");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { spawn } = require("child_process");
const color = require("picocolors");
const path = require("path");
const locales = require("./locales");

// 将默认语言设置为英文
let currentLocale = "en";

const t = (key) => locales[currentLocale][key] || key;

const program = new Command();
const historyFile = path.join(__dirname, ".script-history.json");

const loadHistory = () =>
  existsSync(historyFile) ? JSON.parse(readFileSync(historyFile, "utf8")) : {};

const saveHistory = (projectPath, script) => {
  const history = loadHistory();
  history[projectPath] = [
    script,
    ...(history[projectPath]?.filter((cmd) => cmd !== script) || []),
  ].slice(0, 10);
  writeFileSync(historyFile, JSON.stringify(history, null, 2));
};

const getRecentCommands = (projectPath) => loadHistory()[projectPath] || [];

const getRecentCommand = (projectPath, index) =>
  getRecentCommands(projectPath)[index] || null;

const listRecentCommands = (projectPath) => {
  const recentCommands = getRecentCommands(projectPath);
  console.log(color.cyan(`\n${t("recentCommands")}: ${projectPath}`));
  recentCommands.forEach((cmd, index) => {
    console.log(`  ${color.yellow(index + 1)}: ${color.green(cmd)}`);
  });
};

const getProjectPath = async (advanced) => {
  if (!advanced) return process.cwd();

  const projectPath = await text({
    message: t("selectProject"),
    initialValue: process.cwd(),
    validate: (value) => {
      if (!value || value.length === 0) return t("projectPathRequired");
      if (!existsSync(path.join(value, "package.json")))
        return t("noPackageJson");
      return undefined;
    },
  });

  if (isCancel(projectPath)) {
    outro(color.yellow(t("operationCancelled")));
    process.exit(0);
  }

  return projectPath;
};

const getScripts = (projectPath) => {
  const scripts =
    JSON.parse(readFileSync(path.join(projectPath, "package.json"), "utf8"))
      .scripts || {};
  if (Object.keys(scripts).length === 0) {
    outro(color.yellow(t("noScripts")));
    process.exit(0);
  }
  return scripts;
};

const getScriptChoices = (scripts) =>
  Object.entries(scripts).map(([name, command]) => ({
    value: name,
    label: `${color.green(name)} ${color.dim(`- ${command}`)}`,
  }));

const selectScript = async (scriptChoices, listOnly, searchTerm) => {
  if (searchTerm) {
    const filteredChoices = scriptChoices.filter((choice) =>
      choice.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredChoices.length === 0) {
      console.log(color.yellow(t("noMatchingScripts")));
      process.exit(0);
    }

    const selectedScript = await select({
      message: t("selectMatchingScript"),
      options: filteredChoices,
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
      options: scriptChoices,
    });

    if (isCancel(selectedScript)) {
      outro(color.yellow(t("operationCancelled")));
      process.exit(0);
    }

    return selectedScript;
  }

  // 完整的脚本选择界面，包括搜索功能，用于 nrs -la
  // ... (保持原有的选择逻辑不变)
};

const runSelectedScript = (projectPath, selectedScript) => {
  if (!selectedScript) {
    outro(color.yellow(t("noScriptSelected")));
    process.exit(0);
  }

  console.log(`\n${t("running")} ${color.cyan(selectedScript)}`);

  const child = spawn("npm", ["run", selectedScript], {
    stdio: "inherit",
    shell: true,
    cwd: projectPath,
  });

  child.on("exit", (code) => {
    if (code === 0) {
      console.log(`\n${t("success")}`);
    } else {
      console.log(`\n${t("failure")} ${code}`);
    }
    outro(color.bgCyan(` ${t("thanks")} `));
  });

  process.on("SIGINT", () => {
    child.kill("SIGINT");
    console.log(`\n${t("interrupted")}`);
    outro(color.bgCyan(` ${t("thanks")} `));
    process.exit(0);
  });
};

const runScript = async (options = {}) => {
  const { searchTerm, advanced, listOnly, recentIndex } = options;

  intro(
    `${color.bold(color.cyan(t("intro")))} ${color.dim(
      require("./package.json").version
    )}`
  );

  const projectPath = await getProjectPath(advanced);
  const scripts = getScripts(projectPath);
  const scriptChoices = getScriptChoices(scripts);

  let selectedScript;

  if (recentIndex !== undefined) {
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
        message: `${t("runLastScript")} "${color.cyan(recentCommands[0])}"?`,
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

const showHelp = () => {
  console.log(color.cyan(`\n${t("helpTitle")}`));
  console.log(color.dim(`\n${t("availableCommands")}`));
  console.log(`  ${color.green("nrs")}               ${t("listScripts")}`); // 更新这行
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
  console.log(color.dim(`\n${t("examples")}`));
  console.log(`  ${color.green("nrs -l")}            ${t("listScripts")}`);
  console.log(`  ${color.green("nrs -la")}           ${t("advancedMode")}`);
  console.log(
    `  ${color.green("nrs -s test")}       ${t("searchScriptsTest")}`
  );
  console.log(`  ${color.green("nrs -r --2")}        ${t("runRecentScript2")}`);
  console.log(`  ${color.green("nrs -v, --version")}  ${t("version")}`);
};

const showVersion = () => {
  const version = require("./package.json").version;
  console.log(`${t("version")} ${color.cyan(version)}`);
};

program
  .name("nrs")
  .description(t("intro"))
  .version(require("./package.json").version, "-v, --version", t("version"))
  .option("-l, --list", t("listScripts"))
  .option("-a, --advanced", t("advancedMode"))
  .option("-s, --search <keyword>", t("searchScripts"))
  .option("-r, --recent", t("runRecentScript"))
  .option("-rl, --recent-list", t("listRecentScripts"))
  .option("--list-all", t("listAllScripts"))
  //   .option("--lang <language>", t("changeLanguage"))
  .action(async (options, command) => {
    // 检查是否有未知的命���
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
      console.log(color.cyan(`\n${t("availableScripts")}`));
      Object.entries(scripts).forEach(([name, command]) => {
        console.log(`  ${color.green(name)}: ${color.dim(command)}`);
      });
    } else if (options.recentList) {
      listRecentCommands(projectPath);
    } else if (options.recent) {
      const recentIndex = program.args.find((arg) => arg.startsWith("--"))
        ? parseInt(program.args.find((arg) => arg.startsWith("--")).slice(2)) -
          1
        : 0;
      await runScript({ recentIndex, projectPath });
    } else if (options.list || options.advanced || options.search) {
      await runScript({
        searchTerm: options.search,
        advanced: options.advanced,
        listOnly: options.list,
        projectPath,
      });
    } else {
      showHelp();
    }
  });

program.parse(process.argv);

// 如果没有匹配的命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// 确保这些函数被正确导出
module.exports = {
  loadHistory,
  saveHistory,
  getProjectPath,
  getScripts,
  runSelectedScript,
  runScript,
  showHelp,
  showVersion,
};
