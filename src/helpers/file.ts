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
    type: 'name'
  }
});

const hypher = new Hypher(hyphenation);

export function parseArticleFileData(fileContent: string) {

  const content = jsYaml.load(fileContent);

  content.intro.text.forEach((item: string) => {
    typograf.execute(item);
    hypher.hyphenateText(item, 5);
  });

  content.body.forEach((bodyItem: any) => {
    bodyItem.text.forEach((item: string) => {
      typograf.execute(item);
      hypher.hyphenateText(item, 5);
    });
  });

  content.conclusion.text.forEach((item: string) => {
    typograf.execute(item);
    hypher.hyphenateText(item, 5);
  });

  return content;
}
