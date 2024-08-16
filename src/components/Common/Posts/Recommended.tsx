import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { readTime } from "../../../utils/Helper";
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

interface PostItem {
  id: string;
  title: string;
  desc: string;
  created: string; // Assuming this might come as a string from the backend
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
  const { data: postItems } = useFetch<PostItem[]>("posts");
  const [commonTags, setCommonTags] = useState<Post[]>([]);

  useEffect(() => {
    if (!postItems) return;

    const recommendedPosts: Post[] = postItems
      .filter((postItem) => postItem.id !== singlePost.id)
      .map((postItem) => ({
        id: postItem.id,
        title: postItem.title,
        desc: postItem.desc,
        created: new Date(postItem.created), // Convert string to Date if needed
        postImg: postItem.postImg,
        userId: postItem.userId,
        tags: postItem.tags,
      }))
      .filter((post) =>
        post.tags.some((tag: string) => singlePost.tags.includes(tag)) // Explicitly type `tag`
      );

    recommendedPosts.sort(() => Math.random() - 0.5);

    const minRecommendation = 4;
    setCommonTags(recommendedPosts.slice(0, minRecommendation));
  }, [postItems, singlePost]);

  return (
    <section className="bg-gray-100">
      <div className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
        <h2 className="text-xl font-bold">Recommended from Medium</h2>
        {commonTags.length === 0 ? (
          <p>No recommended posts found based on your preference</p>
        ) : (
          <div className="grid grid-cols-card gap-[2rem] my-[3rem]">
            {commonTags.map((post) => (
              <PostComponent post={post} key={post.id} />
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

const PostComponent: React.FC<PostProps> = ({ post }) => {
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
