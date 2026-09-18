export default function BillHeader({ fishName = 'caffis' }) {
  return (
    <header className="reference-header">
      <img
        className="reference-header-art"
        src="/assets/rkk-header.png"
        alt="RKK Fresh Fishes header"
      />
      <div className="reference-fish-name">Fishes : {fishName || 'caffis'}</div>
    </header>
  );
}
