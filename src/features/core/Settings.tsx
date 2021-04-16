import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { db, storage } from "../../firebase";
import firebase from "firebase/app";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectOpenBackdrop,
  setOpenBackdrop,
  editUsername,
  editDisplayName,
  updateUserProfile,
} from "../user/userSlice";
import styles from "./Settings.module.css";
import Header from "./Header";
import Profile from "./Profile";

import {
  Button,
  TextField,
  IconButton,
  Grid,
  CssBaseline,
  Paper,
  makeStyles,
  Box,
  TextareaAutosize,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { setupMaster } from "node:cluster";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(25),
    height: theme.spacing(25),
    cursor: "pointer",
  },
  divider: {
    margin: theme.spacing(2),
    width: theme.spacing(50),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

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
  const classes = useStyles();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [openModal4Err, setOpenModal4Err] = React.useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";

      //updateAvatar();
    }
  };

  const updateAvatar = async () => {
    await dispatch(setOpenBackdrop(true));
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await firebase.auth().currentUser?.updateProfile({
      displayName: user.displayName,
      photoURL: url,
    });
    await dispatch(
      updateUserProfile({
        displayName: user.displayName,
        photoUrl: url,
      })
    );
    await dispatch(setOpenBackdrop(false));
  };

  //Modal.setAppElement("#root");

  return (
    <>
      <Header />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Collapse in={openModal4Err}>
              <Alert severity="error">{errMessage}</Alert>
            </Collapse>

            <Box textAlign="center">
              <Button>
                <label>
                  <Avatar
                    className={classes.avatar}
                    alt={user.username}
                    src={user.photoUrl}
                  />{" "}
                  <input
                    className={styles.login_hiddenIcon}
                    type="file"
                    onChange={onChangeImageHandler}
                  />
                </label>
              </Button>
            </Box>

            <CircularProgress size={68} />
            <Divider className={classes.divider} />

            <TextareaAutosize
              rowsMax={4}
              aria-label="selfIntroduction"
              placeholder=""
              defaultValue=""
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={updateAvatar}
            >
              Update
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Settings;
