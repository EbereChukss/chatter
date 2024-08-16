import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import { Blog } from "../../../Context/Context";

interface UpdateData {
  title: string;
  description: string;
}

const EditPost: React.FC = () => {
  const { updateData, title, setTitle, description, setDescription } = Blog();

  useEffect(() => {
    if (updateData) {
      setTitle((updateData as UpdateData).title);
      setDescription((updateData as UpdateData).description);
    }
  }, [updateData, setTitle, setDescription]);

  return (
    <section className="write w-[90%] md:w-[80%] lg:w-[60%] mx-auto py-[3rem]">
      <input
        type="text"
        placeholder="Title..."
        className="text-4xl outline-none w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="!text-[4rem] my-3">
        <ReactQuill
          placeholder="Description..."
          theme="bubble"
          value={description}
          onChange={setDescription}
        />
      </div>
    </section>
  );
};

export default EditPost;
