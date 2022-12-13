const {findAllTopics, findArticles} = require("../model/model")

const handle404Errors = (request, response) => {
    response.status(404).send({ msg: "404 - path / route is not valid"})
}

const listTopics = (request, response) => {
    findAllTopics().then((topics) => {
        response.status(200).send(topics)
    })
}

const listArticles = (request, response) => {
    findArticles().then((articles) => {
        response.status(200).send(articles)
    })
}

module.exports = { listTopics, listArticles, handle404Errors }