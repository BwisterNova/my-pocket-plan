import styles from "./settings.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

//Settings components
import ProfileSettings from "../../components/SettingsComponent/Profile/ProfileSettings";

// Icons
import {
  FaUserCircle,
  FaPalette,
  FaMoneyBillWave,
  FaChevronRight,
} from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { MdOutlineLanguage } from "react-icons/md";
import { BiReset } from "react-icons/bi";

// Settings items list (title, subtitle, icon, link)
const settingsItems = [
  {
    title: "Profile",
    subtitle: "Manage your account details",
    icon: <FaUserCircle />,
    link: "/settings/profile",
  },
  {
    title: "Theme",
    subtitle: "Switch between light & dark mode",
    icon: <FaPalette />,
    link: "/settings/theme",
  },
  {
    title: "Currency",
    subtitle: "Choose your preferred currency",
    icon: <FaMoneyBillWave />,
    link: "/settings/currency",
  },
  {
    title: "Language",
    subtitle: "Select app display language",
    icon: <MdOutlineLanguage />,
    link: "/settings/language",
  },
  {
    title: "Data Reset",
    subtitle: "Clear all stored app data",
    icon: <BiReset />,
    link: "/settings/data-reset",
  },
  {
    title: "Contact & Feedback",
    subtitle: "Share your thoughts with us",
    icon: <BiUserCircle />,
    link: "/settings/contact-feedback",
  },
];

export default function Settings({ isSidebarCollapsed }) {
  const navigate = useNavigate();
  return (
    <main
      className={`${styles.settings} ${
        isSidebarCollapsed ? styles.collapsedMargin : styles.expandedMargin
      }`}
    >
      {/* Page Header */}
      <h1 className={styles.header}>Settings ⚙️</h1>
      <p className={styles.subHeader}>
        Customize your preferences and manage your account
      </p>

      {/* Settings Items */}
      <div className={styles.itemsContainer}>
        {settingsItems.map((item, index) => (
          <motion.div
            key={index}
            className={styles.item}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
            onClick={() => {
              if (item.link) navigate(item.link);
            }}
            style={{ cursor: item.link ? "pointer" : "default" }}
          >
            <div className={styles.icon} style={{ color: "#fff" }}>
              {item.icon}
            </div>
            <div className={styles.texts}>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <span className={styles.rightArrow}>
              <FaChevronRight />
            </span>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
