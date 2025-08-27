import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  Clock,
  Gavel,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyAuctions = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [searchTerm, setSearchTerm] = useState("");
  const [auctions, setAuctions] = useState({ ongoing: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?._id) {
          console.warn("No logged-in user found. Redirecting to login.");
          navigate("/signin"); // redirect if no user
          return;
        }

        const userId = user._id;

        const res = await axios.get(
          `http://localhost:9000/api/auctionRegistrations/registered/${userId}`
        );

        // Assume backend returns { ongoing: [...], upcoming: [...] }
        setAuctions(res.data);

        // Automatically switch to upcoming if ongoing is empty
        if (res.data.ongoing.length === 0 && res.data.upcoming.length > 0) {
          setActiveTab("upcoming");
        }
      } catch (err) {
        console.error("Error fetching my auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [navigate]);

  const handleClick = (auctionId) => {
    navigate(`/live/${auctionId}`);
  };

  const filteredAuctions = auctions[activeTab]?.filter((auction) =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOngoingAuction = (auction) => (
    <div
      key={auction._id}
      className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-sky-500/30 hover:border-sky-400/50 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
            🎯
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm md:text-base mb-1 truncate">
              {auction.title}
            </h3>
            <div className="text-sm text-slate-400">
              <span>Auction in progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-slate-400 text-xs">Base Amount</p>
        <p className="text-white font-bold text-base md:text-lg">
          ₹{auction.startingBid.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 text-orange-400">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Live</span>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => handleClick(auction._id)}
            className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-400 text-white px-8 py-1 rounded-lg text-s font-medium transition-colors"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpcomingAuction = (auction) => (
    <div
      key={auction._id}
      className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-sky-500/30 hover:border-sky-400/50 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
            📅
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-base md:text-lg mb-1 truncate">
              {auction.title}
            </h3>
            <div className="text-sm text-slate-400">
              <span>Scheduled auction</span>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30 self-start">
          <span className="text-yellow-400 text-sm font-medium">Upcoming</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-slate-400 text-xs">Base Amount</p>
        <p className="text-white font-bold text-base md:text-lg">
          ₹{auction.startingBid.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 text-yellow-400">
          <Calendar className="w-4 h-4" />
          <span className="font-medium text-sm">
            {new Date(auction.startTime).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button className="bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm text-white p-2 rounded-lg border border-sky-500/30 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  My Auctions
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  Track all your auction activities
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:border-sky-400 focus:outline-none w-full sm:w-64"
                />
              </div>
              <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-600 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-slate-800/50 rounded-xl p-1 mb-6 sm:mb-8 max-w-full sm:max-w-lg overflow-x-auto">
          {[
            {
              id: "ongoing",
              label: "Ongoing",
              icon: PlayCircle,
              count: auctions.ongoing.length,
            },
            {
              id: "upcoming",
              label: "Upcoming",
              icon: Calendar,
              count: auctions.upcoming.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-sky-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              <span className="bg-slate-600 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-slate-400">Loading auctions...</p>
          ) : filteredAuctions?.length > 0 ? (
            <>
              {activeTab === "ongoing" &&
                filteredAuctions.map(renderOngoingAuction)}
              {activeTab === "upcoming" &&
                filteredAuctions.map(renderUpcomingAuction)}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No auctions found
              </h3>
              <p className="text-slate-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : `You haven't participated in any ${activeTab} auctions yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuctions;
