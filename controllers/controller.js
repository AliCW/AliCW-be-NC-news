const {
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
  postTopicBySlug,
} = require("../model/model")

const bcrypt = require("bcrypt")

const { 
  apiEndpoints, 
} = require("../model/endpoint-model")

const listTopics = (request, response, next) => {
    findAllTopics(request.query).then((topics) => {
        response.status(200).send({topics: topics})
    })
    .catch(next)
}
const listArticles = (request, response, next) => {
  if (
    Object.values(request.query).length === 0 ||
    Object.values(request.query)[0] === ""
  ) {
    findArticles()
      .then((articles) => {
        response.status(200).send({ articles: articles });
      })
      .catch(next);
  } else if (Object.keys(request.query)[0] === "sort_by") {
    findArticlesByOrderBy(request.query)
      .then((articles) => {
        response.status(200).send({ articles: articles });
      })
      .catch(next);
  } else {
    findArticlesByWhereQuery(request.query)
      .then((articles) => {
        response.status(200).send({ articles: articles }); 
      })
      .catch(next);
  }
};

const findSpecificArticle = (request, response, next) => {
  if (isNaN(Number(request.params.article_id))) {
    response.status(400).send({ msg: "400 - Bad request" });
  }
  findArticleById(request.params.article_id)
    .then((article) => {
      response.status(200).send({ article: { article } });
    })
    .catch(next);
};

const findArticleComments = (request, response, next) => {
  findCommentsByArticleId(request.params.article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

const postArticleComment = (request, response, next) => {
  const { username, body } = request.body
  postCommentById(username, body, request.params.article_id)
  .then((postedComment) => {
    response.status(201).send({postedComment})
  })
  .catch(next)
}

const addVotesToArticle = (request, response, next) => {
  assignVotes(request.body.inv_votes, request.params.article_id)
  .then((article) => {
    response.status(200).send({article})
  })
  .catch(next)
}

const listUsers = (request, response, next) => {
  findUsers().then((members) => {
    response.status(200).send({users: members})
  })
  .catch(next)
}

const deleteCommentById = (request, response, next) => {
  deleteComment(request.params.comment_id).then((status) => {
    response.status(204).send({comment: status})
  })
  .catch(next)
}

const findUser = (request, response, next) => {
  findUserByQuery(request.params.username).then((user) => {
    response.status(200).send({user: user})
  })
  .catch(next)
}

const alterCommentVotes = (request, response, next) => {
  changeCommentVotes(request.body.inv_votes, request.params.comment_id).then((comment) => {
    response.status(200).send({comment: comment})
  })
  .catch(next)
}


async function userSignup(request, response, next){
  const passwordHash = (password) => {
    return bcrypt.hash(password, 10)
  }
  const detectDuplicateUser = (username) => {
    return checkUsernameExists(username)
  }

  const detectDuplicateEmail = (email) => {
    return checkEmailExists(email)
  }

  try {
    if (!request.body.password === true) {
      return response.status(400).send({ body: "400 - Bad request"})
    }

    const detectDuplicateUsername = await detectDuplicateUser(request.body.username)
    if (detectDuplicateUsername === true) {
      return response.status(409).send({ body: "409 - Conflict"})
    }

    const detectDuplicateEmailAdd = await detectDuplicateEmail(request.body.email)
    if (detectDuplicateEmailAdd === true) {
      return response.status(409).send({ body: "409 - Conflict" })
    }

    const passHash = await passwordHash(request.body.password, 10)
    const { username, name, email, avatar_url } = request.body;
    const signupUser = await addUser(username, name, passHash, email, avatar_url)
    return response.status(201).send({ userObject: signupUser })
  } catch(error) {
    return next
  }
};

const userLogin = (request, response, next) => {
  checkUser(request.body.username).then((result) => {
    const check = bcrypt.compareSync(request.body.password, result[0].password)
    if(check === true) response.status(200).send({result: check})
    if(check === false) response.status(401).send({msg: "401 - Unauthorized"})
  })
  .catch(next)
}

const postArticle = (request, response, next) => {
  const {username, title, body, topic, created_at, votes} = request.body
    submitArticle(title, topic, username, body, created_at, votes).then((result) => {
      response.status(201).send({article: result});
    })
    .catch(next)
}


const deleteArticleById = (request, response, next) => {
   deleteArticle(request.params.article_id).then((status) => {
     response.status(204).send({comment: status})
   })
   .catch(next)
}

const postTopic = (request, response, next) => {
  const { description, slug, author } = request.body
  postTopicBySlug(description, slug, author).then((topic) => {
    response.status(201).send({body: topic})
  })
  .catch(next)
}

const listEndpoints = (request, response, next) => {
  response.status(200).send({endpoints: apiEndpoints()})
}

module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle,
    findArticleComments,
    postArticleComment,
    addVotesToArticle,
    listUsers,
    deleteCommentById,
    listEndpoints,
    findUser,
    alterCommentVotes,
    userSignup,
    userLogin,
    postArticle,
    deleteArticleById,
    postTopic,
    }


  