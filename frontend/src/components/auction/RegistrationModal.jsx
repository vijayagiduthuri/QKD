import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  DollarSign,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Building,
  MapPin,
  X,
} from "lucide-react";

const RegistrationModal = ({ 
  selectedAuction, 
  isOpen, 
  onClose, 
  userId = null,
  onSuccess = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      address: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 3);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    }
    if (currentStep === 3) {
      if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required.";
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required.";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required.";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (!selectedAuction) return;
    if (!validateStep()) return;

    const registrationFee = selectedAuction.baseAmount * 0.1;
    const registrationData = { 
      ...formData, 
      selectedAuction, 
      userId, 
      registrationFee 
    };
    console.log("Submitting Registration:", registrationData);
    onSuccess(registrationData);
    handleClose();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Personal Information";
      case 2: return "Company Details";
      case 3: return "Payment Information";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.fullName ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.email ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const registrationFee = selectedAuction ? selectedAuction.baseAmount * 0.1 : 0;
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Registration Fee (10%):</span>
                <span className="text-blue-400 font-semibold">{formatCurrency(registrationFee)}</span>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Cardholder Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  placeholder="Name on card"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.cardholderName ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Card Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.cardNumber ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 font-medium text-slate-300">
                  Expiry Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full bg-slate-700/50 border rounded-lg px-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.expiryDate ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-slate-300">
                  CVV <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full bg-slate-700/50 border rounded-lg px-3 py-3 text-sm 
                    text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${errors.cvv ? "border-red-500 focus:border-red-500" : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"}`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-white">Register for Auction</h2>
            <p className="text-sm text-slate-400 mt-1">{getStepTitle()}</p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
        </div>

        {/* Auction Info */}
        <div className="px-6 pt-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-semibold">{selectedAuction?.title}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700/50">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          )}
          <button
            onClick={currentStep === 3 ? handleSubmit : nextStep}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium"
          >
            {currentStep === 3 ? (
              <>
                <DollarSign className="w-4 h-4" /> Complete Registration
              </>
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
