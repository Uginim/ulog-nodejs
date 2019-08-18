const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            let user = await User.findOne({ 
                where: { email }, 
            });            
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {                    
                    done(null, user);
                } else {
                    console.log('incorrect password');
                    done(null, false, { message: 'incorrect password.' });
                }
            } else {
                done(null, false, { message: 'incorrect username.'})
            }
        }
        catch (error) {
            console.error(error);            
            done(error);
        }
    }));
}