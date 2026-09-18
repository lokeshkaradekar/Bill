import headerArt from '../assets/rkk-header.png?inline';

export default function BillHeader({ fishName = 'caffis' }) {
  const name = fishName || 'caffis';
  const label = `Type of Fish : ${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return (
    <header className="reference-header">
      <img
        className="reference-header-art"
        src={headerArt}
        alt="RKK Fresh Fishes header"
      />
      <div className="reference-fish-name">{label}</div>
    </header>
  );
}
