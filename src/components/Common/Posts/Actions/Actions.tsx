import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import DropDown from "../../../../utils/DropDown";
import { useNavigate } from "react-router-dom";
import { Blog } from "../../../../Context/Context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";

// Define the prop types
interface ActionsProps {
  postId: string;
  title: string;
  desc: string;
}

const Actions: React.FC<ActionsProps> = ({ postId, title, desc }) => {
  const { setUpdateData, currentUser } = Blog();
  const [showDrop, setShowDrop] = useState(false);

  const handleClick = () => {
    setShowDrop(!showDrop);
  };

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editPost/${postId}`);
    setUpdateData({ title, description: desc });
  };

  const handleRemove = async () => {
    if (!currentUser || !currentUser.uid) {
      toast.error("You must be logged in to delete a post.");
      return;
    }

    try {
      const ref = doc(db, "posts", postId);
      const likeRef = doc(db, "posts", postId, "likes", currentUser.uid);
      const commentRef = doc(db, "posts", postId, "comments", currentUser.uid);
      const savedPostRef = doc(db, "users", currentUser.uid, "savedPost", postId);

      await deleteDoc(ref);
      await deleteDoc(likeRef);
      await deleteDoc(commentRef);
      await deleteDoc(savedPostRef);

      toast.success("Post has been removed");
      setShowDrop(false);
      navigate("/");
    } catch (error) {
      toast.error((error as Error).message || "An error occurred while deleting the post.");
    }
  };

  return (
    <div className="relative">
      <button onClick={handleClick}>
        <BsThreeDots className="text-2xl" />
      </button>
      <DropDown showDrop={showDrop} setShowDrop={setShowDrop} size="w-[7rem]">
        <Button click={handleEdit} title="Edit Story" />
        <Button click={handleRemove} title="Delete Story" />
      </DropDown>
    </div>
  );
};

export default Actions;

// Define the prop types for the Button component
interface ButtonProps {
  click: () => void;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ click, title }) => {
  return (
    <button
      onClick={click}
      className={`p-2 hover:bg-gray-100 hover:text-black/80 w-full text-sm text-left
    ${title === "Delete Story" ? "text-red-600" : ""}
    `}
    >
      {title}
    </button>
  );
};
