const sequelize = require('sequelize');
const inquirer = require('inquirer');
const bcrypt = require('bcrypt');
const { User } = require('./models');

const emailValidator = value => {
    if(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(value))
        return true;
    return 'Please valid email form';
}
var tempPassword;
const passwordValidator = value => {
    if (/\w/.test(value) && /\d/.test(value)) {
        tempPassword = value;
        return true;
    }
    return 'Password need to have at least a letter and a number';
};
const repetitionValidator = value => {
    if (value === tempPassword )
    {
        tempPassword = '';
        return true;
    }
    return "please repeat the same password"
}

const registerAdminPrompt = [
    {
        type: 'input',
        message: 'Enter a username for amdin',
        name: 'username',
    }
    ,{
        type: 'input',
        message: 'Enter a email for admin',
        name: 'email',
        validate: emailValidator,
    },
    {   
        type: 'password',
        message: 'Enter a password',
        name: 'password1',
        mask: '*',
        validate: passwordValidator,
    },
   // /*
    {
      type: 'password',
      message: 'Repeat the password',
      name: 'passwordRepetition',
      mask: '*',
      validate: repetitionValidator,
    }
  //  */
  ];

module.exports = async () => {
    const user = await User.findOne({where:{
        adminPermission: true,
    }});
    if(!user) {
        const {email, username, password1} = await inquirer.prompt(registerAdminPrompt);
        const password = await bcrypt.hash(password1, parseInt(process.HASH_SALT));
        await User.create({
            email,
            username,
            password,
            adminPermission: true, // It's important!
        });
    }
    
}
