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

/* GET home page. */
router.get('/', function (req, res, next) {

  const todayDate = moment();
  const pathToFile = `./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.md`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    const fileData = parseFileData(data);
    const renderParams = {
      title: fileData.attributes.title || 'Empty title',
      date: {
        before: moment(fileData.attributes.date).subtract(1, 'day').format('MM-DD'),
        current: moment(fileData.attributes.date).format('MM-DD'),
        today: moment().format('MM-DD'),
        after: moment(fileData.attributes.date).add(1, 'day').format('MM-DD')
      },
      body: fileData.text
    };

    res.render('index', renderParams);
  });
});

/* GET Date page. */
router.get('/:monthId-:dayId', function (req, res, next) {

  const pathToFile = `./pages/${req.params.monthId}/${req.params.dayId}.md`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    if (err) {
      console.log(err);
      res.render('error');
    }

    const fileData = parseFileData(data);
    const renderParams = {
      title: fileData.attributes.title || 'Empty title',
      date: {
        before: moment(fileData.attributes.date).subtract(1, 'day').format('MM-DD'),
        current: moment(fileData.attributes.date).format('D MMMM'),
        after: moment(fileData.attributes.date).add(1, 'day').format('MM-DD')
      },
      body: fileData.text
    };

    res.render('detail', renderParams);
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
