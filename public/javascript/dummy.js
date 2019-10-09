var TabController = function () {           
    var CLASSNAME_HIDDEN_CONTENT = 'hidden-content'; 
    var CLASSNAME_ACTIVE = 'active';
    var tabButtons,tabContents;
    var removeClassName = function(element,targetName) {
        //- console.log(element.className,typeof element.className);
        var resultClassNames = element.className.split(' ');                
        resultClassNames = resultClassNames.reduce( (acc,cur) => {               
            if(cur!==targetName) {
                acc.push(cur);
            }
            return acc;
        },[]);       
        //- console.log(resultClassNames);
        element.className= resultClassNames.join(' ');
    };                
    var addClassName = function (element, inputName) {
        element.className = element.className + ` ${inputName}`;
    };
    var initTabs = function () {
        tabButtons = document.getElementsByClassName('nav-link');
        tabContents = document.getElementsByClassName('tab-content');
        //- Array.prototype.forEach.call(tabButtons, function (tab) { // It's compatible with Internet Explorer
        //-     removeClassName(tab,'active');                
        //- });
        //- Array.prototype.forEach.call(tabContents, function (tab) {                
        //-     addClassName(tab,CLASSNAME_HIDDEN_CONTENT);
        //- });
        Array.prototype.forEach.call(tabButtons, function (tab) { 
            tab.addEventListener('click',(event)=>{                      
                //- console.log(tab.className);    
                //- Array.prototype.forEach.call(tabButtons, function (tab) { 
                //-     removeClassName(tab,CLASSNAME_ACTIVE);
                //- });                        
                //- addClassName(tab,CLASSNAME_ACTIVE);
                //- removeClassName(tab,CLASSNAME_HIDDEN_CONTENT)                        
            }); 
        });

    };
    
    initTabs();
    return {
        initTabs:initTabs,
        addClassName:addClassName,
        removeClassName:removeClassName,
    }
}
tabController = TabController();
tabController.initTabs();