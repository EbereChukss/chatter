import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ReactQuill from "react-quill";
import TagsInput from "react-tagsinput";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/firebase";
import { Blog } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";

// Define props interface
interface PreviewProps {
  setPublish: (value: boolean) => void;
  description: string;
  title: string;
}

interface PreviewState {
  title: string;
  photo: File | null;
}

const Preview: React.FC<PreviewProps> = ({
  setPublish,
  description,
  title,
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");
  const { currentUser } = Blog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [preview, setPreview] = useState<PreviewState>({
    title: "",
    photo: null,
  });

  useEffect(() => {
    if (title || description) {
      setPreview((prev) => ({ ...prev, title }));
      setDesc(description);
    } else {
      setPreview({ title: "", photo: null });
      setDesc("");
    }
  }, [title, description]);

  const handleClick = () => {
    imageRef.current?.click();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (preview.title === "" || desc === "" || tags.length === 0) {
        toast.error("All fields are required!!!");
        setLoading(false);
        return;
      }

      if (preview.title.length < 15) {
        toast.error("Title must be at least 15 characters");
        setLoading(false);
        return;
      }

      const collections = collection(db, "posts");

      let url = "";
      if (imageUrl && preview.photo) {
        const storageRef = ref(storage, `image/${preview.photo.name}`);
        await uploadBytes(storageRef, preview.photo);
        url = await getDownloadURL(storageRef);
      }

      await addDoc(collections, {
        userId: currentUser?.uid,
        title: preview.title,
        desc,
        tags,
        postImg: url || "",
        created: Date.now(),
        pageViews: 0,
      });

      toast.success("Post has been added");
      navigate("/");
      setPublish(false);
      setPreview({
        title: "",
        photo: null,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="absolute inset-0 bg-white z-30">
      <div className="size my-[2rem]">
        <span
          onClick={() => setPublish(false)}
          className="absolute right-[1rem] md:right-[5rem] top-[3rem] text-2xl cursor-pointer"
        >
          <LiaTimesSolid />
        </span>
        {/* Preview the text */}
        <div className="mt-[8rem] flex flex-col md:flex-row gap-10">
          <div className="flex-[1]">
            <h3>Story Preview</h3>
            <div
              style={{ backgroundImage: `url(${imageUrl})` }}
              onClick={handleClick}
              className="w-full h-[200px] object-cover bg-gray-100 my-3 grid place-items-center cursor-pointer bg-cover bg-no-repeat"
            >
              {!imageUrl && "Add Image"}
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  setImageUrl(URL.createObjectURL(file));
                  setPreview((prev) => ({ ...prev, photo: file }));
                }
              }}
              ref={imageRef}
              type="file"
              hidden
            />
            <input
              type="text"
              placeholder="Title"
              className="outline-none w-full border-b border-gray-300 py-2"
              value={preview.title}
              onChange={(e) =>
                setPreview((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <div className="py-3 border-b border-gray-300">
              <ReactQuill
                theme="bubble"
                value={desc}
                onChange={setDesc}
                placeholder="Tell Your Story..."
              />
            </div>
            <p className="text-gray-500 pt-4 text-sm">
              <span className="font-bold">Note:</span> Changes here will affect
              how your story appears in public places like Medium’s homepage and
              in subscribers’ inboxes — not the contents of the story itself.
            </p>
          </div>
          <div className="flex-[1] flex flex-col gap-4 mb-5 md:mb-0">
            <h3 className="text-2xl">
              Publishing to:
              <span className="font-bold capitalize">Milad Tech</span>
            </h3>
            <p>
              Add or change topics up to 5 so readers know what your story is
              about
            </p>
            <TagsInput value={tags} onChange={setTags} />
            <button
              onClick={handleSubmit}
              className="btn !bg-green-800 !w-fit !text-white !rounded-full"
            >
              {loading ? "Submitting..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
