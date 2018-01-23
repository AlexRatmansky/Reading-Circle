import * as express from 'express';
const router = express.Router();

import * as fs from 'fs';
import * as moment from 'moment';
import * as frontMatter from 'front-matter';
import * as typograf from 'typograf';
import * as MarkdownIt from 'markdown-it';

import { Article } from 'Article';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-footnote'));

const tp = new typograf({
  locale: 'ru',
  htmlEntity: {
    type: 'name'
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {

  const todayDate = moment();
  fs.readFile(`./pages/${todayDate.format('MM')}/${todayDate.format('DD')}.md`, 'utf8', function (err, data) {

    const content = frontMatter(data);
    const contentAttributes: Article = content.attributes as Article;
    let result = tp.execute(content.body);

    result = md.render(result);

    res.render('index', {
      title: contentAttributes.title || 'Empty title',
      date: {
        before: moment(contentAttributes.date).subtract(1, 'day').format('MM-DD'),
        current: moment(contentAttributes.date).format('MM-DD'),
        today: moment().format('MM-DD'),
        after: moment(contentAttributes.date).add(1, 'day').format('MM-DD')
      },
      body: result
    });
  });
});

/* GET Date page. */
router.get('/:monthId-:dayId', function (req, res, next) {

  fs.readFile(`./pages/${req.params.monthId}/${req.params.dayId}.md`, 'utf8', function (err, data) {

    if (err) {
      console.log(err);
      res.render('error');
    }

    const content = frontMatter(data);
    const contentAttributes: Article = content.attributes as Article;
    let result = tp.execute(content.body);

    result = md.render(result);

    res.render('detail', {
      title: contentAttributes.title || 'Empty title',
      date: {
        before: moment(contentAttributes.date).subtract(1, 'day').format('MM-DD'),
        current: moment(contentAttributes.date).format('MM-DD'),
        after: moment(contentAttributes.date).add(1, 'day').format('MM-DD')
      },
      body: result
    });
  });
});

// router.get('/writeFiles', function (req, res, next) {

//   let startDate = moment([2000, 00, 06]);
//   let endDate = moment([2000, 11, 31]);
//   let currentDate = startDate;

//   while (currentDate.isSameOrBefore(endDate)) {

//     let fileYear = currentDate.format('YYYY');
//     let fileMonth = currentDate.format('MM');
//     let fileDay = currentDate.format('DD');

//     let fielPath = `${fileMonth}/${fileDay}`;

//     let fileText = `---
// title: '${fileYear}-${fileMonth}-${fileDay}'
// date: '${fileYear}-${fileMonth}-${fileDay}'
// path: '${fielPath}'
// ---

// # ${fileYear}-${fileMonth}-${fileDay}
// `;

//     if (!fs.existsSync(`./pages/${fileMonth}`)) {
//       fs.mkdirSync(`./pages/${fileMonth}`);
//     }

//     fs.writeFile(`./pages/${fielPath}.md`, fileText, (err) => {
//       if (err) throw err;
//       console.log(`page ${fielPath}.md saved`)
//     })

//     currentDate.add(1, 'day');
//   }

//   res.render('writeFiles');
// });

export default router;
