module.exports = (sequelize, DataTypes) => {
    class Bloginfo extends DataTypes.Model {};
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
        sequelize,  
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    return Bloginfo;
};