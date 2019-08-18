const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, login, logout } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) =>{
    console.log(req.body);
    const { email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email }});
        if( existingUser ) {
            req.flash('already signed up')
            res.redirect()
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            username,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
} );

router.post('/login',isNotLoggedIn,login);
router.get('/logout',isLoggedIn,logout);


module.exports = router;
