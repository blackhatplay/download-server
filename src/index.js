const { default: axios } = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
var cors = require("cors");

const { post } = require("./getLink");

const url = "https://getintopc.com/wait-for-resource-5/";
const gameDownloadUrl =
  "http://tutorials-forum.info/fast-hosting-file-max-speed-ofg/";
const urlHeader = "https://httpbin.org/anything";
const softwareUrl = "https://getintopc.com/";
const gameUrl = "http://oceanofgames.com/";

const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

(async () => {
  const browser = await puppeteer.launch();

  app.use("/download/", async (req, res) => {
    const page = await browser.newPage();

    await page.goto(req.body.url);

    const content = await page.content();

    const $ = cheerio.load(content);

    const formInputs = [];

    $("form", ".post-content").each(function () {
      const form = $(this).html();
      const link = {};

      $("input", form).each(function () {
        link[$(this).attr("name")] = $(this).attr("value");
      });

      formInputs.push(link);
    });

    page.on("request", (request) => {
      if (request.url().search(formInputs[0].filename) > 0) {
        res.json({ url: request.url(), ...formInputs[0] });
        page.close();
      }
    });

    if (req.body.url.search(gameUrl) > -1) {
      await post(page, gameDownloadUrl, formInputs[0]);
    } else if (req.body.url.search(softwareUrl) > -1) {
      await post(page, url, formInputs[0]);
    }
  });

  app.use("/posts/:type", async (req, res) => {
    const page = await browser.newPage();
    if (req.params.type === "game") {
      await page.goto(`${gameUrl}?s=${req.query.s}`);
    } else if (req.params.type === "software") {
      await page.goto(`${softwareUrl}?s=${req.query.s}`);
    }

    const content = await page.content();

    page.close();

    const $ = cheerio.load(content);

    const posts = [];

    $(".post-thumb", ".posts").each(function () {
      const pp = $(this).html();

      const post = {
        href: $(this).attr("href"),
        title: $(this).attr("title"),
      };

      posts.push(post);
    });

    res.json(posts);
  });

  app.listen(5000, () => console.log("Server is running on port 5000"));
})();
