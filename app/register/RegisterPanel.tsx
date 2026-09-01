"use client";

import { useState } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { User, Phone, Lock, Mail, Eye, EyeOff, Gauge } from "lucide-react";

export default function RegisterPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <div className="w-[60%] h-full p-12">
      <h2 className="font-extrabold text-5xl text-button">Sign Up</h2>
      <Input
        id="name"
        label="Full name:"
        type="text"
        className="w-[60%]"
        placeholder="Enter your name"
        icon={<User size={18} />}
      />
      <Input
        id="phone"
        label="Phone number:"
        type="tel"
        inputMode="numeric"
        placeholder="Enter your phone number"
        icon={<Phone size={18} />}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
        }}
      />
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
      <Input
        id="repassword"
        label="Confirm password:"
        type={showRePassword ? "text" : "password"}
        placeholder="Re-enter your password"
        icon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowRePassword(!showRePassword)}
            className="cursor-pointer text-placeholder"
          >
            {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <Button className="mt-3">Sign up</Button>

      <p className="mt-8 text-center text-sm text-gray-700">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-text hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
