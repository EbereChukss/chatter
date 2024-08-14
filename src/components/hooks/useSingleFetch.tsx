import { collection, onSnapshot, query, QuerySnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";

interface FetchedData {
  id: string;
  [key: string]: any; // Represents any additional dynamic fields in the document data.
}

const useSingleFetch = (
  collectionName: string,
  id: string | undefined,
  subCol: string
) => {
  const [data, setData] = useState<FetchedData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSingleData = () => {
      if (id) {
        const postRef = query(collection(db, collectionName, id, subCol));
        onSnapshot(postRef, (snapshot: QuerySnapshot<DocumentData>) => {
          const fetchedData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setData(fetchedData);
          setLoading(false);
        });
      }
    };
    getSingleData();
  }, [id, collectionName, subCol]);

  return {
    data,
    loading,
  };
};

export default useSingleFetch;
