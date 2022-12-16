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

const findCommentsByArticleId = (params) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, 
     comments.author, comments.body
     FROM comments
     WHERE article_id = $1
     ORDER BY comments.created_at DESC
     `,
      [params]
    )
    .then(( { rows } ) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        });
      }
      return rows;
    });
};

const postCommentById = (username, body, article_id) => {
  return db.query(
    `INSERT INTO comments
    (author, body, article_id)
    VALUES 
    ($1, $2, $3)
    RETURNING author, body;
  `, [username, body, article_id]
  )
  .then(({rows: comment}) => {
    if (comment.length === 0) {
      return Promise.reject({
        msg: "404 - Not found",
      });
    }
    return comment
  })
}

module.exports = { 
    findAllTopics, 
    findArticles,
    findArticleById,
    findCommentsByArticleId,
    postCommentById,
    

};
