import express from 'express';
const app = express();

import cors from 'cors'
import fetch from 'node-fetch'
app.use(express.json());
app.use(cors())

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const cheerio = require('cheerio');

let regions = ["denver", "chicago", "phoenix"]


app.get('/', (req, res) => {
  res.json('Server Running!')
});

// Getting All Objects
app.get('/api/v1/craigslist/:car', async (req, res) => {
  try {
    let car = req.params.car
    console.log('car', car);

    



    let city = "denver"
    const url = `https://${city}.craigslist.org/search/cta?query=e46+m3`
    let allListings = await retrieveListing(url)
    console.log('allListings', allListings);
    return res.status(201).json(allListings);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// const retrieveListing = async (url) => {
//   var result = await nightmare
//     //load a url
//     .goto(url)
//     .wait('body')
//     .evaluate(() => document.querySelector('.rows').innerHTML)
//     .then(console.log("response", response))
//
//     await nightmare.end();
// }


const retrieveListing = async (url) => {
  let listings = [];
  try {
    await nightmare
    .goto(url)
    .wait('body')
    .evaluate(() => document.querySelector('.rows').innerHTML)
    .then(response => {
      console.log("response");
      listings = getSinglePage(response);
      // console.log('listings', listings);
    })
  }
  catch (error) {
    // console.log(error.message);
  }
  finally {
    await nightmare.end()
    return listings
  }
}


let getSinglePage = (html) => {
  console.log('in single page');
  let listingArray = []
  const $ = cheerio.load(html);
  $('.result-row').each((row, resultRow) => {
    let link = $(resultRow).find('.result-image').attr('href');
    let title = $(resultRow).find('.result-title').text();
    let price = $(resultRow).find('.result-image .result-price').text();
    let date = $(resultRow).find('.result-date').text();
    let image = $(resultRow).find('.result-image img').attr('src');
    if(link){
      listingArray.push({
        title,
        link,
        price,
        date,
        image
      })
    }
  });
  return listingArray
}

//
// const retrieveListing = (url) => {
//   nightmare
//     .goto(url)
//     .wait('body')
//     .evaluate(() => document.querySelector('.rows').innerHTML)
//     .end()
//     .then(response => {
//       getSinglePage(response);
//     }).catch(err => {
//       console.log(err);
//     });
//
//
// }


export default app;
