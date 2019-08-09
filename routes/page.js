const express = require('express');
const { Post, Bloginfo } = require('../models');

const router = express.Router();

router.get('/',async (req, res, next) => {
    const posts = await Post.findAll();

    res.render('post', {
        title: 'Blog Title',
        posts: posts,
    });
});

module.exports = router;