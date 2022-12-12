const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app")

const db = require("../db/connection");
const seed = require("../db/seeds/seed")

afterAll(() => db.end());

beforeEach(() => seed(testData))

describe("/aip - bad path test", () => {
  test("404: route does not exist", () => {
    return request(app)
    .get("/aip")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("404 - path / route is not valid")
    });
  });
});

describe("/api/topics", () => {
    test("check data type validity of topic data", () => {
      return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body: topics}) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String)
            })
          )
        })

      })
    })
  })