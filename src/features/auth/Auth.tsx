import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  updateUserProfile,
  setOpenSettings,
  selectUser,
  login,
  fetchAsyncGetMyProf,
  editUsername,
} from "../user/userSlice";
import { auth, provider, storage, db } from "../../firebase";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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

interface MYPROFILE {
  username: "";
}

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [openModal4Err, setOpenModal4Err] = React.useState(false);
  const [errMessage, setErrMessage] = useState("");

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };
  /*
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };
*/
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };
  const signInEmail = async () => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const profile = await db
          .collection("profiles")
          .doc(userCredential.user!.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              return snapshot.data() as MYPROFILE;
            } else {
              return { username: "" };
            }
          });
        if (profile.username) {
          dispatch(editUsername(profile.username));
          history.push(`/u/${profile.username}`);
        } else {
          history.push("/settings");
        }
      });
  };
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);

    await authUser.user?.updateProfile({
      displayName: displayName,
      photoURL: "",
    });

    dispatch(
      updateUserProfile({
        displayName: displayName,
        photoUrl: "",
      })
    );

    history.push("/settings");
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>

          <Collapse in={openModal4Err}>
            <Alert severity="error">{errMessage}</Alert>
          </Collapse>
          {!isLogin && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                name="displayName"
                autoComplete="displayName"
                autoFocus
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDisplayName(e.target.value);
                }}
              />
              {/*
              <Box textAlign="center">
                <IconButton>
                  <label>
                    <AccountCircleIcon
                      fontSize="large"
                      className={
                        avatarImage
                          ? styles.login_addIconLoaded
                          : styles.login_addIcon
                      }
                    />
                    <input
                      className={styles.login_hiddenIcon}
                      type="file"
                      onChange={onChangeImageHandler}
                    />
                  </label>
                </IconButton>
              </Box>
                    */}
            </>
          )}
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              disabled={
                isLogin
                  ? !email || password.length < 1
                  : !displayName || !email || password.length < 1
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<EmailIcon />}
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail();
                      } catch (err) {
                        setErrMessage(err.message);
                        setOpenModal4Err(true);
                        //alert(err.message);
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail();
                      } catch (err) {
                        setErrMessage(err.message);
                        setOpenModal4Err(true);
                      }
                    }
              }
            >
              {isLogin ? "Login" : "Register"}
            </Button>

            <Grid container>
              <Grid item xs>
                <span
                  className={styles.login_reset}
                  onClick={() => setOpenModal(true)}
                >
                  Forgot password ?
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Create new account ?" : "Back to login"}
                </span>
              </Grid>
            </Grid>
            {/*
            <Button
              fullWidth
              variant="contained"
              color="default"
              className={classes.submit}
              startIcon={<CameraIcon />}
              onClick={signInGoogle}
            >
              SignIn with Google
            </Button>
*/}
          </form>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
