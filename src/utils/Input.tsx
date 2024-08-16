import React from 'react';

interface InputProps {
  label: string;
  type: string;
  name: keyof FormState; // This ensures that the name prop is one of the keys in FormState
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface FormState {
  username: string;
  email: string;
  password: string;
  rePassword: string;
}



const  Input: React.FC<InputProps> = ({ label, type, name, value, onChange }) => {
  

  return (
    // <div className="flex flex-col gap-2">
    //   <label className="text-sm capitalize">{title}</label>
    //   <input
    //     className="text-center border-b border-black outline-none"
    //     type={type}
    //     name={title}
    //     onChange={handleChange}
    //   />
    // </div>
    <div className="custom-input">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
  );
};

export default Input;
