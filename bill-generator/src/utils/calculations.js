export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0.00';
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
}

export function calculateRowTotal(quantity, rate) {
  const q = parseFloat(quantity);
  const r = parseFloat(rate);
  if (isNaN(q) || isNaN(r)) return 0;
  return q * r;
}

export function calculateSubtotal(rows) {
  return rows.reduce((sum, row) => {
    return sum + calculateRowTotal(row.quantity, row.rate);
  }, 0);
}

export function calculateGrandTotal(subtotal, oldBalance) {
  const sub = parseFloat(subtotal) || 0;
  const old = parseFloat(oldBalance) || 0;
  return sub + old;
}

export function generateDefaultData() {
  return {
    billTo: 'RKK',
    fishName: 'caffis',
    billNumber: '0',
    date: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    rows: [
      { id: 1, date: '', quantity: '0', rate: '0' },
    ],
    oldBalance: '0',
    amountPaid: '0',
    showAmountPaid: true,
  };
}

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n) {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${tens[t]} ${ones[o]}` : tens[t];
}

function threeDigits(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let out = h ? `${ones[h]} Hundred` : '';
  if (h && r) out += ' ';
  return out + twoDigits(r);
}

export function amountInWords(amount) {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return 'Zero Rupees Only';
  if (num < 0) return 'Invalid Amount';

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  if (paise === 100) {
    return amountInWords(rupees + 1);
  }

  let words = 'Rupees ';
  if (rupees > 0) {
    const crore = Math.floor(rupees / 10000000);
    const lakh = Math.floor((rupees % 10000000) / 100000);
    const thousand = Math.floor((rupees % 100000) / 1000);
    const rest = rupees % 1000;

    let parts = [];
    if (crore) parts.push(`${threeDigits(crore)} Crore`);
    if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
    if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
    if (rest) parts.push(threeDigits(rest));
    words += parts.join(' ');
  } else {
    words = '';
  }

  if (paise) {
    if (words) words += ' And ';
    words += `${twoDigits(paise)} Paise`;
  }

  words += ' Only';
  return words;
}
