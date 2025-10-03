import styles from "./navbar.module.css";
import logo from "../../assets/images/logo.png";
import {
  BiBarChartSquare,
  BiLeftArrow,
  BiMenu,
  BiSolidDashboard,
} from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import {
  FaMoneyBill1Wave,
  FaLightbulb,
  FaRobot,
  FaChartPie,
  FaBullseye,
} from "react-icons/fa6";
import { FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TipsInsightsModal from "../Tips-Insights/TipsInsightsModal";

export default function Navbar({
  isCollapsed,
  toggleSidebar,
  openAiPanel,
  scrollTo,
}) {
  // Hover states for each nav item
  const [dashboardHover, setDashboardHover] = useState(false);
  const [transactionsHover, setTransactionsHover] = useState(false);
  const [goalsHover, setGoalsHover] = useState(false);
  const [reportsHover, setReportsHover] = useState(false);
  const [settingsHover, setSettingsHover] = useState(false);
  const [themeHover, setThemeHover] = useState(false);
  const [tipsHover, setTipsHover] = useState(false);
  const [aiHover, setAiHover] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(false);
  // Tips/Insights modal state
  const [tipsOpen, setTipsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to handle Home section navigation from anywhere
  function handleHomeSection(section) {
    if (location.pathname !== "/") {
      navigate("/");
      // Delay scroll until after navigation
      setTimeout(() => {
        if (scrollTo) scrollTo(section);
      }, 100);
    } else {
      if (scrollTo) scrollTo(section);
    }
  }

  // Helper to check if route is active
  function isActive(path) {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  }

  return (
    <div>
      {/* Mobile Sidebar Menu Button */}
      <div className={styles.toggleContainer}>
        <button className={styles.sidebarMenuButton} onClick={toggleSidebar}>
          <BiMenu className={styles.menuButton} />
        </button>
      </div>

      <aside
        className={`${styles.sidebar}${
          isCollapsed ? " " + styles.collapsed : ""
        }`}
      >
        {/* sideBar Header */}
        <header className={styles.sidebarHeader}>
          {/*The logo */}
          <a href="#" className={styles.headerLogo}>
            <img src={logo} alt="My Pocket Plan Logo" />
          </a>
          <button className={styles.sidebarToggler} onClick={toggleSidebar}>
            <BiLeftArrow className={styles.rotate} />
          </button>
        </header>

        <nav className={styles.sidebarNav}>
          {/* Primary top Nav */}
          <ul className={`${styles["navList"]} ${styles["primaryNav"]}`}>
            {/* Dashboard nav item with smooth scroll */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setDashboardHover(true)}
              onMouseLeave={() => setDashboardHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={
                  isActive("/")
                    ? `${styles.navLink} ${styles.activeNav}`
                    : styles.navLink
                }
                onClick={() => handleHomeSection("dashboard")}
              >
                <BiSolidDashboard className={styles.ItemIcon} />
                <span className={styles.navLabel}>Dashboard</span>
              </button>
              {isCollapsed && dashboardHover && (
                <a href="/" className={styles.hoverMenu} tabIndex={0}>
                  Dashboard
                </a>
              )}
            </li>
            {/* Transactions nav item with smooth scroll */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setTransactionsHover(true)}
              onMouseLeave={() => setTransactionsHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={
                  isActive("/") ? `${styles.navLink} ` : styles.navLink
                }
                onClick={() => handleHomeSection("transaction")}
              >
                <FaMoneyBill1Wave className={styles.ItemIcon} />
                <span className={styles.navLabel}>Transactions</span>
              </button>
              {isCollapsed && transactionsHover && (
                <a href="/" className={styles.hoverMenu} tabIndex={0}>
                  Transactions
                </a>
              )}
            </li>
            {/* Goals nav item with smooth scroll */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setGoalsHover(true)}
              onMouseLeave={() => setGoalsHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={isActive("/") ? `${styles.navLink}` : styles.navLink}
                onClick={() => handleHomeSection("goal")}
              >
                <FaBullseye className={styles.ItemIcon} />
                <span className={styles.navLabel}>Goals</span>
              </button>
              {isCollapsed && goalsHover && (
                <a href="/" className={styles.hoverMenu} tabIndex={0}>
                  Goals
                </a>
              )}
            </li>
            {/* Reports nav item with hover menu for collapsed sidebar */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setReportsHover(true)}
              onMouseLeave={() => setReportsHover(false)}
              style={{ position: "relative" }}
            >
              <a
                href="/reports"
                className={
                  isActive("/reports")
                    ? `${styles.navLink} ${styles.activeNav}`
                    : styles.navLink
                }
              >
                <FaChartPie className={styles.ItemIcon} />
                <span className={styles.navLabel}>Reports</span>
              </a>
              {isCollapsed && reportsHover && (
                <a href="/reports" className={styles.hoverMenu} tabIndex={0}>
                  Reports
                </a>
              )}
            </li>

            {/* Tips / Insights nav item with hover menu for collapsed sidebar */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setTipsHover(true)}
              onMouseLeave={() => setTipsHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={styles.navLink}
                onClick={() => setTipsOpen(true)}
              >
                <FaLightbulb />
                <span className={styles.navLabel}>Tips / Insights</span>
              </button>
              {isCollapsed && tipsHover && (
                <a href="#" className={styles.hoverMenu} tabIndex={0}>
                  Insights
                </a>
              )}
            </li>

            {/* AI Assistant nav item */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setAiHover(true)}
              onMouseLeave={() => setAiHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  if (openAiPanel) openAiPanel();
                }}
              >
                <FaRobot className={styles.ItemIcon} />
                <span className={styles.navLabel}>AI Assistant</span>
                {isCollapsed && aiHover && (
                  <a href="#" className={styles.hoverMenu} tabIndex={0}>
                    AI Assistant
                  </a>
                )}
              </button>
            </li>

            {/* Theme nav item with hover menu for collapsed sidebar */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setThemeHover(true)}
              onMouseLeave={() => setThemeHover(false)}
              style={{ position: "relative" }}
            >
              <button
                className={styles.navLink}
                onClick={() => setTheme((prev) => !prev)}
              >
                {/* Animated icon transition */}
                <span className={styles.themeIconWrapper}>
                  {theme ? (
                    <FaSun className={styles.themeIcon} />
                  ) : (
                    <FaMoon className={styles.themeIcon} />
                  )}
                </span>
                {/* Animated label transition */}
                <span className={styles.navLabel}>
                  {theme ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              {isCollapsed && themeHover && (
                <a href="#" className={styles.hoverMenu} tabIndex={0}>
                  {theme ? (
                    <>
                      <FaSun className={styles.themeIcon} />
                      <span className={styles.navLabel}>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FaMoon className={styles.themeIcon} />
                      <span className={styles.navLabel}>Dark Mode</span>
                    </>
                  )}
                </a>
              )}
            </li>

            {/* Settings nav item with hover menu for collapsed sidebar */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setSettingsHover(true)}
              onMouseLeave={() => setSettingsHover(false)}
              style={{ position: "relative" }}
            >
              <a
                href="/settings"
                className={
                  isActive("/settings")
                    ? `${styles.navLink} ${styles.activeNav}`
                    : styles.navLink
                }
              >
                <CiSettings className={styles.ItemIcon} />
                <span className={styles.navLabel}>Settings</span>
              </a>
              {isCollapsed && settingsHover && (
                <a href="/settings" className={styles.hoverMenu} tabIndex={0}>
                  Settings
                </a>
              )}
            </li>
          </ul>

          {/* Secondary bottom nav */}
          <ul className={`${styles["navList"]} ${styles["secondaryNav"]}`}>
            {/* Theme nav item with hover menu for collapsed sidebar */}
          </ul>
        </nav>
      </aside>
      {/* Tips/Insights Modal */}
      <TipsInsightsModal isOpen={tipsOpen} onClose={() => setTipsOpen(false)} />
    </div>
  );
}
