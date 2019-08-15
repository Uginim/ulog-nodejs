const express = require('express');
const { Post, Bloginfo, Tag } = require('../models');

const router = express.Router();

router.get('/',async (req, res, next) => {
    const posts = await Post.findAll();

    res.render('post', {
        title: 'Blog Title',
        posts: posts,
    });
});

router.get('/alltags', async (req, res, next) => {
    const tags = await Tag.findAll({
        include: {
            model: Post,
            through:'posttags',
            attributes:['title','content'],
        }
    });
    res.render('alltags.pug',{
        title: 'Tag list',
        tags: tags,
    })
})

router.get('/signin', (req, res, next) => {
    res. render('signin', {
        title: 'Sign in',
    })
})

router.get('/signuppage', (req, res, next) => {
    res. render('signup', {
        title: '',
    })
})
module.exports = router;