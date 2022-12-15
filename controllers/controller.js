const {
  findAllTopics,
  findArticles,
  findArticleById,
  findCommentsByArticleId,
} = require("../model/model")

const listTopics = (request, response) => {
    findAllTopics().then((topics) => {
        response.status(200).send(topics)
    })
}

const listArticles = (request, response) => {
    findArticles().then((articles) => {
        response.status(200).send({articles: articles})
    })
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
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
};

module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle,
    findArticleComments, 
    }