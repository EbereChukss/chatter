import React, { useEffect, useState } from "react";
import { PiHandsClappingDuotone } from "react-icons/pi";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";
import useSingleFetch from "../../../hooks/useSingleFetch";
import { formatNum } from "../../../../utils/Helper";


// Define the types for the Blog context
interface BlogContext {
  currentUser: { uid: string } | null;
  setAuthModel: (show: boolean) => void;
}

interface LikeProps {
  postId: string;
}

const Like: React.FC<LikeProps> = ({ postId }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { currentUser, setAuthModel } = Blog() as BlogContext;

  const { data } = useSingleFetch("posts", postId, "likes");

  useEffect(() => {
    setIsLiked(
      data && data.some((item) => item.id === currentUser?.uid)
    );
  }, [data, currentUser?.uid]);

  const handleLike = async () => {
    try {
      if (currentUser) {
        const likeRef = doc(db, "posts", postId, "likes", currentUser.uid);
        if (isLiked) {
          await deleteDoc(likeRef);
        } else {
          await setDoc(likeRef, {
            userId: currentUser.uid,
          });
        }
        // Update the local state after the operation
        setIsLiked(!isLiked);
      } else {
        setAuthModel(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-1 text-sm">
      <PiHandsClappingDuotone
        className={`text-xl ${isLiked ? "text-black" : "text-gray-500"}`}
      />
      <span>{formatNum(data?.length)}</span>
    </button>
  );
};

export default Like;
