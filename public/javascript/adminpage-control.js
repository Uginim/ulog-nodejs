
/* Posts tab */
var postsTab = document.querySelector('a[href="#posts"]');   
var PAGE_RANGE = 5;
var makeRow = function (data) {
    var div = document.createElement('div');    
    div.innerHTML = '<span class="title"></span><span class="createdAt"></span> <span class="hidden-content"></span> <button class="btn-remove" type="button">삭제</button><button class="btn-modify" type="button">수정</button>'
    div.querySelector('.title').innerText=data.title;
    div.querySelector('.createdAt').innerText=data.createdAt;
    div.querySelector('.hidden-content').innerText=data.id;
    return div;
};
var refreshGrid = function refreshGrid(displayedPage, numOfRows, gridElement, postDatas) {
    var gridBody = gridElement.querySelector(".grid-container");    
    var i, dataLength = postDatas.length;
    start = ( displayedPage-1 ) * numOfRows,
    end = displayedPage * numOfRows;
    end = end>dataLength ? dataLength : end;    
    // Add rows to grid body
    gridBody.innerHTML='';
    for(i=start ; i< end;i++){        
        var row = makeRow(postDatas[i]);
        gridBody.appendChild(row);    
    }
    var removeButtons = gridElement.querySelectorAll('.btn-remove');
    var modifyButtons = gridElement.querySelectorAll('.btn-modify');
    
    if(removeButtons){
        Array.prototype.forEach.call(removeButtons,function(btn){            
            btn.addEventListener('click',function(e){
                var idSpan = e.currentTarget.parentNode.querySelector('.hidden-content');
                var id = idSpan.innerText;
                var xhr = new XMLHttpRequest();
                xhr.open('delete','/admin/post/delete/'+id);
                xhr.onload= function(){
                    var postGrid = document.querySelector('#posts-grid');
                    refreshGrid(1,10,postGrid,JSON.parse(xhr.response));              
                };
                xhr.send();

            });

        });
    }
    if(modifyButtons) {
        Array.prototype.forEach.call(modifyButtons,function(btn){            
            btn.addEventListener('click',function(e){
                var idSpan = e.currentTarget.parentNode.querySelector('.hidden-content');
                var id = idSpan.innerText;
                location="/admin/posting/"+id;  
            });

        });
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
if(postsTab) {
    postsTab.addEventListener('click',e=>{
        var xhr = new XMLHttpRequest();
        xhr.open('GET','/admin/posts/allposts');
        xhr.onload = function() {
            console.log('json',JSON.parse(xhr.response));
            var postGrid = document.querySelector('#posts-grid');
            refreshGrid(1,10,postGrid,JSON.parse(xhr.response));        
            
        };
        xhr.send();
    });
}


/* Bloginfo tab */
var bloginfoTab = document.getElementById('bloginfo-tab');
if(bloginfoTab){
    var bloginfoForm = document.getElementById('bloginfo-form');
    var initBloginfos = function () {
        if(bloginfoForm) {
            var xhr = new XMLHttpRequest();            
            xhr.open('GET','/admin/bloginfo');
            xhr.onload = function() {
                console.log(xhr.response);
                var data = JSON.parse(xhr.response);            
                console.log('data',data,bloginfoForm.querySelector('input[name="Introduction"]'));
                bloginfoForm.querySelector('input[name="name"]').value=data.blogName;
                bloginfoForm.querySelector('textarea[name="introduction"]').innerHTML=data.blogIntroduction;
                bloginfoForm.querySelector('input[name="phone-number"]').value=data.phoneNumber;
            };
            xhr.send();
        }
    }
    initBloginfos();
    bloginfoTab.addEventListener('click',function (event) {
        initBloginfos();
    });
    var button = bloginfoForm.querySelector('button');
    if(button){
        button.addEventListener('click',function(event){
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            formData.append('blogName',bloginfoForm.querySelector('input[name="name"]').value);
            formData.append('blogIntroduction,',bloginfoForm.querySelector('textarea[name="introduction"]').innerHTML);
            formData.append('phoneNumber', bloginfoForm.querySelector('input[name="phone-number"]').value);
            xhr.onload=function(){
                console.log(xhr.response);   
            }
            xhr.open('PUT','/admin/bloginfo');
            xhr.send(formData);
            
        });
    }
    
}
var faviconInput = document.getElementById('faviconImageInput');            
if(faviconInput) {
    faviconInput.addEventListener('change',(event)=>{                
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append(this.files[0]);
        xhr.open('POST','/admin/favicon/store');
        xhr.onload = function(){
            if(xml.status === 200) {
                //갱신
            }
        };
        xhr.send(formData);
                        
    });
}
var button = document.getElementById('delete-favicon');            
if( button) {        
    button.addEventListener('click',(event)=>{
        
    });
}


/* profile tab */
if(document.getElementById('profile-tab')){
    var profileForm = document.getElementById('profile-form');
    document.getElementById('profile-tab').addEventListener('click',function (event) {
        if(profileForm) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET','/admin/profile/init');            
            xhr.onload = function() {
                var data = JSON.parse(xhr.response);            
                profileForm.querySelector('input[name="nickname"]').value=data.nickname;
                profileForm.querySelector('input[name="email"]').value=data.email;
            };
            xhr.send();
        }
        
    });    
    var button = profileForm.querySelector('button');
    button.addEventListener('click',function(){
        var xhr = new  XMLHttpRequest();
        var formData = new FormData();
        formData.append('username', profileForm.querySelector('input[name="nickname"]').value);
        formData.append('email',profileForm.querySelector('input[name="email"]').value);
        xhr.open('PUT','/admin/profile');
        xhr.onload = function(){
            console.log(xhr.response); 
        }
        xhr.send(formData);
    });
}

/* Categories tab */        
//카데고리 탭 클릭 
var categoriesTab = document.querySelector('a[href="#categories"]');
if(categoriesTab) {
    categoriesTab.addEventListener('click',e=>{
        var xhr = new XMLHttpRequest();
        xhr.open('GET','/admin/categories');
        xhr.onload = () => {
            updateCategoryTreeWithJson(JSON.parse(xhr.response));
        };
        xhr.send();
    });
}

//카데고리/그룹 삭제
var btnDeleteGroup = document.getElementById('delete-category');
if(btnDeleteGroup) {
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
    });
}

//그룹 생성
var btnCreateGroup = document.getElementById('create-group');
if(btnCreateGroup) {
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
}

//카데고리 생성
var btnCreateCategory = document.getElementById('create-category');
if(btnCreateCategory) {
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
}

//수정 버튼
var btnUpdate = document.querySelector('#edit-category button');
if( btnUpdate) {
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
}

