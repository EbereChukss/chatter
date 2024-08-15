import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { readTime } from "../../../utils/helper";
import moment from "moment";
import { useNavigate } from "react-router-dom";

// Define the types for the post and user data
interface Post {
  id: string;
  title: string;
  desc: string;
  created: Date;
  postImg?: string;
  userId: string;
  tags: string[];
}

interface User {
  id: string;
  username: string;
  userImg?: string;
}

interface RecommendedProps {
  post: Post;
}

const Recommended: React.FC<RecommendedProps> = ({ post: singlePost }) => {
  const { data: posts } = useFetch<Post[]>("posts");
  const [commonTags, setCommonTags] = useState<Post[]>([]);

  useEffect(() => {
    let recommendedPosts: Post[] = [];
    posts?.forEach((post) => {
      if (post.id === singlePost.id) {
        return;
      }

      const postTags = post.tags;
      const commonTags = postTags.filter((tag) =>
        singlePost?.tags?.includes(tag)
      );

      if (commonTags.length > 0) {
        recommendedPosts.push({
          ...post,
        });
      }
    });
    recommendedPosts.sort(() => Math.random() - 0.5);
    const minRecommendation = 4;
    const slicedPosts = recommendedPosts.slice(0, minRecommendation);
    setCommonTags(slicedPosts);
  }, [posts, singlePost]);

  return (
    <section className="bg-gray-100">
      <div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
        <h2 className="text-xl font-bold">Recommended from Medium</h2>
        {commonTags.length === 0 ? (
          <p>No recommended posts found based on your preference</p>
        ) : (
          <div className="grid grid-cols-card gap-[2rem] my-[3rem]">
            {commonTags.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommended;

interface PostProps {
  post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { title, desc, created, postImg, id: postId, userId } = post;
  const { data: users } = useFetch<User[]>("users");

  const navigate = useNavigate();

  const user = users?.find((user) => user?.id === userId);
  const username = user?.username;
  const userImg = user?.userImg;

  return (
    <div
      onClick={() => navigate(`/post/${postId}`)}
      className="w-full cursor-pointer"
    >
      {postImg && (
        <img
          className="w-full h-[200px] object-cover"
          src={postImg}
          alt="post-img"
        />
      )}
      <div className="flex items-center gap-1 py-3">
        <img
          className="w-[2rem] h-[2rem] object-cover rounded-full"
          src={userImg}
          alt="user-img"
        />
        <h3 className="text-sm capitalize">{username}</h3>
      </div>
      <h2 className="font-extrabold leading-5 line-clamp-2">{title}</h2>
      <div
        className="line-clamp-2 my-3 text-gray-500 leading-5"
        dangerouslySetInnerHTML={{ __html: desc }}
      />
      <p className="text-sm text-gray-600">
        {readTime({ __html: desc })} min read
        <span className="ml-3">{moment(created).format("MMM DD")}</span>
      </p>
    </div>
  );
};
