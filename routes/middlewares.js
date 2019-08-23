const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('please. sign in!')
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.adminPermission ) {
        next();
    } else {
        res.status(403).send('please. sign in by Administer account')
    }
};
exports.isNotAdmin = (req, res, next) => {
    if (!req.isAuthenticated() && !req.user.adminPermissio) {
        next();
    } else {
        res.redirect('/');
    }
};


exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/signin');
        }
        return req.login(user, (loginError)=> {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req, next, next);

};

exports.logout = (req, res, next) => {
    console.log('processing log out')
    req.logout();
    res.redirect('/');
}