const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());

beforeEach(() => seed(testData));

describe("/aip - bad path test", () => {
  test("404: route does not exist", () => {
    return request(app)
      .get("/aip")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 - path / route is not valid");
      });
  });
});

describe("/api/topics", () => {
  test("check data type validity of topic data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: topics }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles", () => {
  test(`returns an article array with all specifiedproperties from articles table & comments_count property
    (author, title, article_id, topic, created_at, votes, comment_count) `, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: {articles} }) => {
        expect(articles).toHaveLength(12)
        articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comments_count: expect.any(String),
          });
        });
      });
  });
  test(`checks article array descending order & containing all articles with or without comments`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: {articles} }) => {
        expect(articles).toBeSorted()
      });
  });
  test(`checks the count of comments for articles with & without comments posted`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: {articles} }) => {
        expect(articles[0].comments_count).toBe("2");
        expect(articles[5].comments_count).toBe("11");
        expect(articles[2].comments_count).toBe("0");
      });
  });
});
