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
      .then(({ body: { topics } }) => {
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
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
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
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test(`checks the count of comments for articles with & without comments posted`, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
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
        expect(article.article[0].article_id).toBe(4);
      });
  });

  test(`responds with a specific article object with the following properties
        author, title, article_id, body, topic, created_at, votes, comment_count`, () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article[0]).toBeObject();
        expect(article.article[0].author).toEqual(expect.any(String));
        expect(article.article[0].title).toEqual(expect.any(String));
        expect(article.article[0].article_id).toBe(9);
        expect(article.article[0].body).toEqual(expect.any(String));
        expect(article.article[0].topic).toEqual(expect.any(String));
        expect(article.article[0].created_at).toEqual(expect.any(String));
        expect(article.article[0].votes).toEqual(expect.any(Number));
        expect(article.article[0].comment_count).toEqual(expect.any(String));
      });
  });
  test("checks the comment count is correct for the given article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article[0].comment_count).toBe("11");
      });
  });
  test("checks the comment count is zero for the article_id's with no associated comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article[0].comment_count).toBe("0");
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
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
      });
  });
  test("returns an array of comments in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: comments }) => {
        expect(comments.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test(`responds with an array of the comments for the given article_id with the following properties:
      comment_id, votes, created_at, author, body`, () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: comments }) => {
        expect(comments.length).not.toBe(0);
        comments.comments.forEach((item) => {
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
  });
  test("tests for a user provided article_id number that is higher than the highest article_id in the database", () => {
    return request(app)
      .get("/api/articles/9807542/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 - Not found");
      });
  });
});

describe("POST - /api/articles/:article_id/comments (server responds with a 201 & posted comment) - happy path ", () => {
  test("responds with the posted comment, an object with username & body key / values", () => {
    const commentObj = {
      username: "lurker",
      body: "might be the best api i have ever seen in my life",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentObj)
      .expect(201)
      .then(({ body: comment }) => {
        expect(comment.postedComment[0].author).toBe("lurker");
        expect(comment.postedComment[0].body).toBe(
          "might be the best api i have ever seen in my life"
        );
      });
  });
  test("responds with a single comment response only", () => {
    const commentObj = {
      username: "lurker",
      body: "this is a comment somehow",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(commentObj)
      .expect(201)
      .expect(({ body: comment }) => {
        expect(comment.postedComment.length).toBe(1);
      });
  });
  test("discounts extra data provided for comment insertion", () => {
    const commentObj = {
      crisps: "yummy",
      username: "lurker",
      body: "this is a comment somehow",
      birds: "are lovley",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(commentObj)
      .expect(201)
      .expect(({ body: comment }) => {
        expect(Object.keys(comment.postedComment[0])).toEqual([
          "author",
          "body",
        ]);
      });
  });

  describe("POST - /api/articles/:article_id/comments - sad path", () => {
    test("tests for an article_id that is not a valid number", () => {
      const commentObj = {
        username: "lurker",
        body: "you have sad eyes mr, seen some sad paths",
      };
      return request(app)
        .post("/api/articles/38skfbfda42/comments")
        .send(commentObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for an article_id that does not exist - generates an SQL foreign key violation", () => {
      const commentObj = {
        username: "lurker",
        body: "you have sad eyes mr, seen some sad paths",
      };
      return request(app)
        .post("/api/articles/256425745/comments")
        .send(commentObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for incorrect data types provided for comment entry", () => {
      const commentObj = {
        username: 876543456,
        body: 98765,
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(commentObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for not enough data provided for comment entry", () => {
      const commentObj = {
        username: "lurker",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(commentObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for a user that does not exist in the database", () => {
      const commentObj = {
        username: "saddo",
        body: "you have sad eyes mr, seen some sad paths",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(commentObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
  });
});

describe("PATCH - /api/articles/:article_id - updates the linked article votes & returns said article - happy path", () => {
  test("checks the patch request returns all article elements", () => {
    const voteObj = {
      inv_votes: 6,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(voteObj)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0]).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("patch request returns a single article only", () => {
    const voteObj = {
      inv_votes: 6,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(voteObj)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.length).toBe(1);
      });
  });
  test("checks patch request has updated the vote with a postive number", () => {
    const voteObj = {
      inv_votes: 15,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(voteObj)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0].votes).toBe(15);
      });
  });
  test("checks patch request has updated the vote with a negative number", () => {
    const voteObj = {
      inv_votes: -8,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(voteObj)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article[0].votes).toBe(-8);
      });
  });

  describe("PATCH - /api/articles/:article_id - sad path", () => {
    test("tests for an article_id that is not a valid number", () => {
      const voteObj = {
        inv_votes: 8,
      };
      return request(app)
        .patch("/api/articles/14fef699gref")
        .send(voteObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for an article_id that does not exist", () => {
      const voteObj = {
        inv_votes: 8,
      };
      return request(app)
        .patch("/api/articles/2569564")
        .send(voteObj)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 - Not found");
        });
    });
    test("tests for incorrect data types provided for vote entry", () => {
      const voteObj = {
        inv_votes: "howdy, partner",
      };
      return request(app)
        .patch("/api/articles/2")
        .send(voteObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
    test("tests for not enough data provided for vote entry", () => {
      const voteObj = {};
      return request(app)
        .patch("/api/articles/2")
        .send(voteObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
  });
});

describe("GET - /api/users - returns an array of objects containing user data - Happy path", () => {
  test("responds with username, name & avatar_url for all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("returns all users from the database by username in ascending order", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        expect(users).toBeSortedBy("username", { ascending: true });
      });
  });
});

describe("GET - /api/articles(queries) - testing topic queries - Happy path", () => {
  test("checks all values are present & responds with all topics when no query is given", () => {
    return request(app)
      .get("/api/articles?topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
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

  test("checks the returned articles are filtered by the specified query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toEqual("mitch");
        });
      });
  });
  test("checks only the queried topic is returned", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
      });
  });

  describe("GET - /api/articles(queries) - testing topic queries - sad path", () => {
    test("checks an invalid topic article", () => {
      return request(app)
        .get("/api/articles?topic=banana492crisps")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 - Not found");
        });
    });
  });
  test("checks a topic slug that is not linked to any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 - Not found");
      });
  });
});

