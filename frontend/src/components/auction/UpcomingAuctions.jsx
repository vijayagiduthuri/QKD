import React, { useState } from "react";
import {
    User,
    Calendar,
    UserPlus,
    X,
    Mail,
    Phone,
    DollarSign,
    FileText,
    CreditCard,
    Notebook,
    ChevronRight,
    ChevronLeft,
    Building,
    MapPin,
    Eye,
    Clock,
    MapPin as Location,
    FileText as Description,
    Shield,
    Users as Participants,
} from "lucide-react";

const UpcomingAuctions = ({ registeredAuctions = new Set(), userId = null }) => {
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingAuction, setViewingAuction] = useState(null);
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

    // Updated auctions with detailed information and images
    const upcomingAuctions = [
        {
            id: 1,
            title: "Vehicle Fleet Auction",
            auctioneer: "Robert Davis",
            startTime: "Dec 28, 2024 - 10:00 AM",
            endTime: "Dec 28, 2024 - 06:00 PM",
            status: "UPCOMING",
            baseAmount: 50000,
            description: "Premium commercial vehicle fleet including trucks, vans, and utility vehicles. All vehicles are well-maintained with complete service records and valid certifications.",
            location: "Central Auction House, Downtown District",
            category: "Transportation",
            terms: "10% registration fee required. Full payment within 7 days of auction completion.",
            estimatedParticipants: 45,
            securityDeposit: 5000,
            itemImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format",
            specifications: [
                "Fleet of 12 commercial vehicles",
                "Age range: 2-5 years",
                "Mileage: 15,000 - 80,000 km",
                "All vehicles include warranty"
            ]
        },
        {
            id: 2,
            title: "Medical Equipment Procurement",
            auctioneer: "Dr. Emily Brown",
            startTime: "Dec 30, 2024 - 09:00 AM",
            endTime: "Dec 30, 2024 - 05:00 PM",
            status: "UPCOMING",
            baseAmount: 75000,
            description: "State-of-the-art medical equipment including MRI machines, X-ray systems, and diagnostic tools. All equipment is certified and meets international healthcare standards.",
            location: "Medical Center Auction Facility",
            category: "Healthcare Equipment",
            terms: "Medical license verification required. 10% registration fee. Installation support included.",
            estimatedParticipants: 28,
            securityDeposit: 7500,
            itemImage: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=500&h=300&fit=crop&auto=format",
            specifications: [
                "MRI Machine - Siemens 3T",
                "Digital X-ray System",
                "Ultrasound Equipment",
                "Patient Monitoring Systems"
            ]
        },
        {
            id: 3,
            title: "Construction Materials Bid",
            auctioneer: "David Wilson",
            startTime: "Jan 02, 2025 - 11:00 AM",
            endTime: "Jan 02, 2025 - 07:00 PM",
            status: "UPCOMING",
            baseAmount: 100000,
            description: "High-quality construction materials including steel beams, concrete blocks, and premium building supplies. Perfect for large-scale construction projects.",
            location: "Industrial Warehouse Complex",
            category: "Construction Materials",
            terms: "Contractor license required. Bulk pickup within 14 days. 10% registration fee applies.",
            estimatedParticipants: 62,
            securityDeposit: 10000,
            itemImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop&auto=format",
            specifications: [
                "Steel beams - Grade A quality",
                "Concrete blocks - 5000+ units",
                "Electrical wiring supplies",
                "Plumbing fixtures and fittings"
            ]
        }
    ];

    const ActionButton = ({ type, onClick, isRegistered = false }) => {
        const styles = {
            register: isRegistered
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white',
            view: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
        };

        const icons = {
            register: <UserPlus className="w-3 h-3" />,
            view: <Eye className="w-3 h-3" />
        };

        const labels = {
            register: isRegistered ? 'Registered' : 'Register',
            view: 'View'
        };

        return (
            <button
                onClick={type === 'register' && isRegistered ? undefined : onClick}
                disabled={type === 'register' && isRegistered}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${type === 'register' && !isRegistered || type === 'view' ? 'hover:transform hover:scale-105 hover:shadow-lg' : ''
                    } ${styles[type]}`}
            >
                {icons[type]}
                {labels[type]}
            </button>
        );
    };

    const openRegistrationModal = (auction) => {
        setSelectedAuction(auction);
        setCurrentStep(1);
    };

    const closeRegistrationModal = () => {
        setSelectedAuction(null);
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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const registrationFee = selectedAuction.baseAmount * 0.1;
        console.log("Submitting Registration:", {
            ...formData,
            selectedAuction,
            userId,
            registrationFee
        });
        closeRegistrationModal();
    };

    const handleView = (auction) => {
        setViewingAuction(auction);
        setShowViewModal(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-400 outline-none focus:border-blue-500 transition-colors resize-none"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 font-medium text-slate-300 flex items-center gap-2">
                                <Notebook className="w-4 h-4" />
                                Registration fee is 10% of the base amount
                            </label>
                        </div>

                        {/* Registration Fee Display */}
                        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-4 border border-emerald-400/20">
                            <div className="text-center">
                                <div className="text-sm text-slate-400 mb-1">Registration Fee</div>
                                <div className="text-xl font-bold text-emerald-400">
                                    {formatCurrency(selectedAuction.baseAmount * 0.1)}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    10% of base amount ({formatCurrency(selectedAuction.baseAmount)})
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Personal Information";
            case 2: return "Company Details";
            case 3: return "Payment Information";
            default: return "";
        }
    };

    return (
        <>
            {/* Auction list with View column and removed Purpose column */}
            <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-8 gap-3 font-semibold text-white">
                    <div className="col-span-2">Auction Title</div>
                    <div className="col-span-1">Auctioneer</div>
                    <div className="col-span-1">Start Time</div>
                    <div className="col-span-1">End Time</div>
                    <div className="col-span-1">Base Amount</div>
                    <div className="col-span-1">Action</div>
                    <div className="col-span-1">View</div>
                </div>
                {upcomingAuctions.map((auction, index) => (
                    <div
                        key={index}
                        className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
                    >
                        <div className="grid grid-cols-8 gap-3 items-center">
                            <div className="col-span-2 font-semibold text-slate-200">
                                {auction.title}
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <User className="w-3 h-3" />
                                {auction.auctioneer}
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{auction.startTime}</span>
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{auction.endTime}</span>
                            </div>
                            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-xs font-semibold text-green-400">
                                    {formatCurrency(auction.baseAmount)}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <ActionButton
                                    type="register"
                                    onClick={() => openRegistrationModal(auction)}
                                    isRegistered={registeredAuctions.has(auction.title)}
                                />
                            </div>
                            <div className="col-span-1">
                                <ActionButton
                                    type="view"
                                    onClick={() => handleView(auction)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Step-by-Step Registration Modal */}
            {selectedAuction && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Register for Auction
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">{getStepTitle()}</p>
                            </div>
                            <button
                                onClick={closeRegistrationModal}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Indicator */}
                        <div className="px-6 py-3 bg-slate-700/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-300">Step {currentStep} of 2</span>
                                <span className="text-xs text-slate-400">{Math.round((currentStep / 2) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-600/50 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / 2) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Auction Title */}
                        <div className="px-6 py-2 bg-slate-700/20 border-b border-slate-700/50">
                            <div className="text-center text-slate-300 font-medium text-sm">
                                {selectedAuction.title}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                            {renderStepContent()}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-700/50">
                            <div className="flex gap-3">
                                {currentStep > 1 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                )}

                                {currentStep < 2 ? (
                                    <button
                                        onClick={nextStep}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pay & Register
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed View Modal - MOVED OUTSIDE OF REGISTRATION MODAL */}
            {showViewModal && viewingAuction && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">
                                    {viewingAuction.title}
                                </h2>
                                <p className="text-sm text-blue-300 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Auctioneer: {viewingAuction.auctioneer}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Image and Basic Info */}
                                <div className="space-y-4">
                                    {/* Item Image */}
                                    <div className="relative rounded-xl overflow-hidden bg-slate-700/30 border border-slate-600/30">
                                        <img
                                            src={viewingAuction.itemImage}
                                            alt={viewingAuction.title}
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='16' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-semibold rounded-full">
                                                {viewingAuction.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="w-4 h-4 text-green-400" />
                                                <span className="text-xs text-slate-400">Base Amount</span>
                                            </div>
                                            <div className="text-lg font-bold text-green-400">
                                                {formatCurrency(viewingAuction.baseAmount)}
                                            </div>
                                        </div>
                                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Shield className="w-4 h-4 text-blue-400" />
                                                <span className="text-xs text-slate-400">Security Deposit</span>
                                            </div>
                                            <div className="text-lg font-bold text-blue-400">
                                                {formatCurrency(viewingAuction.securityDeposit)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Participants */}
                                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Participants className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm font-semibold text-slate-300">Expected Participants</span>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-400">
                                            {viewingAuction.estimatedParticipants}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Details */}
                                <div className="space-y-4">
                                    {/* Timing Information */}
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-amber-400" />
                                            Auction Schedule
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-green-400" />
                                                <span className="text-slate-400">Start:</span>
                                                <span className="text-slate-200">{viewingAuction.startTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-red-400" />
                                                <span className="text-slate-400">End:</span>
                                                <span className="text-slate-200">{viewingAuction.endTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                            <Location className="w-5 h-5 text-blue-400" />
                                            Location
                                        </h3>
                                        <p className="text-slate-300 text-sm">{viewingAuction.location}</p>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                            <Description className="w-5 h-5 text-indigo-400" />
                                            Description
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {viewingAuction.description}
                                        </p>
                                    </div>

                                    {/* Specifications */}
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-cyan-400" />
                                            Specifications
                                        </h3>
                                        <ul className="space-y-2">
                                            {viewingAuction.specifications.map((spec, index) => (
                                                <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    {spec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-orange-400" />
                                            Terms & Conditions
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {viewingAuction.terms}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-700/20">
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openRegistrationModal(viewingAuction);
                                    }}
                                    disabled={registeredAuctions.has(viewingAuction.title)}
                                    className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 ${
                                        registeredAuctions.has(viewingAuction.title)
                                            ? 'bg-gray-500 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-lg'
                                    }`}
                                >
                                    {registeredAuctions.has(viewingAuction.title) ? 'Already Registered' : 'Register Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingAuctions;