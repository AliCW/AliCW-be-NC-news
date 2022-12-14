const db = require("../db/connection");

const findAllTopics = () => {
  return db
    .query(
      `
    SELECT * FROM topics;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const findArticles = () => {
  return db
    .query(
      `
    SELECT 
    articles.author, articles.title, articles.article_id, 
    articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comments_count
    FROM articles
    FULL OUTER JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.title, articles.article_id, 
    articles.topic, articles.created_at, articles.votes
    ORDER BY articles.created_at DESC
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

const findArticleById = (params) => {
  return db
    .query(
      `
    SELECT articles.author, articles.title, articles.article_id,
    articles.body, articles.topic, articles.created_at, articles.votes
    FROM articles
    WHERE article_id = $1`,
      [params]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        });
      }
      return rows;
    });
};

module.exports = { 
    findAllTopics, 
    findArticles,
    findArticleById,
};
