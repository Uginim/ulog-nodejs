//관리자 페이지 전용
const express = require('express');
const { Post, Bloginfo, Tag, User } = require('../models');


const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('admin',{
        title:'Admin Page'
    });
});
router.get('/posting', (req, res) => {
    res.render('./admin/posting-editor',{
        title:'Writing new Post',
        user: req.user,
    });
    
});

module.exports = router;