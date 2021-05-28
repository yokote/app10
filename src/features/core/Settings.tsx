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
  editSelfIntroduction,
  editDisplayName,
  updateUserProfile,
} from "../user/userSlice";
import styles from "./Settings.module.css";
import Header from "./Header";
import Profile from "./Profile";
import { green } from "@material-ui/core/colors";
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
  FormControl,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
//import { setupMaster } from "node:cluster";

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
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(25),
    height: theme.spacing(25),
    cursor: "pointer",
  },
  wrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  selfIntroduction: {
    width: theme.spacing(40),
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const createObjectURL = (window as any).webkitURL.createObjectURL;
const Settings = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [openModal4Err, setOpenModal4Err] = React.useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState();
  //const [displayName, setDisplayName] = useState(user.displayName);
  //const [selfIntroduction, setSelfIntroduction] = useState("");

  const updateDisplayName = () => {
    firebase
      .auth()
      .currentUser?.updateProfile({
        displayName: user.displayName,
      })
      .then(() => {
        //dispatch(editDisplayName(displayName));
      });
  };

  const updateSelfIntroduction = () => {
    db.collection("profiles")
      .doc(user.username)
      .set({ selfIntroduction: user.selfIntroduction }, { merge: true })
      .then(() => {
        //dispatch(editSelfIntroduction(selfIntroduction));
      });
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      setAvatarSrc(createObjectURL(e.target.files![0]));
      e.target.value = "";

      //updateAvatar();
    }
  };

  const updateAvatar = async () => {
    //await dispatch(setOpenBackdrop(true));
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
    //await dispatch(setOpenBackdrop(false));
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
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs>
                <Box textAlign="center">
                  <Button>
                    <label>
                      <Avatar
                        className={classes.avatar}
                        alt={user.username}
                        src={avatarSrc || user.photoUrl}
                      />{" "}
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      await setUpdating(true);
                      await updateAvatar();
                      await setUpdating(false);
                    }}
                  >
                    Update
                  </Button>
                  {updating && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </Grid>{" "}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs>
                <Divider className={classes.divider} />
              </Grid>
            </Grid>

            <Collapse in={openModal4Err}>
              <Alert severity="error">{errMessage}</Alert>
            </Collapse>

            <Grid container spacing={10} justify="center" alignItems="center">
              <Grid item xs>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="displayName"
                  label="名前"
                  name="displayName"
                  autoComplete="displayName"
                  value={user.displayName}
                  //defaultValue={user.displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(editDisplayName(e.target.value));
                  }}
                />
              </Grid>{" "}
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={async () => {
                    await setUpdating(true);
                    await updateDisplayName();
                    await setUpdating(false);
                  }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={10} justify="center" alignItems="center">
              <Grid item xs className={classes.selfIntroduction}>
                <TextField
                  id="selfIntroduction"
                  variant="outlined"
                  label="自己紹介"
                  multiline
                  fullWidth
                  rows={3}
                  value={user.selfIntroduction}
                  //defaultValue={user.selfIntroduction}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //setSelfIntroduction(e.target.value);
                    dispatch(editSelfIntroduction(e.target.value));
                  }}
                />
              </Grid>{" "}
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={async () => {
                    await setUpdating(true);
                    await updateSelfIntroduction();
                    await setUpdating(false);
                  }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Settings;
