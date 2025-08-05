import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext"; // Import useAuth

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure the login function from your AuthContext
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", values);

        if (res.data.token) {
          // Instead of manually setting localStorage, call the login function from AuthContext
          // Your AuthContext's login function should handle saving token and user data.
          // Ensure your backend response structure matches what 'login' expects.
          // Assuming res.data contains { token: '...', user: { _id: '...', name: '...', email: '...' } }
          login(res.data.token, res.data.user); // Pass token and user object to context login

          toast.success("Logged in successfully!");
          navigate("/home"); // Redirect to the Home page after successful login
        } else {
          toast.error(res.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {/* This div seems misplaced in the current structure; it's outside the main login container.
          Consider if it's meant to be a full-page background or part of a larger layout. */}
      <div className="hidden md:block md:w-1/4">
        <h1 className="text-center text-4xl font-bold text-blue-700 mb-6 font-[Quicksand]">🌍 DreamTrip</h1>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-animated">
        <AnimatedPage>
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white bg-opacity-90 rounded-xl p-12 w-[28rem] shadow-lg transform transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold mb-8 text-center">Login to Your Account</h2>

            <div className="mb-5">
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
                  formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...formik.getFieldProps("email")}
                disabled={loading}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...formik.getFieldProps("password")}
                disabled={loading}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold text-white transition ${
                loading ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            <p className="mt-5 text-center text-gray-700">
              Don't have an account?{" "}
              <Link to="/register" className="text-pink-600 hover:underline font-semibold">
                Register
              </Link>
            </p>
          </form>
        </AnimatedPage>
      </div>
    </>
  );
}