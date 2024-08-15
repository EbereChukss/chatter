import React from "react";
import { FaRegComment } from "react-icons/fa";
import { Blog } from "../../../../Context/Context";
import { formatNum } from "../../../../utils/Helper";

// Define the types for the Blog context
interface BlogContext {
  setShowComment: (show: boolean) => void;
  commentLength: number;
}

const Comment: React.FC = () => {
  const { setShowComment, commentLength } = Blog() as BlogContext;

  return (
    <button
      onClick={() => setShowComment(true)}
      className="flex items-center gap-1 text-sm"
    >
      <FaRegComment className="text-lg" />
      <span>{formatNum(commentLength)}</span>
    </button>
  );
};

export default Comment;
