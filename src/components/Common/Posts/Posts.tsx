import React from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";

// Define the shape of a single post
interface Post {
  title: string;
  desc: string;
  postImg?: string;
  username: string;
  created: Date;
  userImg?: string;
  userId: string;
  id: string;
  tags?: string[]; // Add this if tags are optional
}

const Posts: React.FC = () => {
  const { postData, postLoading } = Blog();

  return (
    <section className="flex flex-col gap-[2.5rem]">
      {postLoading ? (
        <Loading />
      ) : (
        postData &&
        postData.map((post: Post, i: number) => <PostsCard post={post} key={i} />)
      )}
    </section>
  );
};

export default Posts;
