import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import learningLogo from "../../assets/image/learningportal.svg";
import { useLoginMutation } from "../../features/auth/authApi";

export default function AdminLogin() {
  const auth = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [resError, setResError] = useState("");

  const [login, { data: userData, isLoading, isError, error, isSuccess }] =
    useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (error?.data) {
      setResError(error.data);
    }
    if (
      userData?.accessToken &&
      userData?.user &&
      userData?.user?.role === "admin"
    ) {
      navigate("/admin/dashboard");
    }
  }, [userData?.accessToken, userData?.user, navigate, error?.data]);

  const handleLogin = (e) => {
    e.preventDefault();

    setResError("");
    if (email.includes("@") && password !== "") {
      const data = {
        email,
        password,
      };
      login(data);
    }
  };

  let errorText = null;

  if (isError) {
    errorText = <p className="text-red-700">{resError} </p>;
  }

  if (isSuccess) {
    errorText = <p className="text-green-700">Login Success </p>;
  }

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto max-w-md px-5 lg:px-0">
        <div>
          <Link to="/admin">
            <img className="h-12 mx-auto" src={learningLogo} alt="LWS" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Sign in to Admin Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input rounded-t-md"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-input rounded-b-md"
                placeholder="Password"
                value={password}
                onChange={(e) => setPasword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link className="font-medium text-violet-600 hover:text-violet-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Sign in
            </button>
          </div>
          <div>{errorText}</div>
        </form>
      </div>
    </section>
  );
}
