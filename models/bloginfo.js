const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class Bloginfo extends Model {};
module.exports = (sequelize, DataTypes) => (
    Bloginfo.init({
        name: {
            type:DataTypes.STRING(200),
            allowNull: false,
        },    
        content: {
            type:DataTypes.TEXT,
            allowNull: true,
        }
    },{    
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
);