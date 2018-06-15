import * as jsYaml from 'js-yaml';

const Typograf = require('typograf');
const Hypher = require('hypher');
const hyphenation = require('hyphenation.ru');

import { FileData } from 'Article';

const typograf = new Typograf({
  locale: 'ru',
  htmlEntity: {
    type: 'digits'
  }
});

const hypher = new Hypher(hyphenation);

export function parseArticleFileData(fileContent: string) {

  const content = jsYaml.load(fileContent) as FileData;

  content.intro.text.forEach((item: string, index: number, arr: string[]) => {
    let returnText = item;
    returnText = hypher.hyphenateText(returnText, 5);
    returnText = returnText.replace(/​+/g, '');
    returnText = typograf.execute(returnText);
    arr[index] = returnText;
  });

  content.body.forEach((bodyItem: any) => {
    bodyItem.text.forEach((item: string, index: number, arr: string[]) => {
      let returnText = item;
      returnText = hypher.hyphenateText(returnText, 5);
      returnText = returnText.replace(/​+/g, '');
      returnText = typograf.execute(returnText);
      arr[index] = returnText;
    });
  });

  content.conclusion.text.forEach((item: string, index: number, arr: string[]) => {
    let returnText = item;
    returnText = hypher.hyphenateText(returnText, 5);
    returnText = returnText.replace(/​+/g, '');
    returnText = typograf.execute(returnText);
    arr[index] = returnText;
  });

  return content;
}