describe("GET - /api/articles(queries) - testing sort_by queries - Happy path", () => {
  test("returns the articles sorted by date descending by default when no query is given", () => {
    return request(app)
      .get("/api/articles?sort_by")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
test("when queried- sorts articles by votes, descending by default", () => {
  return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toBeSortedBy("votes", { descending: true });
    });
});
test("when queried- sorts articles by article_id, ascending", () => {
  return request(app)
    .get("/api/articles?sort_by=article_id&order_by=asc")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toBeSortedBy("article_id", { ascending: true });
    });
});
describe("GET - /api/articles(queries) - testing sort_by queries - Sad path", () => {
  test("checks for an invalid sort_by column query - no column found", () => {
    return request(app)
      .get("/api/articles?sort_by=ef5151424d")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("404 - Not found");
      });
  });
  test("checks for an invalid sort_by column query - sql syntax error", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=dcsx")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("400 - Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id - Happy path", () => {
  test("returns a 204 - No Content response upon comment deletion", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((status) => {
        expect(status.noContent).toBe(true);
      });
  });
  describe("DELETE /api/comments/:comment_id - Sad path", () => {
    test("returns a 404 - Not Found response when comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/267")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 - Not found");
        });
    });
    test("returns a 400 - Bad request when comment_id is not a number", () => {
      return request(app)
        .delete("/api/comments/5gbs5242")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 - Bad request");
        });
    });
  });
});

describe("GET - /api endpoint - Happy path", () => {
  test("checks endpoint listings only output four entries for get, post, patch & delete", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({ body: { endpoints } }) => {
      expect(Object.keys(endpoints).length).toBe(4)
    })
  })
  test("lists the available endpoints", () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({ body: { endpoints } }) => {
      expect(endpoints.GET).toBeArray()    
      expect(endpoints.POST).toBeArray()
      expect(endpoints.PATCH).toBeArray()
      expect(endpoints.DELETE).toBeArray()
    })
  })
})

describe("GET /api/users/:username - Happy path", () => {
  test("returns the specific username, name & avatar URL of the queried username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.rows[0].username).toBe("lurker");
        expect(user.rows[0].name).toBe("do_nothing");
        expect(user.rows[0].avatar_url).toBe(
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
        );
      });
  });
  test("returns only username, name & avatar_url of the chosen query", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(Object.keys(user.rows[0])).toEqual([
          "username",
          "name",
          "avatar_url",
        ]);
      });
  });
  test("returns only one username instance", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.rows.length).toEqual(1);
      });
  });
});
