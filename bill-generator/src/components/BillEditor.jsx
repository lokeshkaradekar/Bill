import { formatIndianCurrency, calculateRowTotal, amountInWords } from '../utils/calculations.js';

export default function BillEditor({ bill, setBill }) {
  const updateField = (field, value) => {
    setBill((prev) => ({ ...prev, [field]: value }));
  };

  const updateRow = (id, field, value) => {
    setBill((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addRow = () => {
    setBill((prev) => {
      const nextId =
        prev.rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      return {
        ...prev,
        rows: [...prev.rows, { id: nextId, date: '', quantity: '0', rate: '0' }],
      };
    });
  };

  const removeRow = (id) => {
    setBill((prev) => ({
      ...prev,
      rows: prev.rows.length > 1 ? prev.rows.filter((row) => row.id !== id) : prev.rows,
    }));
  };

  const subtotal = bill.rows.reduce(
    (sum, row) => sum + calculateRowTotal(row.quantity, row.rate),
    0
  );
  const oldBalance = parseFloat(bill.oldBalance) || 0;
  const grandTotal = subtotal + oldBalance;
  const paidAmount = bill.amountPaid !== '' && bill.amountPaid != null
    ? parseFloat(bill.amountPaid) || 0
    : grandTotal;
  const paidWords = amountInWords(paidAmount);

  return (
    <div className="editor">
      <div className="editor-card">
        <h3 className="editor-heading">Bill Details</h3>

        <div className="editor-field">
          <label className="editor-label">Bill To</label>
          <input
            type="text"
            className="editor-input"
            value={bill.billTo}
            onChange={(e) => updateField('billTo', e.target.value)}
            placeholder="Customer name"
          />
        </div>

        <div className="editor-field">
          <label className="editor-label">Fish</label>
          <input
            type="text"
            className="editor-input"
            value={bill.fishName}
            onChange={(e) => updateField('fishName', e.target.value)}
            placeholder="caffis"
          />
        </div>

        <div className="editor-row-2">
          <div className="editor-field">
            <label className="editor-label">Bill No.</label>
            <input
              type="text"
              className="editor-input"
              value={bill.billNumber}
              onChange={(e) => updateField('billNumber', e.target.value)}
              placeholder="001"
            />
          </div>
          <div className="editor-field">
            <label className="editor-label">Date (DD/MM/YYYY)</label>
            <input
              type="text"
              className="editor-input"
              value={bill.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="17/09/2026"
            />
          </div>
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-head">
          <h3 className="editor-heading">Fish Entries</h3>
          <button type="button" className="btn btn-add" onClick={addRow}>
            + Add Fish
          </button>
        </div>

        <div className="rows-list">
          {bill.rows.map((row, idx) => {
            const total = calculateRowTotal(row.quantity, row.rate);
            return (
              <div className="entry-row" key={row.id}>
                <div className="entry-head">
                  <span className="entry-title">Fish {idx + 1}</span>
                  {bill.rows.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-remove"
                      onClick={() => removeRow(row.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="entry-grid">
                  <div className="entry-field">
                    <label className="entry-label">Fish</label>
                    <input
                      type="text"
                      className="editor-input"
                      value={row.fish ?? ''}
                      onChange={(e) => updateRow(row.id, 'fish', e.target.value)}
                      placeholder={bill.fishName || 'caffis'}
                    />
                  </div>
                  <div className="entry-field">
                    <label className="entry-label">Date</label>
                    <input
                      type="text"
                      className="editor-input"
                      value={row.date || ''}
                      onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                      placeholder="11/09/2026"
                    />
                  </div>
                  <div className="entry-field">
                    <label className="entry-label">Quantity</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="editor-input"
                      value={row.quantity ?? ''}
                      onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                      placeholder="155"
                    />
                  </div>
                  <div className="entry-field">
                    <label className="entry-label">Rate (₹)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="editor-input"
                      value={row.rate ?? ''}
                      onChange={(e) => updateRow(row.id, 'rate', e.target.value)}
                      placeholder="315"
                    />
                  </div>
                </div>
                <div className="entry-total">
                  Total: <strong>{formatIndianCurrency(total)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="editor-card">
        <h3 className="editor-heading">Amount Summary</h3>
        <div className="editor-field">
          <label className="editor-label">Old Balance (₹)</label>
          <input
            type="text"
            inputMode="decimal"
            className="editor-input"
            value={bill.oldBalance ?? ''}
            onChange={(e) => updateField('oldBalance', e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="editor-summary">
          <div className="es-row">
            <span>Subtotal</span>
            <strong>{formatIndianCurrency(subtotal)}</strong>
          </div>
          <div className="es-row">
            <span>Old Balance</span>
            <strong>{formatIndianCurrency(oldBalance)}</strong>
          </div>
          <div className="es-row es-total">
            <span>Total Amount</span>
            <strong>{formatIndianCurrency(grandTotal)}</strong>
          </div>
        </div>
      </div>

      <div className="editor-card">
        <h3 className="editor-heading">Payment</h3>
        <div className="editor-field">
          <label className="editor-label">Amount Paid (₹)</label>
          <input
            type="text"
            inputMode="decimal"
            className="editor-input"
            value={bill.amountPaid ?? ''}
            onChange={(e) => updateField('amountPaid', e.target.value)}
            placeholder={`Use Total (${grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })})`}
          />
        </div>
        <div className="toggle-row">
          <span className="toggle-label">Show below signature</span>
          <div className="toggle-group">
            <button
              type="button"
              className={bill.showAmountPaid ? 'toggle-btn toggle-on' : 'toggle-btn'}
              onClick={() => updateField('showAmountPaid', true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={!bill.showAmountPaid ? 'toggle-btn toggle-off' : 'toggle-btn'}
              onClick={() => updateField('showAmountPaid', false)}
            >
              No
            </button>
          </div>
        </div>
        {bill.showAmountPaid && (
          <div className="words-preview">
            {formatIndianCurrency(paidAmount)}
            <span className="words-preview-text">{paidWords}</span>
          </div>
        )}
      </div>
    </div>
  );
}