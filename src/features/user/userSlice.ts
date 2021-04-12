import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { db } from "../../firebase";

/*
export const fetchAsyncGetMyProf = createAsyncThunk("aaaaaaaa", async () => {
  const promise = db
    .collection("notes")
    .get()
    .then((snapshot) => {
      const data = [];
      // assign data
      return data;
    });

  const data = await promise;
  return data;
});
*/
interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      uid: "",
      photoUrl: "",
      displayName: "",
      openSettings: false,
    } /*
    profiles: [
      {
        id: 0,
        userProfile: 0,
        displayName: "",
        photoUrl: "",
      },
    ],*/,
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
      };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    setOpenSettings(state) {
      state.user.openSettings = true;
    },
    resetOpenSettings(state) {
      state.user.openSettings = false;
    },
    editDisplayName(state, action) {
      state.user.displayName = action.payload;
    },
  } /*
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      // uidが必要？
      state.user.myProfile = action.payload;
    });
  },*/,
});

export const {
  login,
  logout,
  updateUserProfile,
  setOpenSettings,
  resetOpenSettings,
  editDisplayName,
} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectOpenSettings = (state: RootState) =>
  state.user.user.openSettings;

export default userSlice.reducer;
