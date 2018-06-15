import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';

router.get('/writeFiles', function (req, res) {

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