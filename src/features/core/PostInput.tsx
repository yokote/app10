import React, { useState } from "react";
import styles from "./PostInput.module.css";
import { storage, db, auth } from "../../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../user/userSlice";
import { Avatar, Button, IconButton } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const PostInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postMsg, setPostMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPostImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*
    if (postImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + postImage.name;
      const uploadPostImg = storage.ref(`images/${fileName}`).put(postImage);
      uploadPostImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: postMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("users").doc(user.displayName).collection("posts").add({
        username: user.displayName,
        avatar: user.photoUrl,
        text: postMsg,
        image: "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setPostImage(null);
    setPostMsg("");
    */

    db.collection("users").doc(user.username).collection("posts").add({
      username: user.username,
      avatar: user.photoUrl,
      text: postMsg,
      image: "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setPostMsg("");
  };

  return (
    <>
      <form onSubmit={sendPost}>
        <div className={styles.post_form}>
          <Avatar
            className={styles.post_avatar}
            src={user.photoUrl}
            onClick={async () => {
              //await auth.signOut();
            }}
          />
          <input
            className={styles.post_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={postMsg}
            onChange={(e) => setPostMsg(e.target.value)}
          />
          {/*
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  postImage ? styles.post_addIconLoaded : styles.post_addIcon
                }
              />
              <input
                className={styles.post_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
              */}
        </div>
        <Button
          type="submit"
          disabled={!postMsg}
          className={postMsg ? styles.post_sendBtn : styles.post_sendDisableBtn}
        >
          Post
        </Button>
      </form>
    </>
  );
};

export default PostInput;
