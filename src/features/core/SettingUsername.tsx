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
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1617340646579-097994590c97?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80)",
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

const SettingUsername = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const openSettings = useSelector(selectOpenBackdrop);
  const dispatch = useDispatch();
  const history = useHistory();
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [openModal4Err, setOpenModal4Err] = React.useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [username, setUsername] = useState("");

  // bug. ログインしていない状態で誰でもupdateできる
  const updateUsername = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const snapshot = await db
      .collection("profiles")
      .where("username", "==", username)
      .get();
    if (snapshot.size) {
      // 同一ユーザ名が存在した場合
      setErrMessage("This username is already in use by another account.");
      setOpenModal4Err(true);
      return;
    } else {
      //await dispatch(setOpenBackdrop(true));
      await db
        .collection("profiles")
        .doc(user.uid)
        .set({ username: username }, { merge: true })
        .then(() => {
          dispatch(editUsername(username));
          history.push(`/u/${username}`);
        });
      //await dispatch(setOpenBackdrop(false));
    }
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

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (
                  e.target.value.length == 0 ||
                  e.target.value.match(/^[A-z0-9]+$/)
                ) {
                  setOpenModal4Err(false);
                } else {
                  setErrMessage(
                    "使用可能な文字列はアルファベットと数字のみです。"
                  );
                  setOpenModal4Err(true);
                }
                setUsername(e.target.value);
              }}
            />
            <br />
            <br />
            <Button
              disabled={username.length < 1}
              variant="contained"
              color="primary"
              fullWidth
              onClick={updateUsername}
            >
              Update
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default SettingUsername;
