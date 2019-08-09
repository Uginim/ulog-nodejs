module.exports = (sequelize, DataTypes) => {
    class Post extends DataTypes.Model {};
    Post.init({
        title: {
            type:DataTypes.STRING(200),
            allowNull: false,
        },    
        content: {
            type:DataTypes.TEXT,
            allowNull: true,
        }
    },{ 
        sequelize,
        modelName:'post',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    return Post;
};


