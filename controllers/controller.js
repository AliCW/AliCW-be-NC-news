const {
  findAllTopics,
  findArticles,
  findArticleById,
  findCommentsByArticleId,
  postCommentById,
  
} = require("../model/model")

const listTopics = (request, response, next) => {
    findAllTopics().then((topics) => {
        response.status(200).send({topics: topics})
    })
    .catch(next)
}

const listArticles = (request, response, next) => {
    findArticles().then((articles) => {
        response.status(200).send({articles: articles})
    })
    .catch(next)
}

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


module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle,
    findArticleComments, 
    postArticleComment,
    
    }