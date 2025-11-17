import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ContentContactUs from "./Pages/ContactUs/ContentContactUs";
import ContentPakage from "./Pages/PakagesCategory/ContentPakage";
import ContentAbout from "./Pages/About/ContentAbout";
import ShowPakages from "./Pages/PakagesCategory/AfterLogin/ShowPakages";
import TourPakagesContent from "./Pages/TourPakages/TourPakagesContent";
import ContentHotelsGrid from "./Pages/PakagesCategory/AfterLogin/HotelsDetailsPage/ContentHotelsGrid";
import PakageDetailsContent from "./Pages/TourPakages/TourPakageDetailspage/PakageDetailsContent";
import PakageRegisterContent from "./Pages/PakagesCategory/PakageRegister/PakageRegisterContent";
import HelpContent from "./Pages/Help/HelpContent";
import DomesticPackages from "./Components/Home/Pakages/DomesticPakages";
import InternationalContent from "./Pages/PakagesCategory/InternationalPakageCategory/InternationalContent";
import InternationalPakages from "./Components/Home/Pakages/InternationalPakages";
import PanIndia from "./Components/Home/Pakages/PanIndia";
import ShowDomesticPakages from "./Pages/PakagesCategory/AfterLogin/ShowDomesticPakages";
import ShowInternationalPakages from "./Pages/PakagesCategory/AfterLogin/ShowInternationalPakages";
import ShowPanIndiaHotels from "./Pages/PakagesCategory/AfterLogin/ShowPanIndiaHotels";
import ResetContent from "./Pages/PakagesCategory/ResetContent";
import AccountContent from "./Pages/PakagesCategory/AccountContent";

function App() {
  return (
   <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/contact-us" element={<ContentContactUs/>}/>
    <Route path="/login" element={<ContentPakage/>}/>
    <Route path="/reset-password" element={<ResetContent/>}/>
    <Route path="/account" element={<AccountContent/>}/>
    <Route path="/register" element={<PakageRegisterContent/>}/>
    <Route path="/about" element={<ContentAbout/>}/>
    <Route path="/pakages" element={<ShowPakages/>}/>
    <Route path=":category/tour-pakages" element={<TourPakagesContent/>}/>
    <Route path="/hotels/:category" element={<ContentHotelsGrid/>}/>
    <Route path="/package/:slug" element={<PakageDetailsContent/>}/>
    <Route path="/help" element={<HelpContent/>}/>
    <Route path="/domestic" element={<ShowDomesticPakages/>}/>
    <Route path="/international" element={<ShowInternationalPakages/>}/>
    <Route path="/pan-india-hotels" element={<ShowPanIndiaHotels/>}/>
    <Route path="/international-pakage/:slug" element={<InternationalContent />} />

  </Routes>
  
  </BrowserRouter>
   
   </>
  );
}

export default App;
