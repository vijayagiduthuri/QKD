import React, { useEffect, useState } from "react";
import { User, Calendar } from "lucide-react";
import axios from "axios";
import RegistrationModal from "./RegistrationModal";
import ViewAuctionModal from "./ViewAuctionModal";

const UpcomingAuctions = ({ userId }) => {
  const [currentBidderId, setCurrentBidderId] = useState(null);
  useEffect(() => {
    const fetchCurrentBidder = async () => {
      try {
        const res = await fetch(
          "http://localhost:9000/api/bids/get-bidder-id",
          {
            method: "GET",
            credentials: "include", // include cookies if JWT is stored there
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch current bidder");
        }

        const data = await res.json();
        console.log("Current logged-in bidder ID:", data.userId);
        setCurrentBidderId(data.userId);
      } catch (err) {
        console.error("Error fetching current bidder:", err);
      }
    };

    fetchCurrentBidder();
  }, []);
  userId  =currentBidderId
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [registeredAuctions, setRegisteredAuctions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [viewAuction, setViewAuction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [upcomingRes, registeredRes] = await Promise.all([
          axios.get("http://localhost:9000/api/auctions/upcoming"),
          userId
            ? axios.get(
                `http://localhost:9000/api/auctionRegistrations/registered/${userId}`
              )
            : Promise.resolve({ data: { registeredAuctionIds: [] } }),
        ]);

        setUpcomingAuctions(upcomingRes.data.upcoming);
        setRegisteredAuctions(new Set(registeredRes.data.registeredAuctionIds));
      } catch (err) {
        setError("Failed to load auctions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Inside UpcomingAuctions.jsx
  useEffect(() => {
    const paymentStatus = sessionStorage.getItem("paymentStatus");
    const paidAuctionId = sessionStorage.getItem("auctionId");

    if (paymentStatus && paidAuctionId && upcomingAuctions.length > 0) {
      const auction = upcomingAuctions.find((a) => a._id === paidAuctionId);

      if (auction) {
        setSelectedAuction({
          ...auction,
          basePrice: auction.baseAmount,
          paymentDone: paymentStatus === "success",
        });
      }

      // Clear storage
      sessionStorage.removeItem("paymentStatus");
      sessionStorage.removeItem("auctionId");
    }
  }, [upcomingAuctions]);

  //const [registeredAuctions, setRegisteredAuctions] = useState(new Set());

  useEffect(() => {
    if (!userId || upcomingAuctions.length === 0) return;

    const fetchRegisteredForAuction = async (auction) => {
      try {
        const res = await fetch(
          `http://localhost:9000/api/auctionRegistrations/${auction._id}/${userId}`
        );
        const data = await res.json();
        if (data.registered) {
          setRegisteredAuctions((prev) => new Set(prev).add(auction._id));
        }
      } catch (err) {
        console.error(
          "Error fetching registration for auction:",
          auction._id,
          err
        );
      }
    };

    upcomingAuctions.forEach((auction) => fetchRegisteredForAuction(auction));
  }, [upcomingAuctions, userId]);

  const ActionButton = ({ type, onClick, isRegistered = false }) => {
    const label =
      type === "register" ? (isRegistered ? "Registered" : "Register") : "View";

    return (
      <button
        onClick={onClick}
        disabled={isRegistered}
        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:scale-105 ${
          type === "register"
            ? isRegistered
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
        }`}
      >
        {label}
      </button>
    );
  };

  if (loading)
    return (
      <p className="text-center text-slate-400 py-4">
        Loading upcoming auctions...
      </p>
    );

  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 font-semibold text-white text-sm md:text-base">
          <div>Auction Title</div>
          <div>Auctioneer</div>
          <div>Base Price</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        {Array.isArray(upcomingAuctions) && upcomingAuctions.length > 0 ? (
          upcomingAuctions.map((auction, index) => (
            <div
              key={index}
              className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-green-500/5 transition-all duration-300 hover:translate-x-1"
            >
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center text-sm md:text-base">
                <div className="font-semibold text-slate-200">
                  {auction.title}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <User className="w-3 h-3" />
                  {auction.auctioneer}
                </div>
                <div className="text-slate-200 font-medium">
                  ₹{auction.baseAmount}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{auction.startTime}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{auction.endTime}</span>
                </div>
                <div className="flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedAuction(auction)}
                    disabled={registeredAuctions.has(auction._id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:scale-105 ${
                      registeredAuctions.has(auction._id)
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {registeredAuctions.has(auction._id)
                      ? "Registered"
                      : "Register"}
                  </button>

                  <ActionButton
                    type="view"
                    onClick={() => setViewAuction(auction._id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 py-4">
            No upcoming auctions found.
          </p>
        )}
      </div>

      {/* Registration Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <RegistrationModal
            selectedAuction={{
              ...selectedAuction,
              basePrice: selectedAuction.baseAmount,
              
            }}
            isOpen={!!selectedAuction}
            paymentDone={selectedAuction?.paymentDone} // pass it here
            onClose={() => setSelectedAuction(null)}
            userId={userId}
            onSuccess={(data) => {
              console.log("Registration successful:", data);
              setRegisteredAuctions((prev) =>
                new Set(prev).add(data.selectedAuction._id)
              );
            }}
          />
        </div>
      )}

      {/* View Auction Modal */}
      {viewAuction && (
        <ViewAuctionModal
          auctionId={viewAuction}
          isOpen={!!viewAuction}
          onClose={() => setViewAuction(null)}
          registeredAuctions={registeredAuctions}
          setSelectedAuction={setSelectedAuction}
        />
      )}
    </>
  );
};

export default UpcomingAuctions;
