const express = require('express');
const path = require('path');
const router = express.Router();
router.get('/',async (req, res, next) => {
    console.log("html");
    res.render('main.html', {        
        title: 'Blog Title'   
    });

}); 


module.exports = router;  