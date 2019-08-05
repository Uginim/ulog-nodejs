const express = require('express');

const router = express.Router();

const { Post, Bloginfo } = require('../models');

router.get('/',(req, res) => {

    res.render('post', {
        title: ''
    });
    
})


module.exports = router;