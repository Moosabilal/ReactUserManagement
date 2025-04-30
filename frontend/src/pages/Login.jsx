import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({name: "",email: "",password: "",});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signState, setSignState] = useState(state='Sign In');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData,[name]: value,});

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({...errors,[name]: "",});
    }
  };

  const validate = () => {
    const newErrors = {};
    if (signState === "Sign Up") {

      //Name validation
      if (!formData.name) {
        newErrors.name = "Name is required";
      } else if (formData.name.length < 4) {
        newErrors.name = "Name must be at least 4 characters";
      }
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (validate()) {
      setIsSubmitting(true);
      try {
        if (signState === "Sign In") {
          dispatch(loginUser(formData)).then((data) => {
            if (data.payload?.success) {
              if(data.payload.user.role=='admin'){
                navigate("/admin-dashboard")
              }else{
                navigate("/home");
              }
            }
          });
        } else {
          dispatch(registerUser(formData)).then((data) => {
            if (data?.payload?.success) {
              toast.success('User Created Successfully')
              setFormData({ name: "", email: "", password: "",})
              navigate('/home')
            } else {
              setError(data?.payload?.message);
            }
          });
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error);
        } else {
          setError("Server Error");
          console.log(error);
        }
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {signState}
        </h2>
        {error && <p className="text-red-500 text-center font-bold">{error}{ toast.error(error) }</p>}
        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            {isSubmitting ? "Submitting..." : signState}
          </button>
        </form>

        <div className="mt-6 text-center">
          {signState === "Sign In" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={() => {
                  setSignState("Sign Up");
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={() => {
                  setSignState("Sign In");
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
