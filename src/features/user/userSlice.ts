import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { db } from "../../firebase";

interface USER {
  displayName: string;
  photoUrl: string;
}

interface MYPROFILE {
  username: "";
  selfIntroduction: "";
}

interface PROFILE {
  userProfile: "";
  displayName: "";
  photoUrl: "";
}

export const fetchAsyncGetMyProf = createAsyncThunk(
  "myProfile",
  async (uid: string, api) => {
    return await db
      .collection("profiles")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          return snapshot.data() as MYPROFILE;
        } else {
          //api.dispatch(setOpenSettings(true));
          return { username: "", selfIntroduction: "" };
        }
      });
  }
);

export const fetchAsyncGetProf = createAsyncThunk("taUser", async () => {
  const snapshot = db.collection("profiles").doc("user1").get();
  return (await snapshot).data() as PROFILE;
  /*
  return {
    userProfile: "taUser",
    displayName: "ta  User",
    photoUrl: "",
  };
  */
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      uid: "",
      photoUrl: "",
      displayName: "",
      username: "",
      selfIntroduction: "",
    },
    profile: {
      userProfile: "",
      displayName: "",
      photoUrl: "",
    },
    openBackdrop: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {
        uid: "",
        photoUrl: "",
        displayName: "",
        username: "",
        selfIntroduction: "",
      };
      state.openBackdrop = false;
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    setOpenBackdrop(state, action) {
      state.openBackdrop = action.payload;
    },
    editUsername(state, action) {
      state.user.username = action.payload;
    },
    editDisplayName(state, action) {
      state.user.displayName = action.payload;
    },
    editSelfIntroduction(state, action) {
      state.user.selfIntroduction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.user.username = action.payload.username;
      state.user.selfIntroduction = action.payload.selfIntroduction;
    });
    builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const {
  login,
  logout,
  updateUserProfile,
  setOpenBackdrop,
  editDisplayName,
  editUsername,
  editSelfIntroduction,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectOpenBackdrop = (state: RootState) => state.user.openBackdrop;

export default userSlice.reducer;
