import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const PaymentCallback = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auctionId = params.get("auction_id");
    const status = params.get("status");

    if (auctionId && status) {
      sessionStorage.setItem('userId', currentBidderId);
      sessionStorage.setItem("auctionId", auctionId);
      sessionStorage.setItem("paymentStatus", status);
    }

    // Redirect to upcoming auctions
    navigate("/upcoming-auctions");
  }, [navigate]);

  return (
    <div className="text-center mt-20 text-white">
      Processing payment...
    </div>
  );
};

export default PaymentCallback;
