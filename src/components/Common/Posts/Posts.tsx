import React from "react";
import Loading from "../../Loading/Loading";
import PostsCard from "./PostsCard";
import { Blog } from "../../../Context/Context";

// Define the shape of a single post
interface Post {
  title: string;
  desc: string;
  created: Date;
  postImg?: string;
  id: string;
  userId: string;
  username: string;
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
