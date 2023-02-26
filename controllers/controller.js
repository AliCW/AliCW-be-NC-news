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
} = require("../model/model")

const bcrypt = require("bcrypt")

const { 
  apiEndpoints, 
} = require("../model/endpoint-model")
const { request, response } = require("../app")

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
const listEndpoints = (request, response, next) => {
    response.status(200).send({endpoints: apiEndpoints()})
}

const userSignup = (request, response, next) => {
  if (!request.body.password === true) {
    return response.status(400).send({ body: "400 - Bad request"})
  }
  return bcrypt
    .hash(request.body.password, 10)
    .then((hash) => {
      const { username, name, avatar_url } = request.body;
      addUser(username, name, hash, avatar_url).then((result) => {
        response.status(201).send({ userObject: result });
      });
    })
    .catch(next);
};


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
    }


  