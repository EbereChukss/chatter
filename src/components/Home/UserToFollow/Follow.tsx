import React, { useState } from "react";
import { Blog } from "../../../Context/Context";
import FollowBtn from "./FollowBtn";
import { useNavigate } from "react-router-dom";

// Define the user interface
interface User {
  userId: string;
  username: string;
  bio: string;
  userImg: string;
}

const Follow: React.FC = () => {
  const { currentUser, allUsers } = Blog();
  const [count, setCount] = useState<number>(5);

  // Ensure that currentUser and allUsers are correctly typed and not undefined
  if (!currentUser || !Array.isArray(allUsers)) {
    return <div>Loading...</div>; // Optional loading state
  }

  // Cast allUsers to an array of User if it's not already typed correctly
  const typedUsers = allUsers as User[];

  // Filter out the current user from the list and slice it based on the count
  const users: User[] = typedUsers
    .filter((user: User) => user.userId !== currentUser.uid)
    .slice(0, count);

  const navigate = useNavigate();

  return (
    <>
      {users.map((user) => {
        const { username, bio, userImg, userId } = user;
        return (
          <div key={user.userId} className="flex items-start gap-2 my-4">
            <div
              onClick={() => navigate(`/profile/${userId}`)}
              className="flex-1 flex items-center gap-2 cursor-pointer"
            >
              <img
                className="w-[3rem] h-[3rem] object-cover rounded-full"
                src={userImg}
                alt={username}
              />
              <div className="flex flex-col gap-1">
                <h2 className="font-bold capitalize">{username}</h2>
                <span className="leading-4 text-gray-500 text-sm line-clamp-2">
                  {bio || "This user has no bio"}
                </span>
              </div>
            </div>
            <FollowBtn userId={userId} />
          </div>
        );
      })}
      {typedUsers.length > count && (
        <button
          onClick={() =>
            setCount((prev) => Math.min(prev + 3, typedUsers.length))
          }
          className="mb-3 text-green-900 text-sm hover:underline"
        >
          Load more users
        </button>
      )}
    </>
  );
};

export default Follow;
