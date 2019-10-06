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
// custom-file behavior
var fileInputs = document.querySelectorAll('.custom-file-input');
Array.prototype.forEach.call(fileInputs,(input)=>{
    input.addEventListener('change',(event)=>{                    
        var target = document.querySelector(`label.custom-file-label[for="${event.currentTarget.id}"]`);                    
        target.innerText = event.currentTarget.files[0  ].name;
    });
});


/* Post Editor */
var bodySection = document.querySelector('#body-section');
if(bodySection) {   
    var editor = new tui.Editor({
        el: bodySection,
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        height: '300px'
    });
    var postForm = document.getElementById('post-form');
    var postContent = postForm.querySelector('textarea[name="content"]');
    console.log('postContent', postContent);
    if(postForm) {
        postForm.addEventListener('submit',(event)=> {                    
            postContent.innerText=editor.getHtml();
            var form = event.target;
            console.log('form:',form.children);
            // event.preventDefault();
        });
    }    
}



/* Categories tab */
        
var treeStructureMaker = (() => {
    var makeGroupNode = (group) => {
        const {id, name, parentId} =group ; 
        return {
            type:'group',
            id,
            name,
            parentId,
            children : [],
        };

    };
    var makeCategoryNode = (category) => {
        const {id, name, parentId } = category;
        return {
            type:'category',
            id,
            name,
            parentId,
        }
    }
    var buildTreeStructure = (categoryGroups,categories)=>{
        var resultTreeStructure = {
            root:{
                type:'root',
                id:null,
                name:"root",
                parentId:null,
                children : [],
            },
            groups:{},
            categories:{},
        };
        var missingChildren = {};
        categoryGroups.forEach(categoryGroup=>{
            var newNode = makeGroupNode(categoryGroup);
            if(!newNode.parentId){                        
                resultTreeStructure.root.children.push(newNode);                        
            } else if(resultTreeStructure.groups[newNode.parentId]) {
                resultTreeStructure.groups[newNode.parentId].children.push(newNode);
            } else { // the missing child
                if(!missingChildren[newNode.parentId]){
                    missingChildren[newNode.parentId] = [];                            
                } 
                missingChildren[newNode.parentId].push(newNode);
            }

            newNode.children= missingChildren[newNode.id] || newNode.children;
            resultTreeStructure.groups[newNode.id]= newNode;                        
        });
        categories.forEach(category=>{
            var newNode = makeCategoryNode(category);
            if(!newNode.parentId){
                resultTreeStructure.root.children.push(newNode); 
            } else {
                resultTreeStructure.groups[newNode.parentId].children.push(newNode);
            }
            resultTreeStructure.categories[newNode.id]=newNode;
        });
        return resultTreeStructure;
    }
    return {
        makeGroupNode,
        makeCategoryNode,
        buildTreeStructure,
    }
})();
var makeTreeElementFromNode = (node) => {
    var newElement = document.createElement('li');
    newElement.setAttribute('value',node.type==='root' ? `${node.type}:${node.type}` :`${node.type}:${node.id}`);
    newElement.setAttribute('draggable',"true");                                
    if(node.type==='category') {
        newElement.innerHTML = `<label class="d-flex category-tree-node category">
            <span>${node.name}</span>
        </label>`;
    } else {                       
        newElement.innerHTML = `<input type="checkbox" class="drop" checked id="${node.type}:${node.type}"><label for="${node.type}:${node.type}" class="d-flex category-tree-node ${node.type}">
            <span class="mr-auto">${node.type==='root'? '/' : node.name}</span><span class="badge badge-primary badge-pill">${node.children.length}</span>
        </label><ul></ul>`;                       
    }
    return newElement;
};
var toggleExpanded = (target,event,propagation) => {
    var checkbox = target.querySelector('input[type="checkbox"]');
        if(checkbox)
            checkbox.checked=!checkbox.checked;
    if(event && propagation === false )
        event.stopPropagation();
}
var expandItem = (target,event,propagation) => {
    var checkbox = target.querySelector('input[type="checkbox"]');
        if(checkbox)
            checkbox.checked=false;
    if(event && propagation === false )
        event.stopPropagation();
}
var updateElementsOfTree = (categoryTreeElement,treeStructure) => {
    categoryTreeElement.innerHTML=""; 
    var appandTreeChildren = function appandTreeChildren(curNode,parentElement){
        var newElement = makeTreeElementFromNode(curNode);
        parentElement.appendChild(newElement);    
        if(curNode.type!=='category'){
            var ul = newElement.querySelector('ul');
            curNode.children.forEach(childNode=> {
                appandTreeChildren(childNode,ul);
            });
        }
        
    };
    appandTreeChildren(treeStructure.root,categoryTreeElement);
    var allListItems= categoryTreeElement.querySelectorAll('li');
    var allCheckbox= categoryTreeElement.querySelectorAll('input[type="checkbox"]');
    Array.prototype.forEach.call(allListItems,(li)=>{
        li.addEventListener('click',(e)=>{                   
            Array.prototype.forEach.call(categoryTreeElement.querySelectorAll('li'),(li)=>{
                li.classList.remove('active');
            });                           
            e.currentTarget.classList.toggle('active'); 
            e.stopPropagation();//input도 한번더 호출되는 듯..
            e.preventDefault();
        });
        
        li.addEventListener('dblclick',(e)=>{           
            toggleExpanded(e.currentTarget,e,false);
        });
    });
    
    Array.prototype.forEach.call(allCheckbox,(input)=>{
        input.addEventListener('click',(e)=>{                    
            e.preventDefault();
        });
        
    });                 
    //동작하기 
    Array.prototype.forEach.call(allListItems,(li)=>{ 
        li.addEventListener('click',(e)=>{
            var value = e.currentTarget.getAttribute('value');
            const [type, id] = value.split(':');
            var nameInput= document.querySelector('#edit-category input[name="name"]');
            nameInput.disabled=false;
            if(type==='category'){
                nameInput.value = treeStructure.categories[parseInt(id)].name;
            }                        
            else if(type==='group')
                nameInput.value = treeStructure.groups[parseInt(id)].name;
            else 
                nameInput.disabled=true;
        });
    });
    // Set Data when a drag starts 
    Array.prototype.forEach.call(allListItems,(li)=>{ 
        li.addEventListener('dragstart',(e)=>{      
            var value = e.currentTarget.getAttribute('value');                    
            e.dataTransfer.setData("value",value); 
            e.stopPropagation();
        });
    });
    //dragOver
    Array.prototype.forEach.call(allListItems,(li)=>{ 
        li.addEventListener('dragover',(e)=>{                   
            expandItem(e.currentTarget,e,false);
            e.preventDefault();// for catching "drop" event 
        });
    });
    Array.prototype.forEach.call(allListItems,(li)=>{ 
        li.addEventListener('drop',(e)=>{                   
            
            var destStr = e.currentTarget.getAttribute('value');
            var destDatas = destStr.split(':');
            var destType = destDatas[0], destId = parseInt(destDatas[1]);
            var srcStr = e.dataTransfer.getData("value");  
            var srcDatas = srcStr.split(':');
            var srcType = srcDatas[0], srcId = parseInt(srcDatas[1]);
            var formData = new FormData();                    
            if(destType==='group' || destType ==='root') {
                formData.append('childType',srcType);
                formData.append('childId',srcId);
                formData.append('newParentType',destType);
                formData.append('newParentId',destId);
                var xhr = new XMLHttpRequest();
                xhr.open('PUT','/admin/move/category');
                xhr.onload = ()=> {
                    updateCategoryTreeWithJson(JSON.parse(xhr.response));
                };
                xhr.send(formData);
            }
            e.stopPropagation();
        });
    });
}
var updateCategoryTreeWithJson = (json) => {
    var categoryTreeElement = document.querySelector('#category-tree ul');   
    var previousElement = categoryTreeElement.cloneNode(true); // Input true for copying with children.
    const {categoryGroups, categories}= json;
    // Make Tree Structure                
    var treeStructure = treeStructureMaker.buildTreeStructure(categoryGroups,categories);            
    updateElementsOfTree(categoryTreeElement,treeStructure);
    // Keep the continuity of tree view
    var previousInputElements = previousElement.querySelectorAll('input[type="checkbox"]');
    Array.prototype.forEach.call(previousInputElements, (inputElement)=>{ 
        var value = inputElement.parentNode.getAttribute('value');
        if(!inputElement.checked){
            var targetInput = categoryTreeElement.querySelector(`li[value="${value}"] input`);
            targetInput.checked = false;
        }
    });
};

