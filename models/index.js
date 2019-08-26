const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.User = require('./user')(sequelize,Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);

db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);
db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);
db.Post.belongsToMany(db.Tag,{through:'posttags'});
db.Tag.belongsToMany(db.Post,{through:'posttags'});
db.Comment.hasMany(db.Comment,{as:'reply'})

// db.Bloginfo = require('./bloginfo');


module.exports=db;