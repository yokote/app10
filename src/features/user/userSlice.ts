import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { db } from "../../firebase";

interface USER {
  displayName: string;
  photoUrl: string;
}

interface MYPROFILE {
  username: "";
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
          api.dispatch(setOpenSettings(true));
          return { username: "" };
        }
      });
    /*
      .catch(() => {
        return api.rejectWithValue({
          status: -1,
          message: "error",
        });
      });
      */
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
      openSettings: false,
      username: "",
    },
    profile: {
      userProfile: "",
      displayName: "",
      photoUrl: "",
    },
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
        openSettings: false,
        username: "",
      };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    setOpenSettings(state, action) {
      state.user.openSettings = action.payload;
    },
    editUsername(state, action) {
      state.user.username = action.payload;
    },
    editDisplayName(state, action) {
      state.user.displayName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.user.username = action.payload.username;
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
  setOpenSettings,
  editDisplayName,
  editUsername,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectOpenSettings = (state: RootState) =>
  state.user.user.openSettings;

export default userSlice.reducer;
