module.exports = (sequelize, DataTypes) => {
    class Comment extends DataTypes.Model {};
    Comment.init({           
        content: {
            type:DataTypes.TEXT,
            allowNull: true,
        }
    },{ 
        sequelize,
        modelName:'comment',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    return Comment;
};

