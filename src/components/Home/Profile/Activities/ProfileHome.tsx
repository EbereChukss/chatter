import React from "react";
import Loading from "../../../Loading/Loading";
import PostsCard from "../../../Common/Posts/PostsCard";
import { Blog } from "../../../../Context/Context";

// Define the properties expected for a post
interface Post {
  title: string;
  desc: string;
  created: string; // or Date if using Date type
  id: string;
  userId: string;
  username: string;
}

// Define prop types for ProfileHome
interface ProfileHomeProps {
  getUserData: {
    userId: string;
    username: string;
  };
}

// Define the ProfileHome component
const ProfileHome: React.FC<ProfileHomeProps> = ({ getUserData }) => {
  // Retrieve post data and loading state from context
  const { postData, postLoading } = Blog() as {
    postData: Post[];
    postLoading: boolean;
  };

  // Filter posts to only include those belonging to the current user
  const userPosts =
    postData && postData.filter((post) => post.userId === getUserData.userId);

  return (
    <div className="flex flex-col gap-5 mb-[4rem]">
      {/* Display message if user has no posts */}
      {userPosts.length === 0 && (
        <p className="text-gray-500">
          <span className="capitalize">{getUserData.username}</span> has no posts
        </p>
      )}
      {/* Display loading spinner while posts are loading */}
      {postLoading ? (
        <Loading />
      ) : (
        userPosts &&
        userPosts.map((post) => (
          <PostsCard post={post} key={post.id} /> // Use post.id as key for better React performance
        ))
      )}
    </div>
  );
};

export default ProfileHome;
