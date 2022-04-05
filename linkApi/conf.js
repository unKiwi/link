const secret = require("./secret");

let conf = {
    uri: `https://adn2.ovh/`,
    mysqlParams: {
        host     : 'noncerr.com',
        user     : 'root',
        password : secret.dbPassword,
        database : 'link'
    }
}

module.exports = conf;