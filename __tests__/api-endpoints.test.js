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
        expect(msg).toBe("404 - Not found");
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
        expect(articles).toBeSortedBy("created_at", {descending: true})
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


describe("/api/articles/:article_id", () => {
  test("responds with a single article object only", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article.length).toBe(1);
      });
  });
  test("checks the returned article_id matches the input query", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article[0].article_id).toBe(4)
      })
  })

  test("responds with a specific article object with the following properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article[0]).toBeObject();
        expect(article.article[0].author).toEqual(expect.any(String))
        expect(article.article[0].title).toEqual(expect.any(String))
        expect(article.article[0].article_id).toBe(1)
        expect(article.article[0].body).toEqual(expect.any(String))
        expect(article.article[0].topic).toEqual(expect.any(String))
        expect(article.article[0].created_at).toEqual(expect.any(String))
        expect(article.article[0].votes).toEqual(expect.any(Number))
      });
  });
});

describe("/api/articles/:article_id - Sad path", () => {
  test("tests for an article_id that is not a valid number", () => {
    return request(app)
      .get("/api/articles/12vb4")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("400 - Bad request");
      });
  });
  test("tests for a user provided article_id number that is higher than the highest article_id in the database", () => {
    return request(app)
      .get("/api/articles/2356432")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 - Not found");
      });
  });
});

describe("/api/articles/:article_id/comments - happy path", () => {
  test(`responds with the correct number of associated comments for the given article_id`, () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: comment }) => {
        expect(comment.comments.length).toBe(11);
      });
  });
  test("returns an empty array if no comments match the article_id", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(( {body: comment}) => {
      expect(comment.comments).toBeArray()
      expect(comment.comments.length).toBe(0)
    })
  })
  test(`responds with an array of the comments for the given article_id with the following properties:
      comment_id, votes, created_at, author, body`, () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: comment }) => {
        comment.comments.forEach((item) => {
          expect(item).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id/comments - sad path", () => {
  test("tests for an article_id that is not a valid number", () => {
    return request(app)
    .get("/api/articles/34kxa42/comments")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("400 - Bad request");
    });
  })
  test("tests for a user provided article_id number that is higher than the highest article_id in the database", () => {
    return request(app)
    .get("/api/articles/9807542/comments")
    .expect(404)
    .then(({ body: { msg }}) => {
      expect(msg).toBe("404 - Not found")
    })
  })
});


