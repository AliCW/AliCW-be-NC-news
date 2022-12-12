const index = require("../db/data/test-data/index.js");

describe("testing functionality of index.js exportation of articleData", () => {
  test("articleData exportation lists an array of article data objects", () => {
    expect(index.articleData).toBeInstanceOf(Array);
    expect(index.articleData).toHaveLength(12);
  });
  test("articleData exportation responds with the all article object keys", () => {
    const randomIndex = Math.floor(Math.random() * 12);
    expect(index.articleData[randomIndex]).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(Number),
        votes: expect.any(Number),
      })
    );
  });
});

describe("testing functionality of index.js exportation of commentData", () => {
  test("commentData exportation lists an array of comment data objects", () => {
    expect(index.commentData).toBeInstanceOf(Array);
    expect(index.commentData).toHaveLength(18);
  });
  test("commentData exportation responds with all comment object keys", () => {
    const randomIndex = Math.floor(Math.random() * 18);
    expect(index.commentData[randomIndex]).toEqual(
      expect.objectContaining({
        body: expect.any(String),
        votes: expect.any(Number),
        author: expect.any(String),
        article_id: expect.any(Number),
        created_at: expect.any(Number),
      })
    );
  });
});

describe("testing functionality of index.js exportation of topicData", () => {
    test("topicData exportation lists an array of topic data objects", () => {
      expect(index.topicData).toBeInstanceOf(Array);
      expect(index.topicData).toHaveLength(3);
    });
    test("topicData exportation responds with all topic object keys", () => {
      const randomIndex = Math.floor(Math.random() * 3);
      expect(index.topicData[randomIndex]).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          slug: expect.any(String)
        })
      );
    });
  });


  describe("testing functionality of index.js exportation of userData", () => {
    test("userData exportation lists an array of user data objects", () => {
      expect(index.userData).toBeInstanceOf(Array);
      expect(index.userData).toHaveLength(4);
    });
    test("userData exportation responds with all topic object keys", () => {
      const randomIndex = Math.floor(Math.random() * 3);
      expect(index.userData[randomIndex]).toEqual(
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      );
    });
  });