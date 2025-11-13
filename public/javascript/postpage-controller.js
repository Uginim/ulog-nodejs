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
            if(xhr.status === 200) {
                var comments = JSON.parse(xhr.responseText).comments;
                commentArea.innerHTML = "";
                comments.forEach(function(comment) {
                    var commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item mb-3 p-3 border rounded';
                    commentDiv.innerHTML = `
                        <div class="comment-username font-weight-bold">${comment.user.username}</div>
                        <div class="comment-createdat text-muted small">${new Date(comment.createdAt).toLocaleString('ko-KR')}</div>
                        <div class="comment-content mt-2">${comment.content}</div>
                    `;
                    commentArea.appendChild(commentDiv);
                });
                text.value = '';
            }
        }
        xhr.open('POST', window.location.pathname + '/comment');
        xhr.send(formData);
    });
}