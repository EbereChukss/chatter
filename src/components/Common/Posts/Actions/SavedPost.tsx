import React, { useEffect, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";

interface Post {
  id: string;
  userId: string;
  // Add other post fields if needed
}

interface SavedPostProps {
  post: Post;
}

// Define the types for the Blog context
interface BlogContext {
  currentUser: { uid: string } | null;
  setAuthModel: (show: boolean) => void;
}

const SavedPost: React.FC<SavedPostProps> = ({ post }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { currentUser, setAuthModel } = Blog() as BlogContext;
  const { data } = useSingleFetch("users", post.userId, "savePost");

  useEffect(() => {
    setIsSaved(
      data?.find((item) => item.id === currentUser?.uid) !== undefined
    );
  }, [data, currentUser?.uid, post.id]);

  const handleSave = async () => {
    try {
      if (currentUser) {
        const saveRef = doc(db, "users", currentUser.uid, "savePost", post.id);

        if (isSaved) {
          await deleteDoc(saveRef);
          toast.success("Post has been unsaved");
        } else {
          await setDoc(saveRef, {
            ...post,
          });
          toast.success("Post has been saved");
        }
        // Update the local state after the operation
        setIsSaved(!isSaved);
      } else {
        setAuthModel(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <button onClick={handleSave} className="hover:opacity-60">
        <CiSaveDown2
          className={`text-2xl pointer-events-none ${isSaved ? "text-yellow-600" : ""}`}
        />
      </button>
    </div>
  );
};

export default SavedPost;
