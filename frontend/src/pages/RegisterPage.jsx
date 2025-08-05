import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import AnimatedPage from "../components/AnimatedPage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Minimum 3 characters").required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { confirmPassword, ...rest } = values; // Remove confirmPassword before sending
        const res = await axios.post("http://localhost:5000/api/users/register", rest);
        if (res.data.success) {
          toast.success("Registered successfully! Please login.");
          navigate("/home");
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Server error. Try again later.");
      }
      setLoading(false);
    },
  });

 return (<>
    
    <div className="hidden md:block md:w-1/4">
  <h1 className="text-center text-4xl font-bold text-blue-700 mb-6 font-[Quicksand]">🌍 DreamTrip</h1>

</div>

  <div className="flex items-center justify-center min-h-screen bg-animated">
<AnimatedPage>
    <form 
      onSubmit={formik.handleSubmit}
      className="bg-white bg-opacity-90 rounded-xl p-10 w-[28rem] shadow-lg transform transition duration-500 hover:scale-105"
    >
      <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">Create an Account</h2>

      <div className="mb-5">
        <label className="block mb-1 font-medium" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
          }`}
          {...formik.getFieldProps("name")}
          disabled={loading}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.name}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
          }`}
          {...formik.getFieldProps("email")}
          disabled={loading}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
          }`}
          {...formik.getFieldProps("password")}
          disabled={loading}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium" htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
            formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          {...formik.getFieldProps("confirmPassword")}
          disabled={loading}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded font-semibold text-white transition ${
          loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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
            Registering...
          </div>
        ) : (
          "Register"
        )}
      </button>

      <p className="mt-5 text-center text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Login
        </Link>
      </p>
    </form>
    </AnimatedPage>
  </div>
  
</>);

}
