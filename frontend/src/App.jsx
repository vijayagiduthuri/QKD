import { Routes, Route } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import AuctionHomepage from "./pages/Auctions/AuctionHome";
import AuctionRegistrationForm from './components/auction/AuctionRegistrationForm';
import Landing from "./pages/Landing";
import AboutUs from "./pages/Auctions/AboutUs";
import Faqs from "./pages/Auctions/Faqs";
import LiveAuction from "./pages/Auctions/LiveAuction";
import ViewLiveAuction from "./pages/Auctions/ViewLiveAuction";
import UserProfile from "./pages/UserProfile";
import MyAuctions from "./pages/MyAuctions";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />   
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<AuctionHomepage />} />
      <Route path="/live/:auctionId" element={<LiveAuction/>}/>
      <Route path="/about" element={<AboutUs/>}/>
      <Route path="/faqs" element={<Faqs/>}/>
      <Route path="/view-auction" element={<ViewLiveAuction/>}/>
      <Route path="/profile" element={<UserProfile/>}/>
      <Route path="my-auctions" element={<MyAuctions/>}/>
    </Routes>
  );
}

export default App;
