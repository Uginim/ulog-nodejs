module.exports = (sequelize, DataTypes) => {
    class Tag extends DataTypes.Model {};
    Tag.init({
        title: {
            type:DataTypes.STRING(200),
            allowNull: false,
        }, 
    },{ 
        sequelize,
        modelName:'tag',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    return Tag;
};


