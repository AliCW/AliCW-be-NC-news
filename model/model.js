const db = require("../db/connection")

const findAllTopics = () => {
    return db.query(`
    SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows;
    })
}

module.exports = { findAllTopics }