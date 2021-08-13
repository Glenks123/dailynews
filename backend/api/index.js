const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = 5000 || process.env.PORT;

app.get('/', async (req, res) => {
  try {
    const base = 'https://www.bbc.com/news';
    const mainHtml = await request(base);
    const $ = cheerio.load(mainHtml);

    const newsHeadlines = new Array();
    $('.gs-c-promo-heading').each((index, element) => {
      const $heading = $(element).text();
      let $link = $(element).attr('href');
      if (
        $link.split(':')[0] !== 'https' &&
        $link.split(':')[0].split('/')[1] === 'news'
      ) {
        $link = `https://www.bbc.com${$link}`;
      } else {
        return false;
      }
      newsHeadlines.push({
        headline: $heading,
        link: $link,
      });
    });

    const createUniqueArray = (arr) => {
      return [...new Map(arr.map((item) => [item['headline'], item])).values()];
    };

    const uniqueArray = createUniqueArray(newsHeadlines);

    const addShortText = async (link, i) => {
      const mainHtml = await request(link);
      const $ = cheerio.load(mainHtml);

      $('.ssrcss-hmf8ql-BoldText').each((index, element) => {
        uniqueArray[i]['shortText'] = $(element).text();
      });

      // $('.ssrcss-1drmwog-Image').each((index, element) => {
      //   uniqueArray[i]['imageUrl'] = $(element).attr('src');
      // });

      if (
        typeof uniqueArray[i]['shortText'] === 'string' &&
        uniqueArray[i]['shortText'].split(' ').length > 4
      ) {
        return uniqueArray[i];
      }
    };

    const articles = new Array();
    for (let i = 0; i < uniqueArray.length; i++) {
      articles.push(addShortText(uniqueArray[i].link, i));
    }

    const newsArticle = new Array();
    const promise = await Promise.all([...articles]);

    for (let i = 0; i < promise.length; i++) {
      if (promise[i] !== undefined) {
        newsArticle.push(promise[i]);
      }
    }

    return res.json({ success: true, newsArticle });
  } catch (err) {
    return res.json(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
