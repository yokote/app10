import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";
import styles from "./PostWrapper.module.css";
import { db } from "../../firebase";
import Header from "./Header";
import Profile from "./Profile";

import { POST } from "../types";

// ファイル名変えたい
const PostWrapper: React.FC = () => {
  const { username, postId } =
    useParams<{
      username: string;
      postId: string;
    }>();

  const [post, setPost] = useState({
    id: "",
    avatar: "",
    image: "",
    text: "",
    timestamp: null,
    username: "",
    displayname: "",
  });

  useEffect(() => {
    const unSub = db
      .collection("users")
      .doc(username)
      .collection("posts")
      .doc(postId)
      .get()
      .then((snapshot) => {
        const doc = snapshot.data() as POST;
        setPost({
          id: snapshot.id,
          avatar: doc.avatar,
          image: doc.image,
          text: doc.text,
          timestamp: doc.timestamp,
          username: doc.username,
          displayname: doc.displayname,
        });
      });
  }, []);

  return (
    <>
      <Header />
      <div className={styles.app}>
        <div className={styles.feed}>
          <Profile />
          {post?.id && (
            <>
              <Post
                key={post.id}
                postId={post.id}
                avatar={post.avatar}
                image={post.image}
                text={post.text}
                timestamp={post.timestamp}
                username={post.username}
                displayname={post.displayname}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PostWrapper;
