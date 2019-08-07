const express = require('express');

const router = express.Router();

const { Post, Bloginfo } = require('../models');

router.get('/', async (req, res) => {
    // const bloginfo = await Bloginfo.findOne({where:{name:'title'}});
    const posts = await Post.findAll();
    res.render('post', {
        title: 'Blog Title',
        posts: posts,
    });
})
router.post('/write/post', (req, res, next) => {
    
    Post.create({
        content: req.body.content,
        title: req.body.title,
    });
    res.redirect('/');
})
router.get('/posting', (req, res) => {
    res.render('posting-editor',{
        title:''
    });
    
})

module.exports = router;