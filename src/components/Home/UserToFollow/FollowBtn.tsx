import React, { useEffect, useState } from "react";
import { Blog } from "../../../Context/Context";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import useSingleFetch from "../../hooks/useSingleFetch";
import { useLocation } from "react-router-dom";

// Define the props interface
interface FollowBtnProps {
  userId: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({ userId }) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const { currentUser } = Blog();

  // Fetch the data related to follows
  const { data, loading } = useSingleFetch("users", currentUser?.uid, "follows");

  useEffect(() => {
    if (data) {
      setIsFollowed(data.findIndex((item: { id: string }) => item.id === userId) !== -1);
    }
  }, [data, userId]);

  const handleFollow = async () => {
    try {
      if (currentUser) {
        const followRef = doc(db, "users", currentUser?.uid, "follows", userId);
        const followerRef = doc(db, "users", userId, "followers", currentUser?.uid);

        if (isFollowed) {
          await deleteDoc(followRef);
          await deleteDoc(followerRef);
          toast.success("User is unfollowed");
        } else {
          await setDoc(followRef, {
            userId: userId,
          });
          await setDoc(followerRef, {
            userId: currentUser.uid,
          });
          toast.success("User is followed");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { pathname } = useLocation();

  return (
    <button
      onClick={handleFollow}
      className={`${
        pathname === "/" ? "border border-black" : ""
      } px-3 py-[0.2rem] rounded-full ${
        isFollowed ? "text-gray-500 border-none" : ""
      }`}
    >
      {isFollowed ? "Following" : "Follow"}
    </button>
  );
};

export default FollowBtn;
