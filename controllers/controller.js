const {findAllTopics} = require("../model/model")

const handle404Errors = (request, response) => {
    response.status(404).send({ msg: "404 - path / route is not valid"})
}

const listTopics = (request, response) => {
    findAllTopics().then((topics) => {
        response.status(200).send(topics)
    })
}

module.exports = { listTopics, handle404Errors }