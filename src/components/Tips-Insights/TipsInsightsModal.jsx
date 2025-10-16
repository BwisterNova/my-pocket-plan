import React from "react";
import styles from "./tipsInsightsModal.module.css";

export default function TipsInsightsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  // Prevent background scroll when modal is open
  document.body.style.overflow = "hidden";
  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={handleClose}>
          &times;
        </button>
        <h2 className={styles.title}>Tips & Insights</h2>
        <div className={styles.content}>
          <p>
            Welcome to My Pocket Plan! This app helps you manage your personal
            finances with ease. Here’s how you can make the most of it:
          </p>
          <ul>
            <li>
              <b>Dashboard:</b> Get a quick overview of your financial status,
              including income, expenses, and goals.
            </li>
            <li>
              <b>Add Transaction:</b> Easily record your income and expenses to
              keep your budget up to date.
            </li>
            <li>
              <b>Goals:</b> Set financial goals and track your progress
              visually.
            </li>
            <li>
              <b>Reports:</b> Analyze your spending habits and savings trends
              with interactive charts.
            </li>
            <li>
              <b>Settings:</b> Customize your experience, manage your profile,
              and adjust preferences.
            </li>
            <li>
              <b>AI Assistant:</b> Get smart suggestions and insights to improve
              your financial health.
            </li>
          </ul>
          <p>
            <b>Tips:</b>
            <ul>
              <li>Use the sidebar to quickly navigate between sections.</li>
              <li>Click on the AI Assistant for personalized advice.</li>
              <li>
                Review your reports regularly to spot trends and optimize your
                budget.
              </li>
              <li>Set realistic goals and monitor your progress.</li>
              <li>Customize currency, theme, and language in Settings.</li>
            </ul>
          </p>
          <p>
            For more help, check the documentation or reach out via the support
            section.
          </p>
        </div>
      </div>
    </div>
  );
}
