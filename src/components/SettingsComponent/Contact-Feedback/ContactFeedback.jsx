import styles from "./contactFeedback.module.css";
import { useState } from "react";
import {
  FaEnvelope,
  FaStar,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaCommentDots,
} from "react-icons/fa";

export default function ContactFeedback() {
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Handle contact form submit
  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 3000);
    setContact({ name: "", email: "", message: "" });
    setShowContactForm(false);
  }

  // Handle feedback submit
  function handleFeedbackSubmit(e) {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
    setFeedback("");
    setRating(0);
  }

  // Social media links
  const socials = [
    { icon: <FaTwitter />, url: "https://twitter.com/" },
    { icon: <FaInstagram />, url: "https://instagram.com/" },
    { icon: <FaFacebook />, url: "https://facebook.com/" },
  ];

  return (
    <div className={styles.contactFeedback}>
      {/* Header */}
      <div className={styles.headerRow}>
        <FaCommentDots className={styles.headerIcon} />
        <h2 className={styles.headerTitle}>Contact & Feedback</h2>
      </div>

      {/* Contact Support Section */}
      <section className={styles.cardSection}>
        <div className={styles.cardHeader}>
          <FaEnvelope className={styles.cardIcon} />
          <h3>Contact Support</h3>
        </div>
        <p className={styles.cardSubtitle}>
          Need help? Reach out to our support team.
        </p>
        <button
          className={styles.contactBtn}
          onClick={() => setShowContactForm(true)}
        >
          Email Support
        </button>
        {showContactForm && (
          <form className={styles.contactForm} onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Your Message"
              value={contact.message}
              onChange={(e) =>
                setContact({ ...contact, message: e.target.value })
              }
              required
            />
            <div className={styles.formActions}>
              <button type="submit" className={styles.sendBtn}>
                Send
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
            </div>
            {contactSent && (
              <div className={styles.successMsg}>Message sent!</div>
            )}
          </form>
        )}
      </section>

      {/* Feedback Section */}
      <section className={styles.cardSection}>
        <div className={styles.cardHeader}>
          <FaStar className={styles.cardIcon} style={{ color: "#fbbf24" }} />
          <h3>Rate Us</h3>
        </div>
        <p className={styles.cardSubtitle}>
          Rate our app and share your feedback.
        </p>
        <form className={styles.feedbackForm} onSubmit={handleFeedbackSubmit}>
          <textarea
            placeholder="Type your review, complaint, or suggestion..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <div className={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={styles.star}
                style={{ color: star <= rating ? "#fbbf24" : "#e0e7ff" }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.sendBtn}>
              Submit Feedback
            </button>
          </div>
          {feedbackSent && (
            <div className={styles.successMsg}>Feedback sent!</div>
          )}
        </form>
      </section>

      {/* Follow Us Section */}
      <footer className={styles.footerSection}>
        <div className={styles.socialsRow}>
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <p className={styles.footerText}>Follow us for updates & support</p>
      </footer>
    </div>
  );
}
