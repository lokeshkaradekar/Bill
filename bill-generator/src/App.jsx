import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  MessageCircle,
  Plus,
  Printer,
  Save,
  Sparkles,
  Waves,
} from 'lucide-react';
import BillEditor from './components/BillEditor.jsx';
import BillPreview from './components/BillPreview.jsx';
import { generateDefaultData } from './utils/calculations.js';
import {
  exportBillAsPng,
  downloadPng,
  downloadPdf,
  shareBillImage,
  printBill,
  makePngFilename,
} from './utils/exportUtils.js';

const STORAGE_KEY = 'rkk-bill-data';

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.rows)) {
      return {
        ...parsed,
        fishName: parsed.fishName || 'caffis',
        oldBalance: parsed.oldBalance ?? '',
        amountPaid: parsed.amountPaid ?? '',
        showAmountPaid: parsed.showAmountPaid !== false,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function validateQuantity(value) {
  return /^[0-9]*\.?[0-9]*$/.test(String(value));
}

export default function App() {
  const [bill, setBill] = useState(() => loadSavedData() || generateDefaultData());
  const [mobilePreview, setMobilePreview] = useState(false);
  const billRef = useRef(null);
  const billZoneRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bill));
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [bill]);

  useEffect(() => {
    const zone = billZoneRef.current;
    if (!zone) return;
    const compute = () => {
      const s = Math.min(1, (zone.clientWidth - 6) / 1024);
      setPreviewScale(s);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(zone);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (billRef.current) setSheetHeight(billRef.current.offsetHeight);
  }, [bill, previewScale]);

  useEffect(() => {
    window.shareBillImage = () => shareBillImage(billRef.current);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const scrollToPreview = () => {
    const el = document.querySelector('.bill-zone');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGenerate = () => {
    const invalid = bill.rows.find(
      (row) => row.quantity !== '' && !validateQuantity(row.quantity)
    );
    if (invalid) {
      showToast('Invalid quantity: only numbers and decimals allowed.');
      return;
    }
    const invalidRate = bill.rows.find(
      (row) => row.rate !== '' && !validateQuantity(row.rate)
    );
    if (invalidRate) {
      showToast('Invalid rate: only numbers and decimals allowed.');
      return;
    }
    setMobilePreview(true);
    scrollToPreview();
    showToast('Bill generated successfully.');
  };

  const handleDownloadImage = async () => {
    if (!billRef.current) return;
    setBusy('image');
    try {
      await new Promise((r) => setTimeout(r, 50));
      const dataUrl = await exportBillAsPng(billRef.current);
      downloadPng(dataUrl, makePngFilename(bill.billNumber, bill.date));
      showToast('Bill image downloaded.');
    } catch (err) {
      console.error(err);
      showToast('Image export failed. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const handleWhatsAppShare = async () => {
    if (!billRef.current) return;
    setBusy('whatsapp');
    try {
      await new Promise((r) => setTimeout(r, 50));
      const result = await shareBillImage(billRef.current);
      if (result.success) {
        showToast(
          result.method === 'android'
            ? 'Opening Android share sheet — choose WhatsApp.'
            : 'Opening share sheet — choose WhatsApp.'
        );
      } else if (result.canceled) {
        showToast('Share cancelled.');
      } else {
        showToast(
          'Image sharing is not supported on this browser. Download the bill image and share it on WhatsApp.'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Sharing failed. Please download and share the image.');
    } finally {
      setBusy('');
    }
  };

  const handleDownloadPdf = async () => {
    if (!billRef.current) return;
    setBusy('pdf');
    try {
      await new Promise((r) => setTimeout(r, 50));
      await downloadPdf(billRef.current, `RKK-Fish-Bill-${bill.billNumber || '001'}.pdf`);
      showToast('PDF downloaded.');
    } catch (err) {
      console.error(err);
      showToast('PDF export failed. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const handlePrint = async () => {
    setBusy('print');
    try {
      await printBill(billRef.current);
    } catch (err) {
      console.error(err);
      showToast('Print failed. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bill));
      showToast('Bill saved on this device.');
    } catch {
      showToast('Could not save. Storage full or unavailable.');
    }
  };

  const handleNewBill = () => {
    const confirmed = window.confirm(
      'Create a new bill? Current bill data will be cleared.'
    );
    if (!confirmed) return;
    setBill(generateDefaultData());
    setMobilePreview(false);
    showToast('New bill created.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <div className="app-toolbar">
        <div className="toolbar-brand">
          <span className="toolbar-logo">
            <Waves size={24} strokeWidth={2} />
          </span>
          <div>
            <h1 className="toolbar-title">RKK Fish Bill Generator</h1>
            <p className="toolbar-sub">Fresh Fishes · Healthy Life</p>
          </div>
        </div>
        <div className="toolbar-actions">
          <button
            className="tb-btn tb-primary"
            onClick={handleGenerate}
            title="Validate and show the final bill"
          >
            <Sparkles size={16} /> Generate Bill
          </button>
          <button
            className="tb-btn"
            onClick={handleDownloadImage}
            disabled={busy === 'image'}
          >
            {busy === 'image' ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
            {busy === 'image' ? 'Preparing…' : 'Download Image'}
          </button>
          <button
            className="tb-btn tb-whatsapp"
            onClick={handleWhatsAppShare}
            disabled={busy === 'whatsapp'}
          >
            {busy === 'whatsapp' ? <Loader2 size={16} className="spin" /> : <MessageCircle size={16} />}
            {busy === 'whatsapp' ? 'Preparing…' : 'Share on WhatsApp'}
          </button>
          <button
            className="tb-btn"
            onClick={handleDownloadPdf}
            disabled={busy === 'pdf'}
          >
            {busy === 'pdf' ? <Loader2 size={16} className="spin" /> : <FileText size={16} />}
            {busy === 'pdf' ? 'Preparing…' : 'Download PDF'}
          </button>
          <button className="tb-btn" onClick={handlePrint} disabled={busy === 'print'}>
            {busy === 'print' ? <Loader2 size={16} className="spin" /> : <Printer size={16} />}
            {busy === 'print' ? 'Preparing…' : 'Print Bill'}
          </button>
          <button className="tb-btn" onClick={handleSave} title="Save to this device">
            <Save size={16} /> Save Bill
          </button>
          <button className="tb-btn tb-danger" onClick={handleNewBill}>
            <Plus size={16} /> New Bill
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}

      <div className="app-layout">
        <div className="col col-editor">
          <div className="editor-zone">
            <BillEditor bill={bill} setBill={setBill} />
          </div>
          <button
            className="btn-mobile-preview"
            onClick={() => {
              setMobilePreview(true);
              scrollToPreview();
            }}
            style={{ display: window.innerWidth < 900 ? 'inline-flex' : 'none' }}
          >
            <Eye size={16} /> Preview Bill
          </button>
        </div>
        <div className="col col-bill">
          <div className="bill-zone" ref={billZoneRef}>
            <div
              className="bill-canvas"
              style={{
                width: 1024 * previewScale,
                height: sheetHeight ? sheetHeight * previewScale : undefined,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
                overflow: 'visible',
              }}
            >
              <BillPreview bill={bill} ref={billRef} />
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>RKK Fresh Fishes · From Ocean to Your Table</p>
      </footer>
    </div>
  );
}