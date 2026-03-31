import Header from '../../components/header';
import './index.css';

export default function HelpdeskPage() {
  return (
    <div className="helpdesk-page animate-fade-in">
      <Header />
      <main className="helpdesk-main">
        <h1 className="helpdesk-title">HELPDESK</h1>
        <p className="helpdesk-subtitle">How can we support your SwiftStyle experience today?</p>
        
        <div className="faq-container">
          <h2 className="faq-heading">Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>How long does manufacturing take?</h3>
            <p>Our custom jackets are made to order and typically ship within 3-4 weeks. Quality craftsmanship takes time.</p>
          </div>
          
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>Due to the custom nature of our products, we do not accept returns unless there is a manufacturing defect.</p>
          </div>
          
          <div className="faq-item">
            <h3>How do I care for my jacket?</h3>
            <p>We recommend professional leather cleaning only. Avoid prolonged exposure to direct sunlight and moisture.</p>
          </div>
          
          <div className="faq-item">
            <h3>Jacket Sizing Guide (Chest Measurement)</h3>
            <div className="size-table-container">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Centimeters (cm)</th>
                    <th>Inches (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>XXS</td><td>81 - 86 cm</td><td>32 - 34"</td></tr>
                  <tr><td>XS</td><td>86 - 91 cm</td><td>34 - 36"</td></tr>
                  <tr><td>S</td><td>91 - 96 cm</td><td>36 - 38"</td></tr>
                  <tr><td>M</td><td>96 - 101 cm</td><td>38 - 40"</td></tr>
                  <tr><td>L</td><td>101 - 106 cm</td><td>40 - 42"</td></tr>
                  <tr><td>XL</td><td>106 - 111 cm</td><td>42 - 44"</td></tr>
                  <tr><td>XXL</td><td>111 - 116 cm</td><td>44 - 46"</td></tr>
                  <tr><td>3XL</td><td>116 - 121 cm</td><td>46 - 48"</td></tr>
                  <tr><td>4XL</td><td>121 - 126 cm</td><td>48 - 50"</td></tr>
                  <tr><td>5XL</td><td>126 - 131 cm</td><td>50 - 52"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
