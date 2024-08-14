import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    DocumentData,
  } from "firebase/firestore";
  import { useEffect, useState } from "react";
  import { db } from "../../firebase/firebase";
  
  interface PostItem {
    id: string;
    userId: string;
    [key: string]: any; // This represents other dynamic fields that might be in postItems.
  }
  
  interface User {
    created: number;
    [key: string]: any; // This represents other dynamic fields in the user document.
  }
  
  const useFetch = (collectionName: string) => {
    const [data, setData] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const getDatas = async () => {
        const postRef = query(
          collection(db, collectionName),
          orderBy("created", "desc")
        );
  
        const unsubscribe = onSnapshot(postRef, async (snapshot: QuerySnapshot<DocumentData>) => {
          const postData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postItems: PostItem = { ...doc.data(), id: doc.id };
              const userRef = doc(db, "users", postItems?.userId);
              const getUser = await getDoc(userRef);
  
              if (getUser.exists()) {
                const { created, ...rest } = getUser.data() as User;
                return { ...postItems, ...rest };
              } else {
                return postItems; // Return postItems even if the user document doesn't exist.
              }
            })
          );
          setData(postData);
          setLoading(false);
        });
  
        return () => unsubscribe();
      };
  
      getDatas();
    }, [collectionName]);
  
    return {
      data,
      loading,
    };
  };
  
  export default useFetch;
  