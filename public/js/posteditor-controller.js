
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

