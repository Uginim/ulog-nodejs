module.exports = (sequelize, DataTypes) => {
    class CategoryGroup extends DataTypes.Model {};
    CategoryGroup.init({           
        name: {
            type:DataTypes.TEXT,
            allowNull: true,
        },
        parentId: {
            type:DataTypes.INTEGER,
            references: {
                model:CategoryGroup,
                key:'id',
            },
            allowNull: true,
        }
    },{ 
        sequelize,
        modelName:'categorygroup',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',    
        collate: 'utf8_general_ci',
    });
    return CategoryGroup;
};

