import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  login,
  logout,
  fetchAsyncGetMyProf,
  setOpenSettings,
} from "./features/user/userSlice";
import { auth } from "./firebase";
import Auth from "./features/auth/Auth";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Core from "./features/core/Core";
import Settings from "./features/core/Settings";
import PostWrapper from "./features/core/PostWrapper";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
        dispatch(fetchAsyncGetMyProf(authUser.uid));
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Auth />
        </Route>
        <Route exact path="/u/:username" component={Core} />
        <Route exact path="/p/:username/:postId" component={PostWrapper} />
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </Router>
  );
};
/*
          TODO. space & unique
          {user?.username && <Redirect to={`/u/${user.username}`} />}
          {!user?.username && dispatch(setOpenSettings(true))}

*/
export default App;
