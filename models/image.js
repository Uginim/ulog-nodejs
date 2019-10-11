module.exports = (sequelize, DataTypes) => {
    class Image extends DataTypes.Model {};
    Image.init({           
        name: {
            type:DataTypes.TEXT,
            allowNull: true,
        },
    },{ 
        sequelize,
        modelName:'image',        
        timestamps: true,
        paranoid: true,
        charset: 'utf8',    
        collate: 'utf8_general_ci', 
    });
    return Image;
};

