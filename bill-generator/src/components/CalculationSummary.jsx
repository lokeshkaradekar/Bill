export default function CalculationSummary({ subtotal = 0, oldBalance = 0, grandTotal = 0, showOldBalance = true }) {
  return (
    <div className="calc-summary">
      <div className="summary-box">
        <div className="summary-row">
          <span className="summary-label">Subtotal (This Bill)</span>
          <span className="summary-value">{subtotal}</span>
        </div>
        {showOldBalance && (
          <div className="summary-row">
            <span className="summary-label">Old Balance</span>
            <span className="summary-value">{oldBalance}</span>
          </div>
        )}
        <div className="summary-total-row">
          <span className="summary-total-label">Total Amount</span>
          <span className="summary-total-value">{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
