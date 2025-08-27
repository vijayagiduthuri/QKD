import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const ViewAuctionModal = ({
  auctionId,
  isOpen,
  onClose,
  registeredAuctions = new Set(),
  setSelectedAuction,
}) => {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auctionId || !isOpen) return;

    const fetchAuction = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:9000/api/auctions/${auctionId}`
        );
        setAuction(res.data);
      } catch (err) {
        setError("Failed to load auction details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId, isOpen]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <h2 className="text-xl font-bold text-white">Auction Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-slate-400">
              Loading auction details...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : auction ? (
            <div className="space-y-6">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {auction.title}
                </h1>
              </div>

              {/* Image */}
              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden bg-slate-700/30 border border-slate-600/30 w-full max-w-2xl h-80">
                  <img
                    src={`http://localhost:9000/api/auctions/${auctionId}/image`}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".no-image-fallback"
                      ).style.display = "flex";
                    }}
                  />
                  <div
                    className="no-image-fallback absolute inset-0 w-full h-full flex items-center justify-center bg-slate-700 text-slate-400"
                    style={{ display: "none" }}
                  >
                    No Image Available
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {auction.description}
                </p>
              </div>

              {/* Auction Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-white">
                      Auctioneer
                    </span>
                  </div>
                  <p className="text-slate-300">
                    {auction.auctionerId?.name || "Unknown"}
                  </p>
                </div>

                {auction.location && (
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-semibold text-white">
                        Location
                      </span>
                    </div>
                    <p className="text-slate-300">{auction.location}</p>
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Auction Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-400">Start:</span>
                    <span className="text-slate-200">
                      {new Date(auction.startDateTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-slate-400">End:</span>
                    <span className="text-slate-200">
                      {new Date(auction.endDateTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-white">
                      Base Price
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(auction.basePrice)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-white">
                      Registration Fee (10%)
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCurrency(auction.basePrice * 0.1)}
                  </div>
                </div>
              </div>

              {/* Static Auction Information */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Auction Terms & Conditions
                </h4>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Registration fee of 10% of base price must be paid to
                      participate
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Winning bidder must complete payment within 24 hours of
                      auction end
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>All sales are final - no returns or exchanges</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Items must be collected within 7 days of payment
                      completion
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Registration fee is non-refundable for unsuccessful
                      bidders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400">No details found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-700/20">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                setSelectedAuction(auction); // open registration modal
                onClose(); // close the ViewAuctionModal
              }}
              disabled={registeredAuctions.has(auction?.title)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg text-white ${
                registeredAuctions.has(auction?.title)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              }`}
            >
              {registeredAuctions.has(auction?.title)
                ? "Registered"
                : "Register for Auction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionModal;
