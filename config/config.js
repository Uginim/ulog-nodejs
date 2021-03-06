require('dotenv').config();

module.exports = {
    development: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'myblog',
        host: '127.0.0.1',
        dialect: 'mysql',
        opratorsAliases: 'false',
    },
    production: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'myblog',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAliases: 'false',
        logging: false,
    }
}