import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import { Blog } from "../../../Context/Context";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";
import { readTime } from "../../../utils/helper";
import moment from "moment";
import Actions from "../Posts/Actions/Actions";
import Like from "./Actions/Like";
import Comment from "./Actions/Comment";
import SharePost from "./Actions/SharePost";
import SavedPost from "../Posts/Actions/SavedPost";
import Recommended from "./Recommended";
import Comments from "../Comments/Comments";

// Define the types for the post and user data
interface Post {
  title: string;
  desc: string;
  postImg?: string;
  username: string;
  created: Date;
  userImg?: string;
  userId: string;
  id: string;
}

const SinglePost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = Blog();

  // Increment page views
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      const incrementPageView = async () => {
        try {
          const ref = doc(db, "posts", postId as string);
          await updateDoc(
            ref,
            {
              pageViews: increment(1),
            },
            { merge: true }
          );
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      incrementPageView();
    }
    isInitialRender.current = false;
  }, [postId]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", postId as string);
        const getPost = await getDoc(postRef);

        if (getPost.exists()) {
          const postData = getPost.data() as Post;
          if (postData?.userId) {
            const userRef = doc(db, "users", postData.userId);
            const getUser = await getDoc(userRef);

            if (getUser.exists()) {
              const userData = getUser.data();
              setPost({ ...postData, ...userData, id: postId as string });
            }
          }
        }
        setLoading(false);
      } catch (error: any) {
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <section className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
            <h2 className="text-4xl font-extrabold capitalize">{post?.title}</h2>
            <div className="flex items-center gap-2 py-[2rem]">
              <img
                onClick={() => navigate(`/profile/${post?.userId}`)}
                className="w-[3rem] h-[3rem] object-cover rounded-full cursor-pointer"
                src={post?.userImg}
                alt="user-img"
              />
              <div>
                <div className="capitalize">
                  <span>{post?.username} .</span>
                  {currentUser && currentUser?.uid !== post?.userId && (
                    <FollowBtn userId={post?.userId as string} />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {readTime({ __html: post?.desc || "" })} min read .
                  <span className="ml-1">{moment(post?.created).fromNow()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-t border-gray-200 py-[0.5rem]">
              <div className="flex items-center gap-5">
                <Like postId={postId as string} />
                <Comment />
              </div>
              <div className="flex items-center pt-2 gap-5">
                {post && <SavedPost post={post} />}
                <SharePost />
                {currentUser && currentUser?.uid === post?.userId && (
                  <Actions postId={postId as string} title={post.title} desc={post.desc} />
                )}
              </div>
            </div>
            <div className="mt-[3rem]">
              {post?.postImg && (
                <img
                  className="w-full h-[400px] object-cover"
                  src={post.postImg}
                  alt="post-img"
                />
              )}
              <div
                className="mt-6"
                dangerouslySetInnerHTML={{ __html: post?.desc || "" }}
              />
            </div>
          </section>
          {post && <Recommended post={post} />}
          <Comments postId={postId as string} />
        </>
      )}
    </>
  );
};

export default SinglePost;
