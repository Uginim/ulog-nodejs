import React, { Component} from "react";
import "./Post.css";

class Post extends Component{
    render(){
        return(
            <div className="post-item">
                <img className="thumbnail"/>
                <p className="title"></p>
                <p className="content-summary"></p>
            </div>
        );
    }
}

export default PostList;