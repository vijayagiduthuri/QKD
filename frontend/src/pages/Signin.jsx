import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import AuthService from '../services/authServices'; // adjust the path if needed
import { useNavigate } from 'react-router-dom';



const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };


  const handleLogin = async (e) => {
  e.preventDefault();
  setErrors({});

  // Validate form
  const newErrors = {};
  if (!formData.email) {
    newErrors.email = 'Please enter your email';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email';
  }

  if (!formData.password) {
    newErrors.password = 'Please enter your password';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);
  try {
    const result = await AuthService.login(formData.email, formData.password);
    const data = result || {};

    if (result.success) {
      setLoginSuccess(true);

      if (rememberMe) {
        console.log('Would store email:', formData.email);
      }

      // redirect to homepage after 2s (you can remove setTimeout if you want instant redirect)
      setTimeout(() => {
        navigate("/home");
      }, 2000);

    } else {
      if (data.message === 'User not found') {
        setErrors({ email: 'No account found with this email' });
      } else if (data.message === 'Invalid password') {
        setErrors({ password: 'Incorrect password' });
      } else {
        setErrors({ general: data.message || 'Login failed. Please try again.' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    setErrors({ general: 'Network error. Please check your connection and try again.' });
  } finally {
    setIsLoading(false);
  }
};

  // for redirecting to signup page
  const navigate = useNavigate();
  const handleRedirectToSignup = () => {
    navigate('/Signup'); // Signup is routed at "/"
  };

  // for redirecting to forgot password page
  const handleRedirectToForgotPassword = () => {
    navigate('/forgot-password');
  };


  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@eq-auction.com',
      password: 'demo123456'
    });
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-green-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-emerald-600/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-700/50 relative overflow-hidden
            shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4),0_0_90px_rgba(15,23,42,0.2),0_20px_40px_rgba(0,0,0,0.3)]">

            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 
              shadow-[0_0_30px_rgba(34,197,94,0.4),0_8px_16px_rgba(0,0,0,0.3),0_0_60px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4"
              style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>
              Welcome Back! 🎉
            </h2>

            <p className="text-slate-300/90 text-lg leading-relaxed mb-6">
              You have been successfully logged in.<br />
              Redirecting to your dashboard...
            </p>

            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-sky-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-600/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-indigo-500/6 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/6 right-1/6 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-slate-600/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent mb-2"
            style={{ textShadow: '0 0 20px rgba(125, 211, 252, 0.3)' }}>
            Quantum-Bid
          </h1>
          <p className="text-slate-300/90 text-base sm:text-lg font-medium px-4 sm:px-0"
            style={{ textShadow: '0 0 10px rgba(148, 163, 184, 0.2)' }}>
            Welcome Back to the Action
          </p>
        </div>

        {/* Enhanced Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-700/50 relative overflow-hidden
          shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4),0_0_90px_rgba(15,23,42,0.2),0_20px_40px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0_0_1px_rgba(30,41,59,0.15),0_0_40px_rgba(0,0,0,0.7),0_0_80px_rgba(15,23,42,0.5),0_0_120px_rgba(15,23,42,0.3),0_25px_50px_rgba(0,0,0,0.4)]
          transition-all duration-700 hover:scale-[1.02] group">

          {/* Enhanced Card Glow Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/15 to-slate-700/10 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-600/10 via-transparent to-slate-800/15 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/5 via-transparent to-indigo-900/5 rounded-2xl sm:rounded-3xl group-hover:from-sky-900/8 group-hover:to-indigo-900/8 transition-all duration-700"></div>

          <div className="absolute inset-1 bg-gradient-to-br from-slate-600/8 via-transparent to-slate-700/8 rounded-2xl sm:rounded-3xl blur-sm"></div>

          <div className="relative z-10">
            {/* Login Header */}
            <div className="text-center mb-8">

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"
                style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}>
                Sign In
              </h2>
              <p className="text-slate-400/80 text-sm sm:text-base">Enter your credentials to access your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* General Error Message */}
              {errors.general && (
                <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in slide-in-from-top duration-300">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))' }} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
                      shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                      hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                      focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${errors.email ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(248,113,113,0.25),0_4px_8px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
                      }`}
                    style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 z-10"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(14, 165, 233, 0.5))' }} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-800/70 border rounded-lg sm:rounded-xl text-white placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base 
                      shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(14,165,233,0.1),0_0_10px_rgba(0,0,0,0.2)] 
                      hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_4px_8px_rgba(14,165,233,0.15),0_0_15px_rgba(0,0,0,0.3)] 
                      focus:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.2)] ${errors.password ? 'border-red-400/60 ring-2 ring-red-400/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),0_0_15px_rgba(248,113,113,0.25),0_4px_8px_rgba(0,0,0,0.2)]' : 'border-slate-600/70 hover:border-sky-500/40'
                      }`}
                    style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2 animate-in slide-in-from-top duration-300">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">

                <button
                  type="button"
                  onClick={handleRedirectToForgotPassword}
                  className="text-sky-400 hover:text-sky-300 transition-colors duration-200 text-sm font-medium bg-transparent border-none p-0 cursor-pointer"
                  style={{ textShadow: '0 0 10px rgba(14, 165, 233, 0.3)' }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-sky-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-300 text-sm sm:text-base transform active:scale-95
                  shadow-[0_0_20px_rgba(14,165,233,0.3),0_8px_16px_rgba(0,0,0,0.3),0_0_40px_rgba(14,165,233,0.15)] 
                  hover:shadow-[0_0_30px_rgba(14,165,233,0.4),0_12px_24px_rgba(0,0,0,0.35),0_0_60px_rgba(14,165,233,0.2)] 
                  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                  disabled:shadow-[0_0_15px_rgba(14,165,233,0.15),0_4px_8px_rgba(0,0,0,0.2)]"
                style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </div>
                )}
              </button>


            </form>
          </div>
        </div>

        {/* Footer */}
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400/80 text-sm"
            style={{ textShadow: '0 0 10px rgba(148, 163, 184, 0.2)' }}>
            Don't have an account?{' '}
            <button
              onClick={handleRedirectToSignup}
              className="text-sky-400 hover:text-sky-300 cursor-pointer font-medium transition-colors duration-200 underline-offset-4 hover:underline bg-transparent border-none p-0"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;