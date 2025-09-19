import { Routes, Route } from "react-router";
import Explore from "../pages/public/Explore";
import Search from "../pages/public/Search";
import SearchResult from "../pages/public/SearchResult";
import EventDetails from "../pages/public/EventDetails";
import Bookmarked from "../pages/public/Bookmarked";
import Profile from "../pages/public/Profile";
import Chat from "../pages/public/Chat";
import SignIn from "../pages/public/SignIn";
import SignUp from "../pages/public/SignUp";
import Location from "../pages/public/Location";
import Interests from "../pages/public/Interests";
import About from "../pages/public/About";
import Support from "../pages/public/Support";
import Privacy from "../pages/public/Privacy";
import MainLayout from "../layouts/MainLayout";
import Settings from "../pages/public/Settings";
import AppBarLayout from "../layouts/AppBarLayout";
import ProviderDetails from "../pages/public/ProviderDetails";
import ChatLayout from "../layouts/ChatLayout";
import Welcome from "@/pages/public/Welcome";
import TermsOfUse from "@/pages/public/TermsOfUse";
import DataSettings from "@/pages/public/DataSettings";
import Feedback from "@/pages/public/Feedback";

const PublicRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/" element={<Welcome />} />

    <Route path="/location" element={<Location />} />
    <Route path="/interests" element={<Interests />} />

    <Route element={<ChatLayout />}>
      <Route path="/chat" element={<Chat />} />
    </Route>

    <Route element={<MainLayout />}>
      <Route path="/explore" element={<Explore />} />
      <Route path="/bookmarked" element={<Bookmarked />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/search" element={<Search />} />
      <Route path="/search/result" element={<SearchResult />} />
    </Route>

    <Route path="/events/:id" element={<EventDetails />} />
    <Route path="/providers/:id" element={<ProviderDetails />} />

    <Route element={<AppBarLayout />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/data-settings" element={<DataSettings />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/support" element={<Support />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/feedback" element={<Feedback />}></Route>
    </Route>
  </Routes>
);

export default PublicRoutes;
