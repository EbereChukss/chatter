import React, { useState } from "react";
import DropDown from "../../../../utils/DropDown";
import { CiShare1 } from "react-icons/ci";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import {
  BiLink,
  BiLogoFacebookCircle,
  BiLogoTwitter,
  BiLogoLinkedinSquare,
} from "react-icons/bi";
import { toast } from "react-toastify";

// Define the types for Button props
interface ButtonProps {
  click?: () => void;
  icon: React.ReactNode;
  title: string;
}

const SharePost: React.FC = () => {
  const [showDrop, setShowDrop] = useState<boolean>(false);
  const path = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(path);
      toast.success("Link has been copied");
      setShowDrop(false);
    } catch (error) {
      toast.error((error as Error).message);
      setShowDrop(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setShowDrop(!showDrop)}>
        <CiShare1 className="text-2xl" />
      </button>
      <DropDown showDrop={showDrop} setShowDrop={setShowDrop} size="w-[12rem]">
        <Button click={copyLink} title="Copy Link" icon={<BiLink />} />
        <TwitterShareButton url={path}>
          <Button title="Share On Twitter" icon={<BiLogoTwitter />} />
        </TwitterShareButton>
        <FacebookShareButton url={path}>
          <Button title="Share On Facebook" icon={<BiLogoFacebookCircle />} />
        </FacebookShareButton>
        <LinkedinShareButton url={path}>
          <Button title="Share On LinkedIn" icon={<BiLogoLinkedinSquare />} />
        </LinkedinShareButton>
      </DropDown>
    </div>
  );
};

export default SharePost;

const Button: React.FC<ButtonProps> = ({ click, icon, title }) => {
  return (
    <button
      onClick={click}
      className="p-2 hover:bg-gray-200 hover:text-black/80 w-full text-sm text-left flex items-center gap-2 cursor-pointer text-gray-500"
    >
      <span className="text-[1.2rem]">{icon}</span>
      {title}
    </button>
  );
};
