//관리자 페이지 전용
const express = require('express');
const { isAdmin, isNotAdmin } = require('./middlewares');
const multipartMiddleware = require('connect-multiparty')();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post, Bloginfo, Tag, User, Category, CategoryGroup } = require('../models');
const {BLOGINFO_PROPERTIES} = require('../utils/bloginfo-initializer');
const router = express.Router();

fs.readdir('uploads', (error) => { 
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            // console.log('file1:',file);
            cb(null, 'uploads/');
        },
        filename: function(req, file, cb) {
            const ext = path.extname(file.originalname);
            // console.log('file2:',file);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024 },
});

router.post('/img',isAdmin,upload.single('img'),(req, res)=> {
    // console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});


const getAllCategoryItem = async () => {
    try {
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
    }
    catch(error) {
        console.error(error);
    }
    return {
        categoryGroups,
        categories,
    };
}


router.get('/', isAdmin ,async (req, res, next)=>{
    try {
        const adminUser = await User.findOne({where:{adminPermission:'true'}})
        res.render('./admin',{
            title:'Admin Page',
            user: req.user,
        });    
    } catch (error) {
        console.log(error);
        next(error);
    }
    
});
router.get('/posting',isAdmin, async (req, res, next) => {
    try{
        const categories = await Category.findAll();
        
        res.render('./admin/posting-editor',{
            title:'Write a new Post',
            user: req.user, 
            categories,
        });
    } catch (error) {
        console.log(error);
        next(error);
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
            postContent:content,
            title,
            categoryId,
            modification:true,   
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});


router.get('/categories',isAdmin,async (req, res, next)=>{  
    try{
        const json = await getAllCategoryItem();
        res.json(json);
    } catch (error) {
        console.log(error);
        next(error);
    }
    
});
router.post('/category/create',isAdmin,multipartMiddleware,async (req, res, next)=>{
    try{
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
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.delete('/post/delete/:id',isAdmin,async (req, res, next)=>{
    try{
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
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/category/delete',isAdmin,multipartMiddleware,async (req, res, next)=>{
    try{
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
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.post('/categorygroup/create',isAdmin,multipartMiddleware,async (req, res, next)=>{
    try {
        let { parentId } = req.body;
        parentId = parseInt(parentId);
        parentId = isNaN(parentId) ? null : parentId;
        
        await CategoryGroup.create({
            name:'새 그룹',
            parentId,
        });
        const json = await getAllCategoryItem();
        res.json(json);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.put('/update/category',isAdmin,multipartMiddleware,async (req, res, next)=>{    
    try {
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
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.put('/move/category',isAdmin,multipartMiddleware,async (req, res, next) => {
    try {
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
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/favicon/store', isAdmin, (req,res)=>{

});
router.get('/posts/allposts', isAdmin, async (req,res, next) => {
    try{
        const posts = await Post.findAll({
            includes:[
                {
                    model:Category
    
                }
            ],
        });
        res.json(posts);
    } catch(error){
        console.error(error);
        next(error);
    }
});
router.get('/profile/init', isAdmin, async(req, res, next)=>{
    try{
        // Bloginfo.findOne({where:{

        // }})
        const user = await User.findOne({where:{adminPermission:true}});
        res.json({
            nickname:user.username,
            email:user.email,
        });
    } catch(error){
        console.error(error);
        next(error);
    }
});
router.get('/bloginfo', isAdmin, async(req, res, next) => {
    try {
        
        const bloginfos = {}; 
        for(property of BLOGINFO_PROPERTIES) {
            const {name} =property;
            const bloginfo = await Bloginfo.findOne({
                where:{
                    name
                },
            }); 
            bloginfos[bloginfo.name]= bloginfo.content;
        }
        res.json(bloginfos);
          
    } catch(error) {
        console.error(error);
        next(error);
    }
});
router.put('/bloginfo', isAdmin,multipartMiddleware, async(req, res, next) => {
    try{
        
        for(property of BLOGINFO_PROPERTIES) {
            const {name} =property;
            const bloginfo = await Bloginfo.update({
                content:req.body[name],
            },{
                where:{
                    name,
                },
            }); 
        }
        res.status(200).send();
    } catch(error) {
        console.error(error);
        next(error);
    }
})
// router.get('/aboutmeEdit')
module.exports = router; 