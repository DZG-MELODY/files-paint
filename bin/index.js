#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk').default;
const traverseFiles = require('./traverse');
const isValidateTarget = require('./isValidateTarget');
const FileNodeProcessor = require('./fileNodeProcessor');

// 解析命令行参数
const params = minimist(process.argv.slice(2));
const runPath = process.cwd();

// 获取根目录
const rootDir = params.dir || runPath;
const root = path.resolve(rootDir);

// 初始化文件节点处理器
let target = 'txt';
if (isValidateTarget(params.target || '')) {
  target = params.target || 'txt';
} else {
  console.log(chalk.yellow('[warn]: target is not validate, set default value'));
}
const processorOption = FileNodeProcessor.createProcessorOptions(target);
const fileNodeProcessor = new FileNodeProcessor(processorOption);

// 目标文件
const output = params.output || 'filePaint';
const outputFile = path.resolve(process.cwd(), `${output}.${target}`);

// 迭代预设方法
const predicate = dir => {
  const hasChildFile = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  const files = hasChildFile ? fs.readdirSync(dir).map(file => path.resolve(dir, file)) : [];
  return {
    done: !hasChildFile,
    iterators: files
  };
};
// 文件节点处理方法
const nodeHandle = (node, parents, fileList) => {
  const name = path.basename(node);
  const level = parents.length;
  const fileInfoLine = fileNodeProcessor.createFileInfoLine(name, level);
  fileList.push(fileInfoLine);
};

console.log();
console.log(chalk.yellow('==== file-paint start ===='));
console.log();
console.log(chalk.blue(`input: ${root}`));
console.log();

traverseFiles(root, predicate, nodeHandle).then(list => {
  const content = list.join('\r\n');

  console.log(chalk.blue(`output: ${outputFile}`));
  console.log();
  console.log(chalk.green('***************'));
  console.log(chalk.green(content));
  console.log(chalk.green('***************'));

  fs.writeFileSync(outputFile, content, 'utf-8');

  console.log();
  console.log(chalk.yellow('==== file-paint end ===='));
  console.log();
}, err => {
  console.log(chalk.red(err.message));
  process.exit(-1);
});
