import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

// Import separate components
import Navbar from '../../components/Navbar';
import OngoingAuctions from '../../components/auction/OngoingAuctions';
import UpcomingAuctions from '../../components/auction/UpcomingAuctions';
import CompletedAuctions from '../../components/auction/CompletedAuctions';


const AuctionHomepage = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registeredAuctions, setRegisteredAuctions] = useState(new Set());
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Remove these states as they're now handled in UpcomingAuctions component
  // const [showViewModal, setShowViewModal] = useState(false);
  // const [viewingAuction, setViewingAuction] = useState(null);
  
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [timers, setTimers] = useState({
    'laptop': { hours: 2, minutes: 28, seconds: 0 },
    'furniture': { hours: 4, minutes: 55, seconds: 15 },
    'software': { hours: 1, minutes: 12, seconds: 45 }
  });
  const [counters, setCounters] = useState({
    auctionValue: 0,
    successfulAuctions: 0,
    enterpriseClients: 0,
    securityUptime: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(key => {
          let { hours, minutes, seconds } = newTimers[key];
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
              minutes = 59;
              hours--;
              if (hours < 0) {
                newTimers[key] = { hours: 0, minutes: 0, seconds: 0 };
                return;
              }
            }
          }
          newTimers[key] = { hours, minutes, seconds };
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animate counters on component mount
  useEffect(() => {
    const animateCounters = () => {
      const targetValues = {
        auctionValue: 2.5,
        successfulAuctions: 15000,
        enterpriseClients: 500,
        securityUptime: 99.9
      };

      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const updateCounters = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setCounters({
          auctionValue: targetValues.auctionValue * easeOutQuart,
          successfulAuctions: Math.floor(targetValues.successfulAuctions * easeOutQuart),
          enterpriseClients: Math.floor(targetValues.enterpriseClients * easeOutQuart),
          securityUptime: targetValues.securityUptime * easeOutQuart
        });

        if (progress < 1) {
          requestAnimationFrame(updateCounters);
        }
      };

      requestAnimationFrame(updateCounters);
    };

    if (!hasAnimated) {
      // Delay animation to make it more noticeable
      const timer = setTimeout(() => {
        animateCounters();
        setHasAnimated(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  const formatCounterValue = (key, value) => {
    switch (key) {
      case 'auctionValue':
        return `$${value.toFixed(1)}B+`;
      case 'successfulAuctions':
        return `${value.toLocaleString()}+`;
      case 'enterpriseClients':
        return `${value}+`;
      case 'securityUptime':
        return `🛡 ${value.toFixed(1)}%`;
      default:
        return value;
    }
  };

  const TabButton = ({ tab, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 transform -translate-y-1'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // const handleRegister = (auction) => {
  //   setSelectedAuction(auction);
  //   setShowRegistrationModal(true);
  // };

  // Remove the handleView function as it's now handled in UpcomingAuctions component
  // const handleView = (auction) => {
  //   setViewingAuction(auction);
  //   setShowViewModal(true);
  // };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Add auction to registered list
    setRegisteredAuctions(prev => new Set([...prev, selectedAuction.title]));
    setShowRegistrationModal(false);
    setShowSuccessMessage(true);
    
    // Clear form
    setRegistrationData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: ''
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
  {/* Navbar */}
  <Navbar 
    isMobileMenuOpen={isMobileMenuOpen} 
    setIsMobileMenuOpen={setIsMobileMenuOpen} 
    className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-transparent backdrop-blur-md"
  />
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden pt-32">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10"></div>
    <div className="relative max-w-7xl mx-auto px-4 py-8 text-center">
      <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
        Quantum Bid
      </h1>
      <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
        Experience the future of professional auctions with our cutting-edge platform. 
        Secure, transparent, and trusted by industry leaders worldwide.
      </p>
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Quantum-Bid
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            Experience the future of professional auctions with our cutting-edge platform. 
            Secure, transparent, and trusted by industry leaders worldwide.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:transform hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-5 h-5" />
              Explore Live Auctions
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatCounterValue('auctionValue', counters.auctionValue)}
              </div>
              <div className="text-slate-400 font-medium text-sm">Total Auction Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatCounterValue('successfulAuctions', counters.successfulAuctions)}
              </div>
              <div className="text-slate-400 font-medium text-sm">Successful Auctions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatCounterValue('enterpriseClients', counters.enterpriseClients)}
              </div>
              <div className="text-slate-400 font-medium text-sm">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {formatCounterValue('securityUptime', counters.securityUptime)}
              </div>
              <div className="text-slate-400 font-medium text-sm">Security Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Tables Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-2 mb-8">
          <TabButton
            tab="ongoing"
            label="Ongoing"
            icon={<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/60"></div>}
            isActive={activeTab === 'ongoing'}
            onClick={setActiveTab}
          />
          <TabButton
            tab="upcoming"
            label="Upcoming"
            icon={<div className="w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/60"></div>}
            isActive={activeTab === 'upcoming'}
            onClick={setActiveTab}
          />
          <TabButton
            tab="completed"
            label="Completed"
            icon={<div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/60"></div>}
            isActive={activeTab === 'completed'}
            onClick={setActiveTab}
          />
        </div>

        {/* Ongoing Auctions */}
        {activeTab === 'ongoing' && (
          <OngoingAuctions timers={timers} />
        )}

        {/* Upcoming Auctions - Remove the props that are no longer needed */}
        {activeTab === 'upcoming' && (
          <UpcomingAuctions 
            registeredAuctions={registeredAuctions} 
            // Remove these props as they're now handled internally in UpcomingAuctions
            // handleRegister={handleRegister}
            // handleView={handleView}
            // showViewModal={showViewModal}
            // setShowViewModal={setShowViewModal}
            // viewingAuction={viewingAuction}
            // setViewingAuction={setViewingAuction}
          />
        )}

        {/* Completed Auctions */}
        {activeTab === 'completed' && (
          <CompletedAuctions />
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Register for Auction</h3>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">✕</div>
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm font-semibold">{selectedAuction?.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={registrationData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                <textarea
                  name="address"
                  value={registrationData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRegistrationSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg border border-emerald-400/30 animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Successfully registered for the auction!</span>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  )
}
export default AuctionHomepage;