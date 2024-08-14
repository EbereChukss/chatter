import React from "react";
import Loading from "../../../Loading/Loading";
import PostsCard from "../../../Common/Posts/PostsCard";
import { Blog } from "../../../../Context/Context";

// Define prop types
interface ProfileHomeProps {
  getUserData: {
    userId: string;
    username: string;
  };
}

interface Post {
  userId: string;
  [key: string]: any; // for other post properties
}

const ProfileHome: React.FC<ProfileHomeProps> = ({ getUserData }) => {
  const { postData, postLoading } = Blog() as {
    postData: Post[];
    postLoading: boolean;
  };

  const userPost =
    postData &&
    postData.filter((post) => post?.userId === getUserData?.userId);

  return (
    <div className="flex flex-col gap-5 mb-[4rem]">
      {userPost.length === 0 && (
        <p className="text-gray-500">
          <span className="capitalize">{getUserData?.username}</span> has no
          posts
        </p>
      )}
      {postLoading ? (
        <Loading />
      ) : (
        userPost &&
        userPost.map((post, i) => <PostsCard post={post} key={i} />)
      )}
    </div>
  );
};

export default ProfileHome;
