const express = require('express');

const router = express.Router();

const { Post, Bloginfo, Comment, Tag } = require('../models');

router.get('/', async (req, res) => {
    // const bloginfo = await Bloginfo.findOne({where:{name:'title'}});
    const posts = await Post.findAll();
    res.render('post', {
        title: 'Blog Title',
        posts: posts,
        user: req.user,
       
    });
});
router.get('/:id', async (req, res, next) => {
    const post = await Post.findOne({
        where:{id:req.params.id},
        includes:{
            model:Comment,
        }

    });    
    res.render('post-page',{
        title: post.title,
        content: post.content,
        user: req.user,
        postId: req.param.id,
    });
});
router.post('/write', (req, res, next) => {
    
    Post.create({
        content: req.body.content,
        title: req.body.title,
    });
    res.redirect('/');
});
router.post('/:id/comment', async (req, res, next) => {
    req.params.id;
    const post = await Post.findOne({
        where:{id:req.params.id},
    });  
    const newComment = await Comment.create({
        comment:req.body.comment,
    })
    post.addComment(newComment);
    const comments = await Comment.findAll({where:{postid:req.params.id}});
    res.send({comments});
});

module.exports = router;