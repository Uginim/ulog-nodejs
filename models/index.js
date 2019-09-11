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
db.Category = require('./category')(sequelize, Sequelize);
db.CategoryGroup = require('./categorygroup')(sequelize, Sequelize);

db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);

db.Post.belongsToMany(db.Tag,{through:'posttags'});
db.Tag.belongsToMany(db.Post,{through:'posttags'});

db.Comment.hasMany(db.Comment,{as:'reply'})

db.Category.hasMany(db.Post);
db.Post.belongsTo(db.Category);

db.CategoryGroup.hasMany(db.Category);
db.Category.belongsTo(db.CategoryGroup);

db.CategoryGroup.belongsTo(db.CategoryGroup,{
    as:'parent',
    foreignKey: 'parentId',
    targetKey:'id',
}); 
db.CategoryGroup.hasMany(db.CategoryGroup,{
    sourceKey:'id',
    foreignKey: 'parentId',
    as:{
        singular:'child',
        plural:'children',
    },
    constraints:false,
});
db.Bloginfo = require('./bloginfo');


module.exports=db;