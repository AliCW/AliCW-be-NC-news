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

const findArticlesByWhereQuery = (query) => { 

  const queryStringStart = `
  SELECT 
  articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comments_count
  FROM articles
  FULL OUTER JOIN comments ON articles.article_id = comments.article_id`;
  
  let orderClause = ` ORDER BY created_at DESC`
  let whereClause = ``
  
  if (Object.keys(query)[0] === 'topic') {
    whereClause = `
    WHERE topic = $1`;
  } 

  const queryStringEnd = `
  GROUP BY articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes`

  const queryValue = Object.values(query)
  return db
  .query(queryStringStart + whereClause + queryStringEnd + orderClause, queryValue
    ).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        })
      }
      return rows;
    })

}

const findArticlesByOrderBy = (query) => {
  const queryStringStart = `
  SELECT 
  articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comments_count
  FROM articles
  FULL OUTER JOIN comments ON articles.article_id = comments.article_id`;

  let orderClause = ``

  if (Object.keys(query)[0] === "sort_by") {
    orderClause = `
      ORDER BY ${query.sort_by} DESC;`;
  }

  if (
    Object.keys(query)[0] === "sort_by" &&
    Object.keys(query)[1] === "order_by"
  ) {
    orderClause = `
      ORDER BY ${query.sort_by} ${query.order_by};`;
  }

  const queryStringEnd = `
  GROUP BY articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes`
  return db
  .query(queryStringStart + queryStringEnd + orderClause
    ).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        })
      }
      return rows;
    })

}

const findArticleById = (params) => {
  return db
    .query(
      `
      SELECT 
      articles.author, articles.title, articles.article_id, articles.body,
      articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count
      FROM articles
      FULL OUTER JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.author, articles.title, articles.article_id, 
      articles.topic, articles.created_at, articles.votes`,
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
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        });
      }
      return rows;
    });
};

const postCommentById = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments
    (author, body, article_id)
    VALUES 
    ($1, $2, $3)
    RETURNING author, body, comment_id;
  `,
      [username, body, article_id]
    )
    .then(({ rows: comment }) => {
      if (comment.length === 0) {
        return Promise.reject({
          msg: "404 - Not found",
        });
      }
      return comment;
    });
};

const assignVotes = (body, params) => {
  return db.query(
    `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`, [body, params]
  )
  .then(( {rows: article}) => {
    if (article.length === 0) {
      return Promise.reject({
        msg: "404 - Not found"
      })
    }
    return article
  })
}

const findUsers = () => {
  return db.query(  
    `SELECT users.username, users.name, users.avatar_url
     FROM users
     ORDER BY users.username ASC;
  `)
  .then(({ rows }) => {
    return rows
  })
}

const deleteComment = (params) => {
  return db.query(`
  DELETE FROM comments
 WHERE comment_id = $1;    
  `, [params])
  .then((status) => {
    if (status.rowCount === 0) {
      return Promise.reject({
        msg: "404 - Not found"
      })
    }
    return status
  })
}

const findUserByQuery = (params) => {
  return db.query(`
  SELECT 
  users.username, users.name, users.avatar_url
  FROM users
  WHERE users.username = $1
  `, [params])
  .then((status) => {
    if (status.rowCount === 0) {
      return Promise.reject({
        msg: "404 - Not found"
      })
    }
    return status
  })
}

const changeCommentVotes = (votes, commentId) => {
  return db.query(`
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `, [votes, commentId])
  .then(( {rows: comment}) => {
    if (comment.length === 0) {
      return Promise.reject({
        msg: "404 - Not found"
      })
    }
    return comment
  })
}

const addUser = (username, name, password, email, avatar_url) => {
  return db.query(
    `INSERT INTO users
    (username, name, password, email, avatar_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [username, name, password, email, avatar_url])
    .then(( {rows: user}) => {
      if (user.length === 0) {
        return Promise.reject({
          msg: "404 - Not found"
        })
      }
      return user
    })
}

const checkUser = (username) => {
    return db.query(
      `SELECT password 
      FROM users
      WHERE username = $1
      `,
      [username])
      .then(({rows: user}) => {
        if (user.length === 0) {
          return Promise.reject({
            msg: "401 - Unauthorized"
          })
        }
        return user
      })
}

const checkUsernameExists = (username) => {
      return db.query(
        `SELECT username
        FROM users
        WHERE username = $1
        `, [username])
        .then(({rows: user}) => {
          if (user.length === 0) {
            return false; //<--user does not exist
          }
          return true; //<--user found
      })
}

const checkEmailExists = (email) => {
    return db.query(
      `SELECT email
      FROM users
      WHERE email = $1
      `, [email])
      .then(({ rows: email }) => {
        if (email.length === 0) {
          return false;
        }
        return true;
      })
}

const submitArticle = (title, topic, author, body, votes = 0) => {
  return db.query(
    `INSERT INTO articles
    (title, topic, author, body, votes)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [title, topic, author, body, votes])
    .then(({rows: article}) => {
      if (article.length === 0) {
        return Promise.reject({
          msg: "404 - Not found"
        })
      }
      return findArticleById(article[0].article_id)
    })
}

const deleteArticle = (article_id) => {
  return db.query(
    `DELETE FROM articles
    WHERE article_id = $1;
    `, [article_id]
  ).then((status) => {
    if (status.rowCount === 0) {
      return Promise.reject({
        msg: "404 - Not found"
      })
    }
    return status
  })
}


// const deleteComment = (params) => {
//   return db.query(`
//   DELETE FROM comments
//  WHERE comment_id = $1;    
//   `, [params])
//   .then((status) => {
//     if (status.rowCount === 0) {
//       return Promise.reject({
//         msg: "404 - Not found"
//       })
//     }
//     return status
//   })
// }


module.exports = { 
    findAllTopics, 
    findArticles,
    findArticleById,
    findCommentsByArticleId,
    postCommentById,
    assignVotes,
    findUsers,
    findArticlesByWhereQuery,
    findArticlesByOrderBy,
    deleteComment,
    findUserByQuery, 
    changeCommentVotes,
    addUser,
    checkUser,
    checkUsernameExists,
    checkEmailExists,
    submitArticle,
    deleteArticle,
};