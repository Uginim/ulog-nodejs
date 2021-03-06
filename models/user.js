module.exports = (sequelize, DataTypes) => {
    class User extends DataTypes.Model {};
    User.init({
        email: {
            type:DataTypes.STRING(100),
            allowNull: false,
        },    
        password: {
            type:DataTypes.TEXT,
            allowNull: true,
        },
        username: {
            type:DataTypes.STRING(50),
            allowNull:true,
        },
        provider:{
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        adminPermission:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        snsId: {
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    },{ 
        sequelize,
        modelName:'user',   
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    return User;
}