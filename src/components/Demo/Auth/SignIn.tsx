import React, { useState, FormEvent } from "react";
import Input from "../../../utils/Input";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";

// Define the types for the props
interface SignInProps {
  setSignReq: (value: string) => void;
}

// Define the types for the form state
interface FormState {
  email: string;
  password: string;
}

const SignIn: React.FC<SignInProps> = ({ setSignReq }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required!!!");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
      toast.success("User has been logged in");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size mt-[6rem] text-center">
      <h2 className="text-3xl">Sign in with email</h2>
      <p className="w-full sm:w-[25rem] mx-auto py-[3rem]">
        Enter the email address associated with your account, and we’ll send a
        magic link to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputChange}
        />

        <button
          className={`px-4 py-1 text-sm rounded-full bg-green-700
        hover:bg-green-800 text-white w-fit mx-auto
        ${loading ? "opacity-50 pointer-events-none" : ""}`}
          disabled={loading}
        >
          Sign In
        </button>
      </form>
      <button
        onClick={() => setSignReq("")}
        className="mt-5 text-sm text-green-600 hover:text-green-700
      flex items-center mx-auto"
      >
        <MdKeyboardArrowLeft />
        All sign In Options
      </button>
    </div>
  );
};

export default SignIn;
