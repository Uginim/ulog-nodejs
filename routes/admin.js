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
router.get('/posting',isAdmin, async (req, res, next) => {
    try{
        const categories = await Category.findAll();
        
        res.render('./admin/posting-editor',{
            title:'Write a new Post',
            user: req.user, 
            categories,
        });
    }catch (e) {
        next(e);
    }
});
router.get('/posting/:id',isAdmin, async (req, res, next) => {
    try{
        const {id} = req.params;    
        
        const {content,title,categoryId} = await Post.findOne({where:{id}});        
        const categories = await Category.findAll();          
        res.render('./admin/posting-editor',{
            title:'Write a new Post',
            user: req.user, 
            categories,
            id,
            content,
            title,
            categoryId,
            modification:true,   
        });
    }catch (e) {
        next(e);
    }
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
router.delete('/post/delete/:id',isAdmin,async (req,res)=>{
    const {id } = req.params;
    console.log(id);
    await Post.destroy({where:{id}});
    const posts = await Post.findAll({
        includes:[
            {
                model:Category,
            },
        ],
    });
    res.json(posts);
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
             
        await CategoryGroup.update({name:req.body.name},{where:{id:req.body.id}});
    }
    const json = await getAllCategoryItem();
    res.json(json);
});
router.put('/move/category',isAdmin,multipartMiddleware,async (req, res)=>{
    const {childType, newParentType} = req.body;
    let {childId, newParentId } = req.body;
    if(typeof childId == 'string')
        childId = isNaN(childId)?  null : parseInt(childId);
    if(typeof newParentId === 'string')
        newParentId = isNaN(newParentId)?  null : parseInt(newParentId);
    console.log('request body',childId,childType,newParentId,newParentType);
    if(newParentType ==='group' || newParentType ==='root'){
        console.log(childType,childId,newParentType,newParentId);
        if(childType==='category'){
            await Category.update({parentId:newParentId},{where:{id:childId}});
        } else if(childType==='group'){
            await CategoryGroup.update({parentId:newParentId},{where:{id:childId}});
        }
    }
    const json = await getAllCategoryItem();
    res.json(json);
});
router.post('/favicon/store', isAdmin, (req,res)=>{

});
router.get('/posts/allposts', isAdmin, async (req,res) => {
    const posts = await Post.findAll({
        includes:[
            {
                model:Category

            }
        ],
    });
    res.json(posts);
});

// router.get('/aboutmeEdit')
module.exports = router; 