//카데고리 탭 클릭 
var categoriesTab = document.querySelector('a[href="#categories"]');
categoriesTab.addEventListener('click',e=>{
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/admin/categories');
    xhr.onload = () => {
        updateCategoryTreeWithJson(JSON.parse(xhr.response));
    };
    xhr.send();
});


//카데고리/그룹 삭제
var btnDeleteGroup = document.getElementById('delete-category');
btnDeleteGroup.addEventListener('click',(e)=> {
    e.preventDefault();
    var targetItem = document.querySelector('#category-tree li.active');
    var value = targetItem.getAttribute('value');
    const [type, id] = value.split(':');
    var formData = new FormData();
    formData.append('id',id);
    formData.append('type',type);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE','/admin/category/delete');
    xhr.onload= (e) => {
        updateCategoryTreeWithJson(JSON.parse(xhr.response));
    };
    xhr.send(formData);
})
//그룹 생성
var btnCreateGroup = document.getElementById('create-group');
btnCreateGroup.addEventListener('click',(e)=> {
    e.preventDefault();
    var targetItem = document.querySelector('#category-tree li.active');
    var value = (targetItem)? targetItem.getAttribute('value') : 'root:null';
    const [type, id] = value.split(':');
    var formData = new FormData();            
    if(type==='group')            
        formData.append('parentId',id);
    else 
        formData.append('parentId','null');  
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/admin/categorygroup/create');
    xhr.onload = () => {
        updateCategoryTreeWithJson(JSON.parse(xhr.response));
    };
    xhr.send(formData);
});
//카데고리 생성
var btnCreateCategory = document.getElementById('create-category');
btnCreateCategory.addEventListener('click',(e)=> { 
    e.preventDefault();
    var targetItem = document.querySelector('#category-tree li.active');
    var value = (targetItem)? targetItem.getAttribute('value') : 'root:null';
    const [type, id] = value.split(':');
    var formData = new FormData();
    if(type==='group')            
        formData.append('parentId',id);
    else 
        formData.append('parentId','null');
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/admin/category/create');
    xhr.onload = (e) => {
        updateCategoryTreeWithJson(JSON.parse(xhr.response));
    };
    xhr.send(formData);
});
//수정 버튼
var btnUpdate = document.querySelector('#edit-category button');
btnUpdate.addEventListener('click', (e)=> {
    var targetItem = document.querySelector('#category-tree li.active');
    var formData = new FormData();
    var form = document.getElementById('edit-category');
    var name = form.querySelector('input[name="name"]').value;
    var value = targetItem.getAttribute('value');
    const [type, id] = value.split(':');
    formData.append('type',type);
    formData.append('id',id);
    formData.append('name',name);
    var xhr = new XMLHttpRequest();
    xhr.open('PUT','/admin/update/category');
    xhr.onload = (e) => {
        updateCategoryTreeWithJson(JSON.parse(xhr.response));
    };
    xhr.send(formData);
});


