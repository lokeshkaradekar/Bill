export default function BillDetailsTable({ rows, fishName = 'caffis' }) {
  return (
    <div className="bill-details">
      <div className="details-title-row">
        <span className="details-brush" />
        <h3 className="details-title">BILL DETAILS</h3>
        <span className="details-brush details-brush-right" />
      </div>
      <table className="bill-table">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Date</th>
            <th>Fish</th>
            <th>Fishes</th>
            <th>Rate (₹)</th>
            <th className="total-cell">Total Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? idx}>
              <td>{idx + 1}</td>
              <td>{row.date || '—'}</td>
              <td className="fish-cell">{row.fish || fishName || 'caffis'}</td>
              <td>{row.quantity === '' || row.quantity == null ? '0' : row.quantity}</td>
              <td>{row.rate === '' || row.rate == null ? '0' : row.rate}</td>
              <td className="total-cell">{row.totalFormatted || '₹0.00'}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan="6" className="empty-row">No entries</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
