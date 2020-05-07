const express = require('express');
const { Post, Bloginfo, Tag, User, Category, CategoryGroup } = require('../models');

const path = require('path');
const router = express.Router();
router.get('/',async (req, res, next) => {
    console.log("html");
   
    res.render('main.html', {        
        title: 'Blog Title',
    });

}); 
router.get('/postlist',async (req, res, next)=>{
    let posts = await Post.findAll();    
    // posts = posts.map((post)=>{
    //     const year = post.createdAt.getFullYear()
    //         ,month = post.createdAt.getMonth()
    //         ,day = post.createdAt.getDate();
    //     post.formatDate = `${year}-${month<10?'0':''}${month}-${day<10?'0':''}${day}`
    //     return post;
    // });
    // res.render('main.html', {        
    //     postList: posts,
    // });
    res.send(posts);
})

module.exports = router;  