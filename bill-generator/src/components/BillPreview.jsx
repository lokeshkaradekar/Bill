import { forwardRef } from 'react';
import BillHeader from './BillHeader.jsx';
import CustomerSection from './CustomerSection.jsx';
import BillDetailsTable from './BillDetailsTable.jsx';
import CalculationSummary from './CalculationSummary.jsx';
import BillFooter from './BillFooter.jsx';
import { formatIndianCurrency, calculateRowTotal, amountInWords } from '../utils/calculations.js';

const BillPreview = forwardRef(function BillPreview({ bill }, ref) {
  const rows = bill.rows.map((row) => ({
    ...row,
    totalFormatted: formatIndianCurrency(calculateRowTotal(row.quantity, row.rate)),
  }));
  const subtotal = rows.reduce((sum, r) => sum + calculateRowTotal(r.quantity, r.rate), 0);
  const oldBalance = parseFloat(bill.oldBalance) || 0;
  const grandTotal = subtotal + oldBalance;
  const paidAmount = bill.amountPaid !== '' && bill.amountPaid != null
    ? parseFloat(bill.amountPaid) || 0
    : grandTotal;
  const paidWords = amountInWords(paidAmount);

  return (
    <div className="bill-sheet" ref={ref}>
      <BillHeader fishName={bill.fishName} />
      <div className="bill-body">
        <CustomerSection billTo={bill.billTo} fishName={bill.fishName} billNumber={bill.billNumber} date={bill.date} />
        <BillDetailsTable rows={rows} fishName={bill.fishName} />
        <CalculationSummary
          subtotal={formatIndianCurrency(subtotal)}
          oldBalance={formatIndianCurrency(oldBalance)}
          grandTotal={formatIndianCurrency(grandTotal)}
          showOldBalance={bill.oldBalance !== '' && bill.oldBalance !== null && bill.oldBalance !== undefined}
        />
      </div>
      <BillFooter
        showAmountPaid={bill.showAmountPaid !== false}
        amountPaid={formatIndianCurrency(paidAmount)}
        amountWords={paidWords}
      />
    </div>
  );
});

export default BillPreview;
