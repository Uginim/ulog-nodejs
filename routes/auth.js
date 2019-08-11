const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, login, logout } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) =>{
    const { email, nick, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email }});
        if( existingUser ) {
            req.flash('already signed up')
            res.redirect()
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nickname,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
} );

router.post('/login',isNotLoggedIn,login);
router.post('/logout',isLoggedIn,logout);
