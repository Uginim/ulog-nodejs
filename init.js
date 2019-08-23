const adminRegister = require('./admin-register');
const { sequelize } = require('./models');

(async () => {
    await sequelize.sync();
    await adminRegister();
}) ();