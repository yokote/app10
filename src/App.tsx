import React, {useEffect} from 'react';
import styles from './App.module.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/user/userSlice";
import { auth } from "./firebase";
import Auth from "./features/auth/Auth";
import Header from "./features/core/Header";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Core from './features/core/Core';
import APost from './features/anonymous/Post';

const App: React.FC = () => {
  const user=useSelector(selectUser)
  const dispatch = useDispatch()
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
        {user.uid ? (
          <>
          <Header />
          <div className={styles.app}>
           <Core />
          </div>
          </>
      ) : (
        <Auth />
      )}
        </Route>
        <Route path='/u/:username' component={APost} />
      </Switch>
    </Router>
  );
}

export default App;