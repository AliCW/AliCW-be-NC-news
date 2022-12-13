const {
  findAllTopics,
  findArticles,
  findArticleById,
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
  findArticleById(request.params.article_id)
    .then((article) => {
      response.status(200).send({ article: { article } });
    })
    .catch(next);
};


module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle, 
    }