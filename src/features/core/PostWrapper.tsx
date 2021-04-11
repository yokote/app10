import React from "react";

interface PROPS {
  postId: string;
}

const PostWrapper: React.FC<PROPS> = (props) => {
  /*
    CollectionReferenceのdocメソッド の引数で、ドキュメントIDを指定することもできます
    const userRef = db.collection('users').doc('abcdefg')
    await userRef.set({
      name1: 'xxxxx',
      name2: 'yyyyy',
    })

*/
  return <div>test</div>;
};

export default PostWrapper;
