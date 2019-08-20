const express = require('express');
const { Post, Bloginfo, Tag } = require('../models');

const router = express.Router();

router.get('/',async (req, res, next) => {
    const posts = await Post.findAll({ include:[
        {
            model:Tag,
        }
    ]});    
    console.log("posts",posts[0].tags);
    res.render('post', {
        title: 'Blog Title',
        posts: posts,
        user: req.user,
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
        user: req.user,
    })
})

router.get('/signin', (req, res, next) => {
    res. render('signin', {
        title: 'Sign in',
    })
})

router.get('/signuppage', (req, res, next) => {
    res. render('signup', {
        title: 'Sign up ',
    })
})
module.exports = router;