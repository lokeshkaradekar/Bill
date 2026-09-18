import wavesArt from '../assets/rkk-footer-waves.png?inline';

export default function BillFooter({ showAmountPaid = true, amountPaid = '₹0.00', amountWords = '' }) {
  return (
    <footer className="reference-footer">
      <div className="footer-upper">
        <div className="footer-thanks-block">
          <div className="thanks-script">Thank You!</div>
          <div className="thanks-caps">FOR YOUR CONTINUED SUPPORT</div>
          <div className="thanks-line" />
          <div className="quote-brush">“Good Fish<br />Good Food<br />Better Tomorrow”</div>
        </div>
        <div className="terms-block">
          <h4>Terms &amp; Notes:</h4>
          <ul>
            <li>Rates are as per market prevailing rate.</li>
            <li>Goods once sold will not be taken back.</li>
            <li>This is a computer generated bill.</li>
            <li>For any queries, please contact the market.</li>
            <li>Thank you for your business.</li>
          </ul>
        </div>
        <div className="sign-block">
          <div>For</div>
          <strong>Rajendrakumar K Karadekar</strong>
          <div className="signature">Rajendra</div>
          <div className="signature-line" />
          <div>Authorized Signatory</div>
        </div>
      </div>
      {showAmountPaid && amountWords && (
        <div className="amount-paid-block">
          <div className="amount-paid-line">
            <span className="amount-paid-label">Amount Paid :</span>
            <span className="amount-paid-value">{amountPaid}</span>
          </div>
          <div className="amount-words-line">{amountWords}</div>
        </div>
      )}
      <div className="footer-wave-art">
        <img src={wavesArt} alt="" />
      </div>
      <div className="footer-contact-bar">
        <span>⌖ <b>Place:</b> Kumta</span>
        <span className="contact-divider" />
        <span>✉ <b>Gmail:</b> rkaradekar@gmail.com</span>
        <span className="contact-divider" />
        <span>☎ <b>Contact:</b> 9916183832</span>
        <span className="contact-divider" />
        <span>Freshness Always</span>
      </div>
    </footer>
  );
}
