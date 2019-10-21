const sequelize = require('sequelize');
const {Bloginfo} = require('../models');
const BLOGINFO_PROPERTIES = [
    {name:'blogName',defaultValue:`Ulog`},
    {name:'blogIntroduction',defaultValue:'Programming'},
    {name:'phoneNumber',defaultValue:''}
];

const initializer = async () => {
    try {
        for (property of BLOGINFO_PROPERTIES) {
            const {name, defaultValue} = property;
            console.log('name',name,'default',defaultValue);            
            const bloginfo = await Bloginfo.findOrCreate({
                where:{
                    name
                },
                defaults:{
                    content:defaultValue
                },
            });           
        }
    } catch (error) {
        console.error(error);
    }
}
initializer.BLOGINFO_PROPERTIES = BLOGINFO_PROPERTIES;
module.exports = initializer;
