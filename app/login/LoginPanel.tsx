"use client";

import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPanel() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-[60%] h-full p-12">
      <h2 className="font-extrabold text-5xl text-button">Log In</h2>
      <Input
        id="email"
        label="Email:"
        type="email"
        placeholder="Enter your email"
        icon={<Mail size={18} />}
      />
      <Input
        id="password"
        label="Password:"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        icon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-placeholder"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
      <a className="flex w-fit mt-3 ml-auto text-text font-bold" href="#">
        Forgot password
      </a>

      <Button className="mt-3">Log in</Button>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300"></div>

        <span className="text-sm text-gray-500">Or continue with</span>

        <div className="h-px flex-1 bg-gray-300"></div>
      </div>

      <div className="mt-5 flex gap-4">
        <button
          type="button"
          className="
                flex flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-300
                bg-white
                py-3
                text-sm
                font-semibold
                text-black
                cursor-pointer
                transition
                hover:bg-gray-50
                "
        >
          <FcGoogle size={20} />
          Google
        </button>

        <button
          type="button"
          className="
                flex flex-1
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-300
                bg-white
                py-3
                text-sm
                font-semibold
                text-black
                cursor-pointer
                transition
                hover:bg-gray-50
                "
        >
          <FaFacebook size={20} className="text-blue-600" />
          Facebook
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-700">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-semibold text-text hover:underline">
          Sign up now
        </a>
      </p>
    </div>
  );
}
