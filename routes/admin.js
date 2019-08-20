//관리자 페이지 전용
const express = require('express');
const { Post, Bloginfo, Tag, User } = require('models');


const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('admin-page',{
        title:'Admin Page'
    });
});
router.get('/', (req, res) => {
    res.render('posting-editor',{
        title:'',
        user: req.user,
    });
    
});

module.exports = router;