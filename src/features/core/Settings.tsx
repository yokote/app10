import React, { useState } from "react";
import Modal from "react-modal";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectOpenSettings,
  resetOpenSettings,
  editDisplayName,
} from "../user/userSlice";
import styles from "./Settings.module.css";

import Profile from "./Profile";

import { Button, TextField, IconButton } from "@material-ui/core";
//import { MdAddAPhoto } from "react-icons/md";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const Settings = () => {
  const user = useSelector(selectUser);
  const openSettings = useSelector(selectOpenSettings);
  const dispatch = useDispatch();

  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    //const packet = { id: profile.id, nickName: profile.nickName, img: image };
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  return (
    <Modal
      isOpen={openSettings}
      onRequestClose={async () => {
        await dispatch(resetOpenSettings());
      }}
      style={customStyles}
    >
      <form className={styles.core_signUp}>
        <h3 className={styles.core_title}>Profile</h3>

        <br />

        {/* bug. usernameをまだ作っていないのでURLと一致しない */}
        <TextField
          placeholder="displayName"
          type="text"
          value={user?.displayName}
          onChange={(e) => dispatch(editDisplayName(e.target.value))}
        />

        <input
          type="file"
          id="imageInput"
          hidden={true}
          onChange={(e) => setImage(e.target.files![0])}
        />
        <br />
        <IconButton onClick={handlerEditPicture}>
          {user.photoUrl ? (
            <Avatar aria-label="recipe" src={user.photoUrl} />
          ) : (
            <AccountCircleIcon fontSize="large" />
          )}
        </IconButton>
        <br />
        <Button
          disabled={!user?.displayName}
          variant="contained"
          color="primary"
          type="submit"
          onClick={updateProfile}
        >
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default Settings;
