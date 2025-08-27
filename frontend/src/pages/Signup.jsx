import React, { useState } from 'react';
import EmailStep from '../components/Emailstep';
import OTPStep from '../components/OTPStep';
import RegistrationStep from '../components/RegistrationStep';
import SuccessStep from '../components/SuccessStep';
import StepIndicator from '../components/StepIndicator';
import BackgroundEffects from '../components/BackgroundEffects';
import AuthService from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    otp: '',
    verifyToken: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle OTP input changes
  const handleOTPChange = (e, index) => {
    const newOtp = formData.otp.split('');
    newOtp[index] = e.target.value;
    const otpString = newOtp.join('');
    setFormData(prev => ({ ...prev, otp: otpString }));
    
    // Auto-focus next input
    if (e.target.value && index < 5) {
      const nextInput = e.target.parentNode.children[index + 1];
      if (nextInput) nextInput.focus();
    }
    
    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await AuthService.sendOTP(formData.email);
      
      if (response.success) {
        setCurrentStep(2);
      } else {
        setErrors({ email: response.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }
    
    if (formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await AuthService.verifyOTP(formData.email, formData.otp);
      
      if (response.success) {
        setCurrentStep(3);
        setFormData(prev => ({ 
          ...prev, 
          verifyToken: response.verifyToken || 'token-received' 
        }));
      } else {
        setErrors({ otp: response.message || 'Invalid or expired OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete registration
  const handleRegister = async () => {
    const newErrors = {};
    
    if (!formData.userName) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await AuthService.completeRegistration(
        formData.email,
        formData.userName,
        formData.password,
        formData.verifyToken
      );
      
      if (response.success) {
        // Save user data for profile page
        const userData = {
          userName: formData.userName,
          email: formData.email,
          joinDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setCurrentStep(4);
      } else {
        setErrors({ 
          userName: response.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      setErrors({ userName: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setFormData(prev => ({ ...prev, otp: '' }));
    setIsLoading(true);
    setErrors({});

    try {
      const response = await AuthService.sendOTP(formData.email);
      
      if (!response.success) {
        setErrors({ otp: response.message || 'Failed to resend OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Navigation handlers
  const goToEmailStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const goToOTPStep = () => {
    setCurrentStep(2);
    setErrors({});
  };

  // Success action
  const handleStartBidding = () => {
    // Navigate to dashboard or main app
    console.log('Redirecting to dashboard...');
    // window.location.href = '/dashboard';
  };

  // navigation button function to signin page 
  const handleRedirectToSignin = () => {
    navigate('/signin'); // Correct lowercase
  };

  // navigate to signin page function
    const handleRedirectToSignup = () => {
      navigate('/Signup'); // Signup is routed at "/"
    };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-sky-200 to-white bg-clip-text text-transparent mb-2"
              style={{textShadow: '0 0 20px rgba(125, 211, 252, 0.3)'}}>
            Quantum-Bid
          </h1>
          <p className="text-slate-300/90 text-base sm:text-lg font-medium px-4 sm:px-0"
             style={{textShadow: '0 0 10px rgba(148, 163, 184, 0.2)'}}>
            Join the Ultimate Bidding Experience
          </p>
        </div>

        {/* Enhanced Main Card with Advanced Box Shadows */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-slate-700/50 relative overflow-hidden
          shadow-[0_0_0_1px_rgba(30,41,59,0.1),0_0_30px_rgba(0,0,0,0.6),0_0_60px_rgba(15,23,42,0.4),0_0_90px_rgba(15,23,42,0.2),0_20px_40px_rgba(0,0,0,0.3)]
          hover:shadow-[0_0_0_1px_rgba(30,41,59,0.15),0_0_40px_rgba(0,0,0,0.7),0_0_80px_rgba(15,23,42,0.5),0_0_120px_rgba(15,23,42,0.3),0_25px_50px_rgba(0,0,0,0.4)]
          transition-all duration-700 hover:scale-[1.02] group">
          
          {/* Enhanced Card Glow Effects with Multiple Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/15 to-slate-700/10 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-600/10 via-transparent to-slate-800/15 rounded-2xl sm:rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/5 via-transparent to-indigo-900/5 rounded-2xl sm:rounded-3xl group-hover:from-sky-900/8 group-hover:to-indigo-900/8 transition-all duration-700"></div>
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-1 bg-gradient-to-br from-slate-600/8 via-transparent to-slate-700/8 rounded-2xl sm:rounded-3xl blur-sm"></div>
          
          {/* Step Indicator - Only show for steps 1-3 */}
          {currentStep <= 3 && <StepIndicator currentStep={currentStep} />}

          <div className="relative z-10">
            {/* Step 1: Email */}
            {currentStep === 1 && (
              <EmailStep
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSendOTP={handleSendOTP}
              />
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <OTPStep
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onOTPChange={handleOTPChange}
                onVerifyOTP={handleVerifyOTP}
                onResendOTP={handleResendOTP}
                onBack={goToEmailStep}
              />
            )}

            {/* Step 3: Complete Registration */}
            {currentStep === 3 && (
              <RegistrationStep
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                onInputChange={handleInputChange}
                onTogglePassword={togglePassword}
                onRegister={handleRegister}
                onBack={goToOTPStep}
              />
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <SuccessStep onStartBidding={handleStartBidding} />

            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400/80 text-sm"
            style={{ textShadow: '0 0 10px rgba(148, 163, 184, 0.2)' }}>
            Already have an account?{' '}
            <button
              onClick={handleRedirectToSignin}
              className="text-sky-400 hover:text-sky-300 cursor-pointer font-medium transition-colors duration-200 underline-offset-4 hover:underline bg-transparent border-none p-0"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;