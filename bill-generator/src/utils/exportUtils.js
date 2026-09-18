import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportBillAsPng(nodeRef, filename = 'bill') {
  if (!nodeRef) throw new Error('Bill element not found');
  const options = {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#ffffff',
    width: nodeRef.offsetWidth,
    height: nodeRef.offsetHeight,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
      width: `${nodeRef.offsetWidth}px`,
      height: `${nodeRef.offsetHeight}px`,
    },
  };
  const dataUrl = await toPng(nodeRef, options);
  return dataUrl;
}

export function downloadPng(dataUrl, filename = 'RKK-Fish-Bill.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function downloadPdf(nodeRef, filename = 'RKK-Fish-Bill.pdf') {
  return new Promise(async (resolve, reject) => {
    try {
      const dataUrl = await exportBillAsPng(nodeRef);
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height],
          hotfixes: ['px_scaling'],
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
        pdf.save(filename);
        resolve();
      };
      img.onerror = reject;
      img.src = dataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

export async function getBillImageBlob(nodeRef) {
  const dataUrl = await exportBillAsPng(nodeRef);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return blob;
}

export async function sharePngOnWhatsApp(nodeRef, filename = 'RKK-Fish-Bill.png') {
  try {
    const blob = await getBillImageBlob(nodeRef);
    const file = new File([blob], filename, { type: 'image/png' });
    const shareData = {
      files: [file],
      title: 'RKK Fish Bill',
      text: 'Your bill from RKK Fresh Fishes - From Ocean to Your Table',
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      if (navigator.share) {
        await navigator.share(shareData);
        return { success: true, method: 'webshare' };
      }
    }
    return { success: false, method: 'unsupported', blob };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, method: 'cancelled', canceled: true };
    }
    return { success: false, method: 'error', error: err.message };
  }
}

export async function printBill(billRef) {
  if (!billRef) return;
  const dataUrl = await exportBillAsPng(billRef);
  const printWindow = window.open('', '_blank', 'width=960,height=1360');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          html, body { margin: 0; padding: 0; background: #fff; }
          @page { margin: 0; size: auto; }
          .print-wrap {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
          }
          img { width: auto; max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <div id="print-wrap" class="print-wrap">
          <img id="bill-img" src="${dataUrl}" alt="Bill" />
        </div>
        <script>
          window.onload = function(){
            setTimeout(function(){
              window.print();
              window.onafterprint = function(){ window.close(); };
            }, 250);
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function makePngFilename(billNumber, date) {
  const cleanNo = billNumber || '001';
  const cleanDate = (date || '').replace(/\//g, '-');
  return `RKK-Bill-${cleanNo}${cleanDate ? '-' + cleanDate : ''}.png`;
}