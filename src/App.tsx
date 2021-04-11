import React, {useEffect} from 'react';
import styles from './App.module.css';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/user/userSlice";
import { auth } from "./firebase";
import Auth from "./features/auth/Auth";
//import Feed from "./components/Feed";
//import User from "./components/Users";

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
    <>
      {user.uid ? (
        <div className={styles.app}>
          foo
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;