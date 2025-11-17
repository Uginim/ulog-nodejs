const express = require('express');
const multipartMiddleware = require('connect-multiparty')();


const { Post, Bloginfo, Comment, Tag, User, Category } = require('../models');
const router = express.Router();
const getBlogTitle = async () => {
    const bloginfo = await Bloginfo.findOne({'where':{
        name:'blogName'
    }});
    return bloginfo.content;
}

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            attributes:['id','title','summary','createdAt'],
            include:[{
                model:Tag,
                attributes:['title'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.render('post', {
            title: await getBlogTitle(),
            blogTitle: await getBlogTitle(),
            posts: posts,
            user: req.user,
        });
    } catch(error) {
        console.error(error);
        next(error);
    }
});
//post하나 가져오기
router.get('/:id', async (req, res, next) => {
    try {       
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
            blogTitle: await getBlogTitle(),
            title: post.title,
            content: post.content,
            post,
            user: req.user,
            postId: req.param.id,
        });
    } catch(error){
        console.error(error);
        next(error);
    }
});
router.post('/write', async (req, res, next) => {
    try {
        console.log("request for 'write': ",req.body.category, req.body);
        let categoryId = parseInt(req.body.category);
        categoryId = isNaN(categoryId) ? null : categoryId;

        // Parse tags from the tags string
        const tagMatches = req.body.tags ? req.body.tags.match(/#[^\s#]+/g) : [];
        const tagTitles = tagMatches ? tagMatches.map(tag => tag.substring(1)) : [];

        let post;
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
            });
            post = await Post.findByPk(req.body.id);
        }
        else {
            post = await Post.create({
                content: req.body.content,
                title: req.body.title,
                summary: req.body.summary,
                categoryId,
            });
        }

        // Handle tags
        if(tagTitles.length > 0) {
            const tags = await Promise.all(
                tagTitles.map(title =>
                    Tag.findOrCreate({ where: { title } }).then(([tag]) => tag)
                )
            );
            await post.setTags(tags);
        } else {
            await post.setTags([]);
        }

        res.redirect('/admin');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/comment',multipartMiddleware, async (req, res, next) => {
    try {
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
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;