/* Posts tab */
var postsTab = document.querySelector('a[href="#posts"]');   
var PAGE_RANGE = 5;
var makeRow = function (data) {
    var div = document.createElement('div');    
    // div.innerHTML = `<span>${data.title}</span><span>${data.createdAt}`;
    div.innerHTML = '<span class="title"></span><span class="createdAt"></span><button class="btn-remove" type="button">삭제</button><button class="btn-modify" type="button">수정</button>'
    div.querySelector('.title').innerText=data.title;
    div.querySelector('.createdAt').innerText=data.createdAt;
    //삭제/수정

    //제목
    //카데고리
    //작성날짜
    return div;
};
var refreshGrid = function(displayedPage, numOfRows, gridElement, postDatas) {
    var gridBody = gridElement.querySelector(".grid-container");    
    var i, dataLength = postDatas.length;
    start = ( displayedPage-1 ) * numOfRows,
    end = displayedPage * numOfRows;
    end = end>dataLength ? dataLength : end;
    console.log(start,end);
    // Add rows to grid body
    gridBody.innerHTML='';
    for(i=start ; i< end;i++){
        // var row = document.createElement('div');
        console.log('i:',i);
        var row = makeRow(postDatas[i]);
        gridBody.appendChild(row);    
    }
    
    // Set page numbers
    start = displayedPage - Math.floor(PAGE_RANGE/2);
    start = (start<1) ? 1 : start;
    end = displayedPage + Math.floor(PAGE_RANGE/2);
    end = (end> Math.ceil(postDatas.length/numOfRows)) ? Math.ceil(postDatas.length/numOfRows) : end;
    var pageButtonGroup = gridElement.querySelector(".page-btn-group");
    for(i=start;i<=end;i++){
        
    }
};


postsTab.addEventListener('click',e=>{
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/admin/posts/allposts');
    xhr.onload = () => {
        console.log('json',JSON.parse(xhr.response));
        var postGrid = document.querySelector('#posts-grid');
        refreshGrid(1,10,postGrid,JSON.parse(xhr.response));        
        
    };
    xhr.send();
});



/* Bloginfo tab */
var faviconInput = document.getElementById('faviconImageInput');            
faviconInput.addEventListener('change',(event)=>{                
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append(this.files[0]);
    xhr.open('POST','/admin/favicon/store');
    xhr.onload(function(event){
        if(xml.status === 200) {
            //갱신
        }
    });
    xhr.send(formData);
                    
});
var button = document.getElementById('delete-favicon');            
button.addEventListener('click',(event)=>{
    
});