const express = require('express');
const { Post, Bloginfo, Tag, User } = require('../models');

const router = express.Router();
const getBlogTitle = async () => {
    const bloginfo = await Bloginfo.findOne({'where':{
        name:'blogName'
    }});
    return bloginfo.content;
}


router.get('/',async (req, res, next) => {
    try {
        
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
        });
        res.render('post', {
            blogTitle:await getBlogTitle(),
            title: 'Blog Title',
            posts: posts,
            user: req.user,
        });
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/alltags', async (req, res, next) => {
    try {
        
        const tags = await Tag.findAll({
            include: {
                model: Post,
                through:'posttags',
                attributes:['title','content'],
            }
        });
        res.render('alltags.pug',{
            blogTitle:await getBlogTitle(),
            title: 'Tag list',
            tags: tags,
            user: req.user,
        });
    } catch(error) {
        console.error(error);
        next(error);
    } 
});

router.get('/signin', (req, res, next) => {
    res.render('signin', {
        title: 'Sign in',
    })
});

router.get('/signuppage', (req, res, next) => {
    res.render('signup', {
        title: 'Sign up ',
    })
});

router.get('/privacypolicy', async (req, res, next) => {
    try { 
        const adminUser = await User.findOne({where:{adminPermission:'true'}});
        
        res.render('privacy-policy',{
            blogTitle:await getBlogTitle(),
            blogDomain:`www.uginim.com`,
            adminEmail:adminUser.email,
            adminName:adminUser.username,
            phoneNumber:`phoneNumber`
        });
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;