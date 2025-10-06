import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AiAssistant from "./components/AIAssistant/AIAssistant";
import { useState, useRef } from "react";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import ProfileSettings from "./components/SettingsComponent/Profile/ProfileSettings";
import Theme from "./components/SettingsComponent/Theme/Theme";
import CurrencySettings from "./components/SettingsComponent/Currency/currencySettings";
import LanguageSettings from "./components/SettingsComponent/Language/LanguageSettings";
import DataReset from "./components/SettingsComponent/Data-Reset/DataReset";
import ContactFeedback from "./components/SettingsComponent/Contact-Feedback/ContactFeedback";

function App() {
  //Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); //if true makes it collapsed by default
  // AI Assistant panel state
  const [aiOpen, setAiOpen] = useState(false);

  //Toggle function
  function toggleSidebar() {
    setIsSidebarCollapsed((prev) => !prev);
  }

  // Open AI Assistant panel
  function openAiPanel() {
    setAiOpen(true);
  }
  // Close AI Assistant panel
  function closeAiPanel() {
    setAiOpen(false);
  }

  // Smooth scroll handler for Home sections
  const scrollToSection = useRef(null);

  // Handler for Navbar to trigger scroll
  function handleScrollTo(section) {
    if (scrollToSection.current && scrollToSection.current[section]) {
      scrollToSection.current[section]();
    }
  }

  return (
    <>
      <Router>
        <Navbar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          openAiPanel={openAiPanel}
          scrollTo={handleScrollTo}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                isSidebarCollapsed={isSidebarCollapsed}
                scrollToSection={scrollToSection}
              />
            }
          />
          <Route
            path="/reports"
            element={<Reports isSidebarCollapsed={isSidebarCollapsed} />}
          />

          <Route
            path="/settings"
            element={<Settings isSidebarCollapsed={isSidebarCollapsed} />}
          />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/theme" element={<Theme />} />
          <Route path="/settings/currency" element={<CurrencySettings />} />
          <Route path="/settings/language" element={<LanguageSettings />} />
          <Route path="/settings/data-reset" element={<DataReset />} />
          <Route
            path="/settings/contact-feedback"
            element={<ContactFeedback />}
          />
        </Routes>
      </Router>

      {/* AI Assistant Panel (fixed, overlays content) */}
      <AiAssistant isOpen={aiOpen} onClose={closeAiPanel} />
    </>
  );
}

export default App;
