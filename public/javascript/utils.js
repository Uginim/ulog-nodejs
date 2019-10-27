
// custom-file behavior
var fileInputs = document.querySelectorAll('.custom-file-input');
Array.prototype.forEach.call(fileInputs,(input)=>{
    input.addEventListener('change',(event)=>{                    
        var target = document.querySelector(`label.custom-file-label[for="${event.currentTarget.id}"]`);                    
        target.innerText = event.currentTarget.files[0  ].name;
    });
});







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
            // toggleExpanded(e.currentTarget,e,false);
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
    return {
        addEventListenerToLis: function (eventType,listener){
            Array.prototype.forEach.call(allListItems,function (li){
                li.addEventListener(eventType,listener);
            });
        },
    }   
}

var updateCategoryTreeWithJson = (json) => {
    var categoryTreeElement = document.querySelector('#category-tree ul');   
    var previousElement = categoryTreeElement.cloneNode(true); // Input true for copying with children.
    const {categoryGroups, categories}= json;
    // Make Tree Structure                
    var treeStructure = treeStructureMaker.buildTreeStructure(categoryGroups,categories);            
    var eventListenerAdder = updateElementsOfTree(categoryTreeElement,treeStructure);
    //dbl click
    eventListenerAdder.addEventListenerToLis('dblclick',function(e){
        toggleExpanded(e.currentTarget,e,false);        
    });
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










/* post-page */
//- var converter = new showdown.Converter();    
var contentBody = document.getElementById('content-body');
if(contentBody) {
    console.log(contentBody);
    // var innerText = contentBody.innerHTML;
    // contentBody.innerHTML = contentBody.innerText;
    // contentBody.innerHTML = marked(contentBody.innerHTML);
    var postContent =  contentBody.innerHTML;
    contentBody.innerHTML='';
    var editor = new tui.Editor.factory({
        el: contentBody,
        viewer:true,
        initialValue:postContent
    });
}
//- content.innerHTML = converter.makeHtml(content.innerHTML);
// content.innerHTML = content.innerText;
if( document.getElementById('comment-send') ) {
    document.getElementById('comment-send').addEventListener('click', function (e) {                                
        var text = document.getElementById('comment-text');
        var formData = new FormData();
        var commentArea = document.getElementById('comment-area');
        //- var commentArea = document.querySelector('form>input[name="comment"]');
        formData.append(text.name,text.value);
        console.log('name,value',text.name, text.value);
        console.log('form comment',formData.get(text.name));
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            commentArea.innerHtml = "";
            var comments = JSON.parse(xhr.responseText).comments;     
        }        
        xhr.open('POST','/post/#{post.id}/comment'); 
        xhr.send(formData);  
    });
}

/* Post Editor */
var bodySection = document.querySelector('#body-section');
if(bodySection) {   
    
    var postForm = document.getElementById('post-form');
    var postContent = postForm.querySelector('textarea[name="content"]');
    var editor = new tui.Editor({
        el: bodySection,    
        // initialEditType: 'wysiwyg',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        height: '300px',
        // initialValue:postContent.innerHTML
    });
    console.log(postContent.innerHTML);
    // editor.setHtml(postContent.innerHTML);
    editor.setMarkdown(postContent.innerHTML);
    // console.log('postContent', postContent);
    if(postForm) {
        postForm.addEventListener('submit',(event)=> {                    
            // postContent.innerText=editor.getHtml();//innerText로 넣으면 개행은 <br>이되어버린다.
            postContent.innerHTML=editor.getMarkdown();
            // postContent.innerHTML=editor.getHtml();
            console.log(postContent);
            console.log('markdown',editor.getMarkdown());
            var form = event.target;
            console.log('form:',form.children);
            // event.preventDefault();
        });
    }    
    if(document.getElementById('image-input')) {
        document.getElementById('image-input').addEventListener('change',function(event){
            var formData = new FormData();
            console.log(this, this.files);
            formData.append('img', this.files[0]);
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var url = JSON.parse(xhr.responseText).url;
                    var imageList = document.getElementById('image-list');
                    var newListItem = document.createElement('li');
                    

                    newListItem.addEventListener('click',function(event){
                        var codeMirror = editor.getCodeMirror();
                        var previousContent = editor.getMarkdown();
                        console.log('![image]('+newListItem.innerText+')');
                        console.log(codeMirror.getCursor());
                        
                        codeMirror.setValue(previousContent+'\n![image]('+newListItem.innerText+')');
                    });
                    newListItem.innerText=url;
                    imageList.appendChild(newListItem);   
                    
                    
                } else {
                    console.error(xhr.responseText);
                }
            };
            xhr.open('POST', '/admin/img');
            xhr.send(formData);
        });
    }
    
}

