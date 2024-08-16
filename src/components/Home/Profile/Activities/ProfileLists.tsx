import React from "react";
import useSingleFetch from "../../../hooks/useSingleFetch";
import { Blog } from "../../../../Context/Context";
import Loading from "../../../Loading/Loading";
import PostsCard from "../../../Common/Posts/PostsCard";
import { BiLock } from "react-icons/bi";

// Define the Post interface explicitly
interface Post {
  id: string;
  title?: string;
  desc?: {
    __html: string;
  };
  created?: number;
  userId: string;
  username: string;
}

// Define prop types
interface ProfileListsProps {
  getUserData: {
    userId: string;
    username: string;
  };
}

interface PrivateListsProps {
  username: string;
}

const ProfileLists: React.FC<ProfileListsProps> = ({ getUserData }) => {
  const { currentUser } = Blog() as { currentUser: { uid: string } | null };
  
  // Ensure the hook supports generic typing
  const { data, loading } = useSingleFetch<Post[]>(
    "users",
    currentUser?.uid,
    "savePost"
  ) as { data: Post[]; loading: boolean };

  return (
    <div>
      {currentUser && currentUser?.uid === getUserData?.userId ? (
        <div className="flex flex-col gap-[2rem] mb-[2rem]">
          {data && data.length === 0 && (
            <p className="text-gray-500">
              <span className="capitalize mr-1">{getUserData?.username}</span>{" "}
              has no saved post
            </p>
          )}
          {loading ? (
            <Loading />
          ) : (
            data && data.map((post, i) => <PostsCard post={post} key={i} />)
          )}
        </div>
      ) : (
        <PrivateLists username={getUserData?.username} />
      )}
    </div>
  );
};

export default ProfileLists;

const PrivateLists: React.FC<PrivateListsProps> = ({ username }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-[3rem] text-center">
      <p>
        <span className="capitalize">{username} saved posts are private</span>
      </p>
      <span className="text-[10rem] text-gray-500">
        <BiLock />
      </span>
    </div>
  );
};
