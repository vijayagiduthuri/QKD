import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  MapPin,
  DollarSign,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegistrationModal = ({
  selectedAuction,
  isOpen,
  onClose,
  userId,
  onSuccess = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentDone, setPaymentDone] = useState(false);

  // ✅ place useNavigate here
  const navigate = useNavigate();

  // Check Stripe redirect status
  useEffect(() => {
    const status = sessionStorage.getItem("paymentStatus");
    const paidAuctionId = sessionStorage.getItem("auctionId");

    if (status && paidAuctionId === selectedAuction?._id) {
      if (status === "success") setPaymentDone(true);
      else if (status === "failed") setPaymentDone("failed");
    }
  }, [selectedAuction]);

  // Sync prop from parent
  useEffect(() => {
    if (selectedAuction?.paymentDone) {
      setPaymentDone(true);
    }
  }, [selectedAuction?.paymentDone]);

  // Automatically go to Step 2 after payment
  useEffect(() => {
    if (paymentDone === true) {
      setCurrentStep(2);
    }
  }, [paymentDone]);

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({ fullName: "", email: "", phone: "", address: "" });
    setErrors({});
    setPaymentDone(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 2) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required.";
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
      if (!formData.address.trim()) newErrors.address = "Address is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !paymentDone) {
      alert("Please complete the payment before proceeding.");
      return;
    }
    if (validateStep() && currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!selectedAuction) return;
    if (!validateStep()) return;

    try {
      // 1️⃣ Generate key from Python QKD backend
      const keyResponse = await fetch("http://127.0.0.1:8000/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!keyResponse.ok) throw new Error("Key generation failed");
      const keyData = await keyResponse.json();
      const generatedKey = keyData.auctioner_key;
      console.log("Submitting Registration Payload:", {
        auctionerId: selectedAuction.auctionerId,
        auctionId: selectedAuction._id,
        userId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        key: generatedKey,
      });
      // 2️⃣ Send registration request to Node backend
      const registerResponse = await fetch(
        "http://localhost:9000/api/auctionRegistrations/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auctionerId: selectedAuction.auctionerId,
            auctionId: selectedAuction._id,
            userId,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            key: generatedKey,
          }),
        }
      );

      if (!registerResponse.ok) {
        alert("Registration failed. Please try again later.");
        return;
      }

      const data = await registerResponse.json();
      console.log("Registration Success:", data);

      // ✅ Update parent state
      onSuccess({
        auctionId: selectedAuction._id,
        ...formData,
      });

      alert("Registered successfully!");
      handleClose();
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again later.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <p className="text-slate-300 text-sm">
              To register for <strong>{selectedAuction?.title}</strong>, please
              pay{" "}
              <span className="font-semibold text-blue-400">
                {selectedAuction
                  ? `₹${(selectedAuction.basePrice * 0.1).toFixed(2)}`
                  : ""}
              </span>{" "}
              (10% of reserved amount).
            </p>

            {paymentDone === true && (
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Payment Successful
              </div>
            )}

            {paymentDone === "failed" && (
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <X className="w-5 h-5" /> Payment Failed
              </div>
            )}

            {!paymentDone && (
              <button
                onClick={async () => {
                  if (!selectedAuction?.basePrice) {
                    alert("Base price not available for this auction.");
                    return;
                  }

                  const registrationFee = Math.floor(
                    Number(selectedAuction.basePrice) / 10
                  );
                  console.log("Base Price:", selectedAuction.basePrice);
                  console.log("Registration Fee (10%):", registrationFee);

                  const res = await fetch(
                    "http://localhost:9000/api/payment/checkout",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        auction_id: selectedAuction._id,
                        user_id: userId,
                        auctioner_id: selectedAuction?.auctionerId,
                        title: selectedAuction?.title,
                        cost: registrationFee,
                      }),
                    }
                  );

                  const data = await res.json();
                  if (data.url) window.location.href = data.url; // redirect to Stripe
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium"
              >
                <DollarSign className="w-4 h-4" /> Pay Now
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Personal Info Form */}
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
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none transition-all ${
                    errors.fullName
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none transition-all ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm mb-2 font-medium text-slate-300">
                Address<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-400 outline-none transition-all ${
                    errors.address
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium mt-4"
            >
              <DollarSign className="w-4 h-4" /> Register
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-white">
              Register for Auction
            </h2>
            <p className="text-sm text-slate-400 mt-1">{`Step ${
              currentStep === 1
                ? "Pay Registration Fee"
                : "Personal Information"
            }`}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {currentStep} of 2</span>
            <span>{Math.round((currentStep / 2) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Auction Info */}
        <div className="px-6 pt-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm font-semibold">
              {selectedAuction?.title}
            </p>
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
          {currentStep === 1 && paymentDone && (
            <button
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
