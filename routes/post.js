const express = require('express');
const multipartMiddleware = require('connect-multiparty')();
const router = express.Router();

const { Post, Bloginfo, Comment, Tag, User } = require('../models');

router.get('/', async (req, res) => {
    // const bloginfo = await Bloginfo.findOne({where:{name:'title'}});
    const posts = await Post.findAll({ 
        atributes:['id','title','summary','createdAt'],
        includes:[
        {
            model:Tag,
        }
    ]});
    res.render('post', {
        title: 'Blog Title',
        posts: posts,
        user: req.user,
       
    });
});
router.get('/:id', async (req, res, next) => {
    const post = await Post.findOne({
        where:{id:req.params.id},
        include:[{
            model:Comment,
            include:[{
                model:User,
                attributes:['username'],
            }],
        }],

    });    
    
    res.render('post-page',{
        title: post.title,
        content: post.content,
        post,
        user: req.user,
        postId: req.param.id,
    });
});
router.post('/write', (req, res, next) => {     
    req.body.tags.match(/#[^\s]*/g);
    Post.create({
        content: req.body.content,
        title: req.body.title,
        summary: req.body.summary,
    });
    res.redirect('/');
});
router.post('/:id/comment',multipartMiddleware, async (req, res, next) => {
// router.post('/:id/comment', async (req, res, next) => {
    console.log('댓글 이벤트');
    const post = await Post.findOne({
        where:{id:req.params.id},
    });  
    const user = await User.findOne({
        where:{id:req.user.id},
    })
    console.log('req.body',req.body);

    const newComment = await Comment.create({
        content:req.body.comment,
    });
    // console.log(newComment.get('content'));
    console.log('content:',newComment.get('content'))
    post.addComment(newComment);
    user.addComment(newComment);
    const comments = await Comment.findAll({
        where:{postid:req.params.id},
        include:[{
            model:User,
            attributes:['username'],
        }],
        
    });
    console.log("comment:",comments);
    res.send({comments});
});

module.exports = router;