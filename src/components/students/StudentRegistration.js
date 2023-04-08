import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import learningLogo from "../../assets/image/learningportal.svg";
import { useRegistrationMutation } from "../../features/auth/authApi";

export default function StudentRegistration() {
  const [
    registration,
    { data: userData, isLoading, isError, isSuccess, error },
  ] = useRegistrationMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resError, setResError] = useState("");

  let errorText = null;

  const navigate = useNavigate();

  useEffect(() => {
    if (error?.data) {
      setResError(error.data);
    }
  }, [error?.data]);

  useEffect(() => {
    if (isSuccess && userData?.accessToken) {
      navigate("/CoursePlayer");
    }
  }, [isSuccess, navigate, userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResError("");
    if (!email.includes("@")) {
      setResError("Email is not in correct format");
    } else if (password === "") {
      setResError("Password should not be empty");
    } else if (password !== confirmPassword) {
      setResError("Password do not matched!");
    }

    if (
      email.includes("@") &&
      password !== "" &&
      password === confirmPassword
    ) {
      const data = {
        name,
        email,
        password,
      };
      registration(data);
    }
  };

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
          <Link to="/">
            <img className="h-12 mx-auto" src={learningLogo} alt="LWS" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Create Your New Account
          </h2>
        </div>
        {isLoading ? (
          <div>
            <h3>Creating an account....</h3>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="login-input rounded-t-md"
                  placeholder="Student Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                  className="login-input "
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
                  className="login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="confirm-password"
                  required
                  className="login-input rounded-b-md"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Create Account
              </button>
            </div>
            <div>{errorText}</div>
          </form>
        )}
      </div>
    </section>
  );
}
