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

export const onUsersPostCreate = functions.firestore
  .document("/users/{username}/posts/{postId}")
  .onCreate(async (snapshot, context) => {
    await copyToRootWithUsersPostSnapshot(snapshot, context);
  });

async function copyToRootWithUsersPostSnapshot(
  snapshot: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext
) {
  const postId = snapshot.id;
  //const username = context.params.username;
  const post = snapshot.data() as Post;
  await firestore.collection("posts").doc(postId).set(post, { merge: true });
}
