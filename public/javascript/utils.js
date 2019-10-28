
// custom-file behavior
var fileInputs = document.querySelectorAll('.custom-file-input');
Array.prototype.forEach.call(fileInputs,(input)=>{
    input.addEventListener('change',(event)=>{                    
        var target = document.querySelector(`label.custom-file-label[for="${event.currentTarget.id}"]`);                    
        target.innerText = event.currentTarget.files[0  ].name;
    });
});






/**
 * 트리구조만들기
 */
var treeStructureMaker = (() => {
    // 카데고리 그룹노드 생성
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
    // 카데고리 노드 생성
    var makeCategoryNode = (category) => {
        const {id, name, parentId } = category;
        return {
            type:'category',
            id,
            name,
            parentId,
        }
    }
    // 트리구조를 형성
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
// tree 의 node로 부터 element 생성
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
// checkbox 토글
var toggleItem = (target,event,propagation) => {
    var checkbox = target.querySelector('input[type="checkbox"]');
        if(checkbox)
            checkbox.checked=!checkbox.checked;
    if(event && propagation === false )
        event.stopPropagation();
}
// 확장하기만 함
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
    return {
        allCheckbox:allCheckbox,
        allListItems:allListItems
    }   
}
// 이벤트 등록
var registerEventCallback = function(allItems,eventType,listener){
    Array.prototype.forEach.call(allItems,function (item){
        item.addEventListener(eventType,listener);
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

