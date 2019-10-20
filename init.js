const adminRegister = require('./admin-register');
const { sequelize } = require('./models');

(async () => {
    try {        
        await sequelize.sync();
        await adminRegister();
    } catch(error) {
        console.error(error);
    }
}) ();