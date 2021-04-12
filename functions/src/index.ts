import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

interface Post {
  readonly username: string;
  readonly avatar: string;
  readonly text: string;
  readonly image: string;
  readonly timestamp: number;
}
/*
interface RootPost extends Post {
  username?: string;
}
*/

export const onUsersPostCreate = functions.firestore
  .document("/users/{username}/posts/{postId}")
  .onCreate(async (snapshot, context) => {
    await copyToRootWithUsersPostSnapshot(snapshot, context);
  });
/*
export const onUsersPostUpdate = functions.firestore
  .document("/users/{username}/posts/{postId}")
  .onUpdate(async (change, context) => {
    await copyToRootWithUsersPostSnapshot(change.after, context);
  });
*/
async function copyToRootWithUsersPostSnapshot(
  snapshot: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext
) {
  const postId = snapshot.id;
  //const username = context.params.username;
  //const post = snapshot.data() as RootPost;
  //post.username = firestore.collection("users").doc(username);
  const post = snapshot.data() as Post;
  //const post = snapshot.data();
  //post.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  await firestore.collection("posts").doc(postId).set(post, { merge: true });
}
