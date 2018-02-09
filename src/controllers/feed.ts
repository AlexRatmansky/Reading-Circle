import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';
import * as grayMatter from 'gray-matter';
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

/* GET users listing. */
router.get('/rss', function (req, res, next) {

  const todayDate = moment();
  const pathToFile = `./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.md`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    const fileData = parseFileData(data);
    const renderParams = {
      title: fileData.attributes.title || 'Empty title',
      date: todayDate.toDate().toISOString(),
      slug: `${todayDate.format('MM')}-${todayDate.format('DD')}`,
      body: fileData.text
    };

    res.set('Content-Type', 'text/xml');
    res.render('rss', renderParams);
  });
});

function parseFileData(fileContent: string) {

  const content = grayMatter(fileContent);

  let result = typograf.execute(content.content);
  result = hypher.hyphenateText(result, 5);
  result = markdownIt.render(result);

  return {
    attributes: content.data as Article,
    text: result
  };
}

export default router;