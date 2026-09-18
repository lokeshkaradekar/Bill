export default function CustomerSection({ billTo, fishName, billNumber, date }) {
  const name = fishName || 'caffis';
  const label = `Type of Fish : ${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return (
    <div className="reference-customer">
      <div className="customer-box">
        <div className="customer-caption">Bill To</div>
        <div className="customer-name">{billTo || '—'}</div>
        <div className="customer-fish">{label}</div>
      </div>
      <div className="customer-meta-box">
        <div><span>Bill No. :</span><strong>{billNumber || '001'}</strong></div>
        <div><span>Date :</span><strong>{date || '—'}</strong></div>
      </div>
    </div>
  );
}
