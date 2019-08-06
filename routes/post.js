const express = require('express');

const router = express.Router();

const { Post, Bloginfo } = require('../models');

router.get('/', async (req, res) => {
    // const bloginfo = await Bloginfo.findOne({where:{name:'title'}});
    res.render('post', {
        title: 'Blog Title'
    });
})
router.post('/write/post', (req, res, next) => {
    
    Post.create({
        content: req.body.content,
        title: req.body.title,
    });
    
})
router.get('/posting', (req, res) => {
    res.render('posting-editor',{
        title:''
    });
    
})

module.exports = router;