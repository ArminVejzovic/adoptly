import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState(null);

  const handleFaqClick = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqData = [
    {
      question: 'How do I adopt an animal?',
      answer: 'Register as a user, browse available animals, and submit an adoption request to the owner.'
    },
    {
      question: 'Can I use the app without registering?',
      answer: 'Yes, as a guest you can view animals and blog posts, but registration is required for messaging and applying.'
    },
    {
      question: 'What is the AI Recommender?',
      answer: 'It uses your lifestyle answers to suggest pets that best match your preferences and environment.'
    },
    {
      question: 'Can I adopt multiple animals?',
      answer: 'Absolutely! You can submit multiple adoption applications and track each one from your dashboard.'
    },
    {
      question: 'Who can post adoption listings?',
      answer: 'Only registered owners can create listings to give their pets up for adoption.'
    },
    {
      question: 'How can I report abuse or suspicious behavior?',
      answer: 'Each listing has a report option. Our admin team manually reviews every report to ensure safety.'
    },
  ];

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="header-left">
          <img src="adoptly_logo.png" alt="Adoptly Logo" className="landing-logo" />
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/guest-dashboard')}>Continue as Guest</button>
        </div>
      </div>

      <div className="landing-content">
        <h1>Welcome to Adoptly 🐾</h1>
        <p>Find your new best friend – adopt, foster or help animals in need.</p>
      </div>

      <div className="landing-hero">
        <img src="adoptly2.jpg" alt="Happy pets" />
      </div>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleFaqClick(index)}
            >
              <div className="faq-question">
                {item.question}
                <span className="arrow">{activeIndex === index ? '▲' : '▼'}</span>
              </div>
              {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Adoptly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
