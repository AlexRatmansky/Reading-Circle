import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';
import * as jsYaml from 'js-yaml';
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

/* GET home page. */
router.get('/', function (req, res, next) {

  const todayDate = moment();
  const pathToFile = `./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.md`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    const fileData = parseFileData(data);

    const renderParams = {
      title: fileData.title || 'Empty title',
      date: {
        before: moment(`2000-${fileData.month}-${fileData.day}`).subtract(1, 'day').format('MM-DD'),
        current: moment(`2000-${fileData.month}-${fileData.day}`).format('D MMMM'),
        after: moment(`2000-${fileData.month}-${fileData.day}`).add(1, 'day').format('MM-DD')
      },
      intro: fileData.intro,
      body: fileData.body,
      conclusion: fileData.conclusion,
    };

    res.render('index', renderParams);
  });
});

/* GET Date page. */
router.get('/:monthId-:dayId', function (req, res, next) {

  const pathToFile = `./pages-yaml/${req.params.monthId}/${req.params.dayId}.yml`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    if (err) {
      console.log(err);
      res.render('error');
    }

    const fileData = parseFileData(data);

    const renderParams = {
      title: fileData.title || 'Empty title',
      date: {
        before: moment(`2000-${fileData.month}-${fileData.day}`).subtract(1, 'day').format('MM-DD'),
        current: moment(`2000-${fileData.month}-${fileData.day}`).format('D MMMM'),
        after: moment(`2000-${fileData.month}-${fileData.day}`).add(1, 'day').format('MM-DD')
      },
      intro: fileData.intro,
      body: fileData.body,
      conclusion: fileData.conclusion,
    };

    res.render('detail', renderParams);
  });
});

function parseFileData(fileContent: string) {

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

router.get('/writeFiles', function (req, res, next) {

  const startDate = moment([2000, 0, 1]);
  const endDate = moment([2000, 11, 31]);
  const currentDate = startDate;

  if (!fs.existsSync(`./pages-yaml`)) {
    fs.mkdirSync(`./pages-yaml/`);
  }

  while (currentDate.isSameOrBefore(endDate)) {

    const fileMonth = currentDate.format('MM');
    const fileDay = currentDate.format('DD');

    const filePath = `${fileMonth}/${fileDay}`;

    const fileText = `
title: '...'
month: ${fileMonth}
day: ${fileDay}

intro:
  text:
    - "..."
  author:

body:
  - index: 1
    text:
      - "..."
    author:

  - index: 2
    text:
      - "..."
    author:

conclusion:
  text:
    - "..."
  author:

`;

    if (!fs.existsSync(`./pages-yaml/${fileMonth}`)) {
      fs.mkdirSync(`./pages-yaml/${fileMonth}`);
    }

    fs.writeFile(`./pages-yaml/${filePath}.yml`, fileText, (err) => {
      if (err) throw err;
      console.log(`page ${filePath}.md saved`);
    });

    currentDate.add(1, 'day');
  }

  res.render('writeFiles');
});

export default router;
