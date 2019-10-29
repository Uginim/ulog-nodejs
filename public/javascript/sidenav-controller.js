var sideMenu = document.getElementById('sidemenu');
if(sideMenu) {
    console.log('sideMenu');
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/categories')
    xhr.onload = function(){
        console.log(xhr.response);
        var previousElement = sideMenu.cloneNode(true); // Input true for copying with children.
        const {categoryGroups, categories}= json;
        // Make Tree Structure                
        var treeStructure = treeStructureMaker.buildTreeStructure(categoryGroups,categories);            
        var treeController = updateElementsOfTree(categoryTreeElement,treeStructure);
        registerEventCallback(treeController.allListItems,'click',function(e){
            Array.prototype.forEach.call(categoryTreeElement.querySelectorAll('li'),(li)=>{
                li.classList.remove('active');
            });                           
            e.currentTarget.classList.toggle('active'); 
            e.stopPropagation();//input도 한번더 호출되는 듯..
            e.preventDefault();
        });
    }
    xhr.send();
}