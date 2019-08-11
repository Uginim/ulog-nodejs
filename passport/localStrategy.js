const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ 
                where: { email }, 
            });
            if (user) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
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