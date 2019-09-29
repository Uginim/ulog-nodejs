//관리자 페이지 전용
const express = require('express');
const {isAdmin, isNotAdmin} = require('./middlewares');
const multipartMiddleware = require('connect-multiparty')();
const { Post, Bloginfo, Tag, User, Category, CategoryGroup } = require('../models');


const router = express.Router();
const getAllCategoryItem = async () => {
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
        // where:{
        //     parentId:null,
        // },
        attributes:[
            'id',
            'name',
            'parentId',
        ],
    });
    return {
        categoryGroups,
        categories,
    };
}


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
    const json = await getAllCategoryItem();
    res.json(json);
});
router.post('/category/create',isAdmin,multipartMiddleware,async (req, res)=>{
    let { parentId } = req.body;
    parentId = parseInt(parentId);
    parentId = isNaN(parentId) ? null : parentId;
    await Category.create({
        name:'새 카데고리',
        parentId,
    });
    const json = await getAllCategoryItem();
    res.json(json);
    // Category.create({
    //     name:'새 카데고리',
    //     parentId:req.body.parentId,
    // })
    // .then((model)=>{
    //     const {id, name} = model;        
    //     res.json({
    //         id,
    //         name,
    //     });
    // })
    // .catch(error=>{
    //     res.send();
    // });
    // 
});
router.delete('/category/delete',isAdmin,multipartMiddleware,async (req, res)=>{
    const {id, type}=req.body;
    await Category.update({parentId:null},{where:{parentId:id}});
    await CategoryGroup.update({parentId:null},{where:{parentId:id}});
    console.log('type:',type,' id:', id);
    if(type==='category'){
        await Category.destroy({where:{id}});
    } else if(type==='group'){
        await CategoryGroup.destroy({where:{id}});
    }
    const json = await getAllCategoryItem();
    res.json(json);
});
router.post('/categorygroup/create',isAdmin,multipartMiddleware,async (req, res)=>{
    let { parentId } = req.body;
    parentId = parseInt(parentId);
    parentId = isNaN(parentId) ? null : parentId;
    
    await CategoryGroup.create({
        name:'새 그룹',
        parentId,
    });
    const json = await getAllCategoryItem();
    res.json(json);
});
router.put('/update/category',isAdmin,multipartMiddleware,async (req, res)=>{    
    if(req.body.type==='category'){
        let category = await Category.findOne({where:{
            id:req.body.id,
        }});        
        await Category.update({name:req.body.name},{where:{id:req.body.id}});
    }
    else if(req.body.type==='group'){
        let categoryGroup = await CategoryGroup.findOne({where:{
            id:req.body.id,
        }});        
        await CategoryGroup.update({name:req.body.name},{where:{id:req.body.id}});
    }
    const json = await getAllCategoryItem();
    res.json(json);
});

// router.get('/aboutmeEdit')
module.exports = router; 