import * as jsYaml from 'js-yaml';

const Typograf = require('typograf');
const Hypher = require('hypher');
const hyphenation = require('hyphenation.ru');

import { FileData, TextBlock } from 'Article';

const typograf = new Typograf({
  locale: 'ru',
  htmlEntity: {
    type: 'digits'
  }
});

const hypher = new Hypher(hyphenation);

export function parseArticleFileData(fileContent: string) {

  const content = jsYaml.load(fileContent) as FileData;

  content.intro.text.forEach(prettifyText);

  content.body.forEach((bodyItem: TextBlock) => {
    bodyItem.text.forEach(prettifyText);
  });

  content.conclusion.text.forEach(prettifyText);

  return content;
}

function prettifyText(item: string, index: number, arr: string[]): void {
  // let returnText = item;
  // returnText = hypher.hyphenateText(returnText, 5);
  // returnText = returnText.replace(/​+/g, '');
  // returnText = typograf.execute(returnText);
  // arr[index] = returnText;
  arr[index] = item;
}