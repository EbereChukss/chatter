import React from "react";
import { Blog } from "../../../../Context/Context";

// Define prop types
interface ProfileAboutProps {
  getUserData: {
    bio?: string;
    username: string;
    userId: string;
  };
  setEditModal: (value: boolean) => void;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ getUserData, setEditModal }) => {
  const { currentUser } = Blog() as { currentUser: { uid: string } | null };

  return (
    <div className="w-full">
      <p className="text-2xl first-letter:uppercase">
        {getUserData?.bio || `${getUserData?.username} has no bio`}
      </p>
      <div className="text-right">
        {currentUser?.uid === getUserData.userId && (
          <button
            onClick={() => setEditModal(true)}
            className="border border-black py-2 px-5 rounded-full text-black mt-[3rem]"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileAbout;
