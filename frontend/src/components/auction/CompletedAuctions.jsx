import React, { useEffect, useState } from "react";
import { User, Calendar, Download } from "lucide-react";
import axios from "axios";

const CompletedAuctions = () => {
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/auctions/past");
        setCompletedAuctions(response.data.past);
      } catch (err) {
        setError("Failed to load completed auctions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedAuctions();
  }, []);

  const ActionButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs 
        bg-gradient-to-r from-indigo-500 to-indigo-600 
        hover:from-indigo-600 hover:to-indigo-700 
        text-white transition-all duration-300 
        hover:scale-105 hover:shadow-lg"
    >
      <Download className="w-3 h-3" />
      Report
    </button>
  );

  if (loading)
    return (
      <p className="text-center text-slate-400 py-4">
        Loading completed auctions...
      </p>
    );
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 
        grid grid-cols-6 gap-3 font-semibold text-white text-sm md:text-base">
        <div className="col-span-2">Auction Title</div>
        <div>Auctioneer</div>
        <div>Completion Date</div>
        <div>Winning Bid</div>
        <div>Action</div>
      </div>

      {/* Rows */}
      {Array.isArray(completedAuctions) && completedAuctions.length > 0 ? (
        completedAuctions.map((auction, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b border-slate-700/30 
              last:border-b-0 hover:bg-blue-500/5 
              transition-all duration-300 hover:translate-x-1"
          >
            <div className="grid grid-cols-6 gap-3 items-center text-sm md:text-base">
              {/* Title */}
              <div className="col-span-2 font-semibold text-slate-200">
                {auction.title}
              </div>

              {/* Auctioneer */}
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <User className="w-3 h-3" />
                {auction.auctioneer}
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <Calendar className="w-3 h-3" />
                <span>{auction.completionDate}</span>
              </div>

              {/* Winning Bid */}
              <div className="font-bold text-emerald-400">
                {auction.winningBid}
              </div>

              {/* Action */}
              <div>
                <ActionButton
                  onClick={() =>
                    console.log(`Download report for ${auction.title}`)
                  }
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-400 py-4">
          No completed auctions found.
        </p>
      )}
    </div>
  );
};

export default CompletedAuctions;
