import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';

import { parseArticleFileData } from '../helpers/file';

/* GET users listing. */
router.get('/rss', function (req, res) {

  const todayDate = moment();
  const pathToFile = `./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.yml`;

  fs.readFile(pathToFile, 'utf8', function (err, data) {

    const fileData = parseArticleFileData(data);

    const renderParams = {
      title: fileData.title || 'Empty title',
      date: todayDate.toDate().toISOString(),
      slug: `${todayDate.format('MM')}-${todayDate.format('DD')}`,
      intro: fileData.intro,
      body: fileData.body,
      conclusion: fileData.conclusion,
    };

    res.set('Content-Type', 'text/xml');
    res.render('feed/rss', renderParams);
  });
});

export default router;