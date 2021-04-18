import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  selectUser,
  login,
  logout,
  fetchAsyncGetMyProf,
  setOpenBackdrop,
  selectOpenBackdrop,
} from "./features/user/userSlice";
import { auth } from "./firebase";
import Auth from "./features/auth/Auth";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Feed from "./features/core/Feed";
import SettingUsername from "./features/core/SettingUsername";
import Settings from "./features/core/Settings";
import PostWrapper from "./features/core/PostWrapper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const App: React.FC = () => {
  const user = useSelector(selectUser);
  const openBackdrop = useSelector(selectOpenBackdrop);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        await dispatch(setOpenBackdrop(true));
        await dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
        // TODO. login時、fetchが２回走る
        await dispatch(fetchAsyncGetMyProf(authUser.uid));
        await dispatch(setOpenBackdrop(false));
      } else {
        dispatch(logout());
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      <Backdrop
        className={classes.backdrop}
        open={openBackdrop}
        onClick={() => dispatch(setOpenBackdrop(false))}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Router>
        <Switch>
          <Route exact path="/">
            <Auth />
          </Route>
          <Route exact path="/u/:username" component={Feed} />
          <Route exact path="/p/:username/:postId" component={PostWrapper} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/settings/username" component={SettingUsername} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
