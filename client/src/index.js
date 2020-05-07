import React from "react";
import ReactDOM from "react-dom";
// import App from "./App.js";
import PostList from "./post/PostList.js";
window.addEventListener('load',
e=>{    
    // post List 갱신
    const postList = document.getElementById("post-list");    
    if(document.getElementById("post-list")){
        ReactDOM.render(<PostList />, document.getElementById("post-list"));
        const postListRequest = new XMLHttpRequest();
        postListRequest.open("GET","/postlist")
        postListRequest.addEventListener('load',e=>{
            console.log('postlist:');
            console.dir(e.target.response);
            console.log(postList);
        });
        postListRequest.send();
    }

});