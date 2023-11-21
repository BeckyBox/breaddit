const db = require("../db/connection");

exports.getArticle = (article_id) => {

return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
.then(( {rows} ) => { return rows[0]});
    
}

exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
.then(( {rows }) => {
    if(!rows.length) {
        return Promise.reject({status: 400, msg: "Not Found"})
    }
}
)}