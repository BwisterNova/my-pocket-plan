import styles from "./home.module.css";
import Typewriter from "typewriter-effect";
import { useEffect, useState } from "react";

// Components
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import GoalForm from "../../components/GoalForm/GoalForm";
import { useRef } from "react";

export default function Home({ isSidebarCollapsed, scrollToSection }) {
  //Format date like "Week Day, Month, Day Number"
  const [today, setToday] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  );

  useEffect(() => {
    //check every 1 minute if the date Change
    const interval = setInterval(() => {
      const newDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      setToday(newDate);
    }, 60000); //check every 1 minute

    return () => clearInterval(interval); //cleanup on unmount
  }, []);

  // Refs for smooth scroll
  const dashboardRef = useRef(null);
  const transactionRef = useRef(null);
  const goalRef = useRef(null);

  // Expose scroll handler to parent
  if (scrollToSection) {
    scrollToSection.current = {
      dashboard: () =>
        dashboardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      transaction: () =>
        transactionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      goal: () =>
        goalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    };
  }

  return (
    <>
      <main
        className={`${styles.mainHeader} ${
          isSidebarCollapsed ? styles.collapsedMargin : styles.expandedMargin
        }`}
      >
        <div className={styles.topBar}></div>
        <h1 className={styles.typewriter}>
          <Typewriter
            options={{
              strings: [
                "Welcome User 😊",
                "Your personal finance assistant 🤖",
                "Manage your pocket 💰",
                "Stay in control 🔒",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 100,
            }}
          />
        </h1>
        <p className={styles.date}>{today}</p>
        {/* Section for Dashboard and Forms */}
        <div>
          <div ref={dashboardRef}>
            <DashboardCard />
          </div>
          <div ref={transactionRef}>
            <TransactionForm />
          </div>
          <div ref={goalRef}>
            <GoalForm />
          </div>
        </div>
      </main>
    </>
  );
}
