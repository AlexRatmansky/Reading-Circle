import * as express from 'express';
const router = express.Router();

import { promisify } from 'util';
import * as fs from 'fs';
import * as moment from 'moment';

import { parseArticleFileData } from '../helpers/file';
import { RssItem } from 'Article';

const readFileAsync = promisify(fs.readFile);

/* GET users listing. */
router.get('/rss', function (req, res) {

  const todayDate = moment();

  todayDate.set({
    'hour': 0,
    'minute': 0,
    'second': 0,
    'millisecond': 0
  });

  const completeParams: { articles: RssItem[] } = { articles: [] };

  const pathToFile = `./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.yml`;

  readFileAsync(pathToFile, { encoding: 'utf8' })
    .then((text) => {
      completeParams.articles.push(formArticleData(text));
      return readFileAsync(`./pages/${todayDate.subtract(1, 'day').format('MM')}/${todayDate.format('DD')}.yml`, { encoding: 'utf8' });
    })
    .then((text) => {
      completeParams.articles.push(formArticleData(text));
      return readFileAsync(`./pages/${todayDate.subtract(1, 'day').format('MM')}/${todayDate.format('DD')}.yml`, { encoding: 'utf8' });
    })
    .then((text) => {
      completeParams.articles.push(formArticleData(text));
      return readFileAsync(`./pages/${todayDate.subtract(1, 'day').format('MM')}/${todayDate.format('DD')}.yml`, { encoding: 'utf8' });
    })
    .then((text) => {
      completeParams.articles.push(formArticleData(text));
      return readFileAsync(`./pages/${todayDate.subtract(1, 'day').format('MM')}/${todayDate.format('DD')}.yml`, { encoding: 'utf8' });
    })
    .then((text) => {
      completeParams.articles.push(formArticleData(text));
      return readFileAsync(`./pages/${todayDate.subtract(1, 'day').format('MM')}/${todayDate.format('DD')}.yml`, { encoding: 'utf8' });
    })
    .then(() => {
      res.set('Content-Type', 'text/xml');
      res.render('feed/rss', completeParams);
    })
    .catch((err) => {
      console.log('ERROR:', err);
    });

  function formArticleData(data: any) {

    const fileData = parseArticleFileData(data);

    return {
      title: fileData.title || 'Empty title',
      date: todayDate.toDate().toISOString(),
      slug: `${todayDate.format('MM')}-${todayDate.format('DD')}`,
      intro: fileData.intro,
      body: fileData.body,
      conclusion: fileData.conclusion,
    };
  }
});

export default router;