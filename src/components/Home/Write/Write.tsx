import React, { useState } from "react";
// import ReactQuill from "react-quill";
import ReactQuill from "react-quill";
import Preview from "./Preview";
import { Blog } from "../../../Context/Context";

// Define the Blog context interface (example, should match actual context)
interface BlogContext {
  publish: boolean;
  setPublish: (value: boolean) => void;
}

const Write: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const { publish, setPublish } = Blog() as BlogContext; // Type assertion for context

  return (
    <section className="w-[90%] md:w-[90%] lg:w-[60%] mx-auto py-[3rem]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Title"
        className="text-4xl outline-none w-full"
      />
      <div className="write my-5">
        <ReactQuill
          theme="bubble"
          value={description}
          onChange={setDescription}
          placeholder="Tell Your Story..."
        />
      </div>
      <div
        className={`${
          publish ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-200`}
      >
        <Preview
          setPublish={setPublish}
          description={description}
          title={title}
        />
      </div>
    </section>
  );
};

export default Write;
