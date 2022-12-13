const {findAllTopics, findArticles, findArticleById, findHighestArticle_Id} = require("../model/model")

const handle404Errors = (request, response) => {
    response.status(404).send({ msg: "404 - path / route is not valid"})
}

// const handle204Errors = (request, response) => {
//     response.status(204).send({ msg: "204 - No content found for supplied path"})
// }

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

const findSpecificArticle = (request, response) => {
  if (isNaN(Number(request.params.article_id))) {
    response.status(400).send({ msg: "400 - Bad request" });
  } else {
    findArticleById(request.params.article_id).then((article) => {
      response.status(200).send({ article: { article } });
    });
  }
};

module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle, 
    
    handle404Errors,
}