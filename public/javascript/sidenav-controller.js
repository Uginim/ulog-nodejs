// var sideMenu = document.getElementById('sidemenu');
var sideMenu = document.querySelector('#sidemenu ul');
if(sideMenu) {
    var debouncingTimer;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/categories')
    xhr.onload = function(){
        
        var previousElement = sideMenu.cloneNode(true); // Input true for copying with children.
        var json= JSON.parse(xhr.response);
        var categoryGroups = json.categoryGroups;
        var categories = json.categories;
        // Make Tree Structure                
        var treeStructure = treeStructureMaker.buildTreeStructure(categoryGroups,categories);            
        var treeController = updateElementsOfTree(sideMenu,treeStructure);
        registerEventCallback(treeController.allListItems,'click',function(e){
            console.log('click');
            Array.prototype.forEach.call(sideMenu.querySelectorAll('li'),(li)=>{
                li.classList.remove('active');
            });                           
            e.currentTarget.classList.toggle('active'); 
            e.stopPropagation();//input도 한번더 호출되는 듯..
            e.preventDefault();
        });
        registerEventCallback(treeController.allListItems,'mouseover',function(e){
            console.log('mousover',e.currentTarget);
            if( debouncingTimer){
                clearTimeout(debouncingTimer);
            }
            var target = e.currentTarget;
            var targetEvent = e;
            e.stopPropagation();
            debouncingTimer= setTimeout(function(){ // e.currentTarget못찾음
                console.log('toggled',target,targetEvent);
                console.log(target.querySelector('input[type="checkbox"]')   );
                expandItem(target,targetEvent,true);
            },400);
            
        });
    }
    xhr.send();
}