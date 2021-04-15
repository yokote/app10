import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../user/userSlice";
import Header from "./Header";
import Feed from "./Feed";
import Profile from "./Profile";
import styles from "./Core.module.css";
import { useParams } from "react-router-dom";
import PostInput from "./PostInput";

const Core = () => {
  const { username } = useParams<{ username: string }>();
  const user = useSelector(selectUser);

  return (
    <>
      <Header />
      <div className={styles.app}>
        <Feed>{user.username == username ? <PostInput /> : <Profile />}</Feed>
      </div>
    </>
  );
};

export default Core;
