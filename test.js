const { prompt } = require('enquirer');
const shell = require('shelljs');

let start = "npm run serve";
let serve = "node ./bin/www";

let buildStylus = "stylus src/css/style.styl -o dist/css/style.css";
let watchStylus = "stylus -w src/css/style.styl -o dist/css/style.css";
let buildTs = "tsc";
let watchTs = "tsc -w";
let watchNode = "nodemon ./bin/www";
let tslint = "tslint -c tslint.json -p tsconfig.json";
let clear = "rm -rf node_modules package-lock.json dis";
let makeStaticDir = "mkdir -p dist/css/";
let copyStatic = "cp -R src/public/* dist";
let copyStaticAssets = `${makeStaticDir} && ${copyStatic}`;

let watch = "concurrently -k -p \"[{name}]\" -n \"Stylus,TypeScript,Node\" -c \"red.bold,blue.bold,green.bold\" \"npm run watch-stylus\" \"npm run watch-ts\" \"npm run watch-node\"";
let build = `${copyStaticAssets} && ${buildStylus} && ${buildTs} && ${tslint}`;
let dev = `${build} && ${watch}`;
let prod = `${clear} && npm i && ${build}`;

const question = {
  type: 'select',
  name: 'command',
  message: 'What command to run?',
  initial: 1,
  choices: [
    {
      name: 'start',
      message: 'Dev'
    }, {
      name: 'build',
      message: 'Prod'
    }
  ]
};

prompt(question)
  .then(answer => {
    console.log('Answer:', answer)

    shell.exec(`npm run ${answer.command}`)
  })
  .catch(console.error);
