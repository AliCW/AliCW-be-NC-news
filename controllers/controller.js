const {
  findAllTopics,
  findArticles,
  findArticleById,
  findCommentsByArticleId,
  findHighestArticleId,
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
  if (isNaN(Number(request.params.article_id))) {
    response.status(400).send({ msg: "400 - Bad request" });
  }
  findHighestArticleId().then((highestArticle_Id) => {
    if (highestArticle_Id[0].article_id < request.params.article_id) {
      response.status(404).send({ msg: "404 - Not found" });
    } else {
      findCommentsByArticleId(request.params.article_id)
        .then((comment) => {
          response.status(200).send({ comments: comment });
        })
        .catch(next);
    }
  });
};


module.exports = { 
    listTopics, 
    listArticles, 
    findSpecificArticle,
    findArticleComments, 
    }