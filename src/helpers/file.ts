import * as jsYaml from 'js-yaml';
import * as MarkdownIt from 'markdown-it';

const Typograf = require('typograf');
const Hypher = require('hypher');
const hyphenation = require('hyphenation.ru');

import { Article } from 'Article';

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-decorate'))
  .use(require('markdown-it-footnote'));

const typograf = new Typograf({
  locale: 'ru',
  htmlEntity: {
    type: 'digits'
  }
});

const hypher = new Hypher(hyphenation);

export function parseArticleFileData(fileContent: string) {

  const content = jsYaml.load(fileContent);

  content.intro.text.forEach((item: string, index: number, arr: any) => {
    let returnText = item;
    returnText = hypher.hyphenateText(returnText, 5);
    returnText = returnText.replace(/​+/g, '');
    returnText = typograf.execute(returnText);
    arr[index] = returnText;
  });

  content.body.forEach((bodyItem: any) => {
    bodyItem.text.forEach((item: string, index: number, arr: any) => {
      let returnText = item;
      returnText = hypher.hyphenateText(returnText, 5);
      returnText = returnText.replace(/​+/g, '');
      returnText = typograf.execute(returnText);
      arr[index] = returnText;
    });
  });

  content.conclusion.text.forEach((item: string, index: number, arr: any) => {
    let returnText = item;
    returnText = hypher.hyphenateText(returnText, 5);
    returnText = returnText.replace(/​+/g, '');
    returnText = typograf.execute(returnText);
    arr[index] = returnText;
  });

  return content;
}
