module.exports = (sequelize, DataTypes) => {
    class Category extends DataTypes.Model {};
    Category.init({           
        name: {
            type:DataTypes.TEXT,
            allowNull: true,
        },
    },{ 
        sequelize,
        modelName:'category',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',    
        collate: 'utf8_general_ci',
    });
    return Category;
};

