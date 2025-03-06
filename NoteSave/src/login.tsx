import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";

import axios from "axios";
type Inputs = {
  Email: string;
  Password: string;
};

// Login Page
const Login = (): React.ReactElement => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();
  const [error, setError] = useState<string>("");
  const [shown, setShown] = useState("false");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const params = {
        formdata: JSON.stringify(data),
      };
      const response = await axios.get("http://localhost:8080/login", {
        params,
      });
      localStorage.setItem("user", JSON.stringify(response.data.message));
      navigate("/");
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };
  return (
    <>
      <nav className="py-4 w-full bg-slate-900">
        <h1 className="text-white text-center font  text-4xl">Notes Saver</h1>
      </nav>

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-cyan-500 justify-center rounded px-6 py-3 ">
          <div className="flex justify-center my-7  flex-col ">
            <a
              href="/"
              className="text-4xl  text-center font-bold text-opacity-75 hover:text-opacity-100 text-white font"
            >
              Login
            </a>
            {error && (
              <p className="animate-bounce text-black text-center rounded-full font-bold font ">
                {error}
              </p>
            )}
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <div className="flex flex-col gap-6 mx-4">
                  <label htmlFor="email" className="text-white text-3xl font">
                    Email ￫
                  </label>
                  <label
                    htmlFor="password"
                    className="text-white text-3xl font"
                  >
                    Password ￫
                  </label>
                </div>
                <div className="flex flex-col gap-5 mx-4">
                  <input
                    type="email"
                    id="email"
                    {...register("Email", { required: true })}
                    className="rounded px-2 h-10 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="Email"
                  />
                  <div>
                    <input
                      type={shown == "false" ? "password" : "text"}
                      {...register("Password", { required: true })}
                      id="password"
                      className="rounded h-10 px-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-400"
                      placeholder="Enter Password"
                    />
                    <div className="flex  my-2">
                      <input
                        type="checkbox"
                        className="size-5 my-1 cursor-pointer accent-rose-500"
                        value={shown}
                        onChange={() =>
                          shown == "false"
                            ? setShown("true")
                            : setShown("false")
                        }
                      />
                      <p className="text-white text-2xl mx-3 font">
                        Show password
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="submit"
                    className="transition-all font  text-xl rounded  py-2 bg-rose-400 hover:bg-white text-white hover:text-rose-400"
                  >
                    Login
                  </button>
                  <a
                    href="/register"
                    className="text-black font-mono hover:underline"
                  >
                    No account?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
