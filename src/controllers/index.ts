import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';

import { parseArticleFileData } from '../helpers/file';

import { Article } from 'Article';

/* GET home page. */
router.get('/', function (req, res, next) {

  const todayDate = moment();
  const pathToFile = `./pages-yaml/${todayDate.format('MM')}/${todayDate.format('DD')}.yml`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    const fileData = parseArticleFileData(data);

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

    const fileData = parseArticleFileData(data);

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

export default router;
