import React, { useEffect, useState } from "react";
import Modal from "../../../utils/Modal";
import { LiaTimesSolid } from "react-icons/lia";
import { Blog } from "../../../Context/Context";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import useSingleFetch from "../../hooks/useSingleFetch";
import Loading from "../../Loading/Loading";
import Comment from "./Comment";

// Define the types for the component props and state
interface CommentsProps {
  postId: string;
}

interface CommentData {
  id: string;
  userId: string;
  commentText: string;
  created: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const {
    currentUser,
    allUsers,
    showComment,
    setShowComment,
    setCommentLength,
  } = Blog();

  const [comment, setComment] = useState<string>("");

  const getUserData = allUsers.find((user) => user.id === currentUser?.uid);

  // Ensure correct typing here
  const { data, loading } = useSingleFetch<CommentData>({
    collectionPath: "posts",
    docId: postId,
    subCollectionPath: "comments",
  });

  const writeComment = async () => {
    try {
      if (comment.trim() === "") {
        toast.error("The input must be filled.");
        return;
      }

      const commentRef = collection(db, "posts", postId, "comments");
      await addDoc(commentRef, {
        commentText: comment,
        created: Date.now(),
        userId: currentUser?.uid || "", // Handle possible undefined
      });
      toast.success("Comment has been added");
      setComment("");
    } catch (error) {
      const typedError = error as Error; // Use Error type to access message safely
      toast.error(typedError.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    if (data) {
      setCommentLength(data.length);
    }
  }, [data, setCommentLength]);

  return (
    <Modal setModal={setShowComment} modal={showComment}>
      <section
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white w-[22rem] shadow-md p-5
        overflow-y-auto transition-all duration-500
        ${showComment ? "translate-x-0" : "translate-x-[23rem]"}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Responses({data ? data.length : 0})</h3>
          <button onClick={() => setShowComment(false)} className="text-xl">
            <LiaTimesSolid />
          </button>
        </div>
        {/* Comment form */}
        {currentUser && (
          <div className="shadow-md p-3 my-5 overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
              <img
                className="w-[2rem] h-[2rem] object-cover rounded-full"
                src={getUserData?.userImg || "/profile.jpg"}
                alt="user-img"
              />
              <h3 className="capitalize text-sm">{getUserData?.username}</h3>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full outline-none resize-none text-sm border px-2 pt-4"
            />
            <div className="flex items-center justify-end gap-4 mt-[1rem]">
              <button onClick={() => setComment("")} className="text-sm">
                Cancel
              </button>
              <button
                onClick={writeComment}
                className="btn !text-xs !bg-green-700 !text-white !rounded-full"
              >
                Response
              </button>
            </div>
          </div>
        )}
        {data && data.length === 0 ? (
          <p>This post has no comments</p>
        ) : (
          <div className="border-t py-4 mt-8 flex flex-col gap-8">
            {loading ? (
              <Loading />
            ) : (
              data.map((item: CommentData) => (
                <Comment item={item} postId={postId} key={item.id} />
              ))
            )}
          </div>
        )}
      </section>
    </Modal>
  );
};

export default Comments;
