import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import QualifierPage from "./pages/QualifierPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import FAQPage from "./pages/FAQPage";
import AdminPage from "./pages/AdminPage";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/qualifier" element={<QualifierPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/cancel" element={<CancelPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
        </div>
    );
}

export default App;
