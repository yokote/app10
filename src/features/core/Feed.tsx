import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Feed.module.css";
import { selectUser } from "../user/userSlice";
import { db } from "../../firebase";
import PostInput from "./PostInput";
import Post from "./Post";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Profile from "./Profile";

const Feed: React.FC = (props) => {
  const { username } = useParams<{ username: string }>();
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("users")
      .doc(username)
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);

  return (
    <>
      <Header />
      <div className={styles.app}>
        <div className={styles.feed}>
          {user.username == username ? <PostInput /> : <Profile />}
          {posts[0]?.id && (
            <>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  avatar={post.avatar}
                  image={post.image}
                  text={post.text}
                  timestamp={post.timestamp}
                  username={post.username}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Feed;
