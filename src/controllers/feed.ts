import * as express from 'express';
const router = express.Router();

import { promisify } from 'util';
import * as fs from 'fs';
import * as moment from 'moment';

import { parseArticleFileData } from '../helpers/file';
import { RSSParams } from 'Article';

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

  const completeParams: RSSParams = {
    articles: [],
    lastBuildDate: todayDate.locale('en').format('ddd, DD MMM YYYY HH:mm:ss ZZ')
  };

  let chain = Promise.resolve();

  for (let i = 5; i > 0; i--) {
    chain = chain
      .then(() => readFileAsync(`./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.yml`))
      .then((data) => {
        completeParams.articles.push(formArticleData(data));
        todayDate.subtract(1, 'day');
      });
  }

  chain
    .then(() => {
      res.set('Content-Type', 'text/xml');
      res.render('feed/rss', completeParams);
    });

  function formArticleData(data: any) {
    const fileData = parseArticleFileData(data);
    return {
      title: fileData.title || 'Empty title',
      date: todayDate.locale('en').format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      slug: `${todayDate.format('MM')}-${todayDate.format('DD')}`,
      intro: fileData.intro,
      body: fileData.body,
      conclusion: fileData.conclusion,
    };
  }
});

export default router;