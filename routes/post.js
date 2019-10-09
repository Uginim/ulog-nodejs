const express = require('express');
const multipartMiddleware = require('connect-multiparty')();
const router = express.Router();

const { Post, Bloginfo, Comment, Tag, User, Category } = require('../models');


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
//post하나 가져오기
router.get('/:id', async (req, res, next) => {
    const post = await Post.findOne({
        where:{id:req.params.id},
        include:[{
            model:Comment,
            order:[['createdAt','DESC']],
            include:[{
                model:User,
                attributes:['username'],
            }],
        }],

    });    
    console.log('post content:',post.content);
    res.render('post-page',{
        title: post.title,
        content: post.content,
        post,
        user: req.user,
        postId: req.param.id,
    });
});
router.post('/write', async (req, res, next) => {     
    req.body.tags.match(/#[^\s]*/g);    
    console.log("request for 'write': ",req.body.category, req.body);
    let categoryId = parseInt(req.body.category);
    categoryId = isNaN(categoryId) ? null : categoryId;
    if(req.body.id) { //modification
        await Post.update({
            content: req.body.content,
            title: req.body.title,
            summary: req.body.summary,
            categoryId,
        },{
            where:{
                id:req.body.id,
            }
        })
    }
    else {
        await Post.create({
            content: req.body.content,
            title: req.body.title,
            summary: req.body.summary,
            categoryId,
        });
    }
    res.redirect('/admin');
});
router.post('/:id/comment',multipartMiddleware, async (req, res, next) => {
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
    console.log('content:',newComment.get('content'))
    post.addComment(newComment);
    user.addComment(newComment);
    const comments = await Comment.findAll({
        where:{postid:req.params.id},
        order:[['createdAt','DESC']],
        include:[{
            model:User,
            attributes:['username'],
        }],
        
    });
    res.send({comments});
});

module.exports = router;