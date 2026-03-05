import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../features/user/userSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await dispatch(registerUser(form)).unwrap();
        toast.success("Account created");
      } else {
        await dispatch(
          loginUser({ email: form.email, password: form.password }),
        ).unwrap();
        toast.success("Logged in");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />

      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.logo} alt="" className="h-12 object-contain" />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p>Made for Friends</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Friends are always together
          </h1>
          <p className="text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Connect with global community on InCanvas
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <form
          onSubmit={onSubmit}
          className="bg-white/95 w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-slate-800">
            {isRegister ? "Create account" : "Sign in"}
          </h2>

          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
              <input
                type="text"
                placeholder="Username (optional)"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            minLength={6}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer"
          >
            {isRegister ? "Create account" : "Sign in"}
          </button>

          <p className="text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              className="text-indigo-600 cursor-pointer"
            >
              {isRegister ? "Sign in" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
