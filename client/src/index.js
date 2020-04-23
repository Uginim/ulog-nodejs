import React from "react";
import ReactDOM from "react-dom";
// import App from "./App.js";
import PostList from "./post/PostList.js";
window.addEventListener('load',
e=>{
    if(document.getElementById("post-list")){
        ReactDOM.render(<PostList />, document.getElementById("post-list"));
    }

});