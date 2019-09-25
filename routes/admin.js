//관리자 페이지 전용
const express = require('express');
const {isAdmin, isNotAdmin} = require('./middlewares');
const multipartMiddleware = require('connect-multiparty')();
const { Post, Bloginfo, Tag, User, Category, CategoryGroup } = require('../models');


const router = express.Router();

router.get('/', isAdmin ,(req, res, next)=>{
    const adminUser = User.findOne({where:{adminPermission:'true'}})
    res.render('./admin',{
        title:'Admin Page',
        user: req.user,
    });
});
router.get('/posting',isAdmin, (req, res) => {
    res.render('./admin/posting-editor',{
        title:'Writing new Post',
        user: req.user,
    });
    
});
router.get('/categories',isAdmin,async (req, res)=>{
    const categoryGroups= await CategoryGroup.findAll({
        include:[
            Category,
        ],
        attributes:[
            'id',
            'name',
            'parentId',
        ],
    });
    const categories= await Category.findAll({
        where:{
            categorygroupid:null,
        },
        attributes:[
            'id',
            'name',
            'categorygroupId',
        ],
    });
    res.json({
        categoryGroups,
        categories,
    });
});
router.get('/category/create',isAdmin,(req, res)=>{
    Category.create({
        name:'새 카데고리',
    })
    .then((model)=>{
        const {id, name} = model;
        // console.log(id,name);
        res.json({
            id,
            name,
        });
    })
    .catch(error=>{
        res.send();
    });
    // 
});
router.get('/categorygroup/create',isAdmin,(req, res)=>{
    CategoryGroup.create({
        name:'새 그룹',
    })
    .then((model)=>{
        const {id, name} = model;
        // console.log(id,name);
        res.json({
            id,
            name,
        });
    })
    .catch(error=>{
        res.send();
    });
    // 
});
router.put('/update/category',isAdmin,multipartMiddleware,async (req, res)=>{
    console.log('update ', req.body.type);
    if(req.body.type==='category'){
        let category = await Category.findOne({where:{
            id:req.body.id,
        }});
        console.log('category: ',category);
        await Category.update({name:req.body.name},{where:{id:req.body.id}});
    }
    else if(req.body.type==='group'){
        let categoryGroup = await CategoryGroup.findOne({where:{
            id:req.body.id,
        }});
        console.log('categoryGroup: ',categoryGroup);
        await CategoryGroup.update({name:req.body.name},{where:{id:req.body.id}});
    }
    const categoryGroups= await CategoryGroup.findAll({
        include:[
            Category,
        ],
        attributes:[
            'id',
            'name',
            'parentId',
        ],
    });
    const categories= await Category.findAll({
        where:{
            categorygroupid:null,
        },
        attributes:[
            'id',
            'name',
            'categorygroupId',
        ],
    });
    res.json({
        categoryGroups,
        categories,
    });
});

// router.get('/aboutmeEdit')
module.exports = router; 