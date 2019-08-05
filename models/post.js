const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class Post extends Model {}
module.exports = (sequelize, DataTypes) => (
    Post.init({
        title: {
            type:Sequelize.STRING(200),
            allowNull: false,
        },    
        content: {
            type:Sequelize.TEXT,
            allowNull: true,
        }
    },{    
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
);


