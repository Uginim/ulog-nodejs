const express = require('express');
const { Post, Bloginfo, Tag } = require('../models');

const router = express.Router();

router.get('/',async (req, res, next) => {
    let posts = await Post.findAll({ include:[
        {
            model:Tag,
        }
    ]});    
    posts = posts.map((post)=>{
        const year = post.createdAt.getFullYear()
            ,month = post.createdAt.getMonth()
            ,day = post.createdAt.getDate();
        post.formatDate = `${year}-${month<10?'0':''}${month}-${day<10?'0':''}${day}`
        return post;
    })
    console.log('');
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