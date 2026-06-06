import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Shipment } from '../types';
import type { SiteSettings } from '../types/settings';
import { useSettings } from '../hooks/useSettings';
import Receipt from './Receipt';

interface ReceiptModalProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export default function ReceiptModal({ shipment, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { settings } = useSettings();
  const brand = (settings.siteName || 'Receipt').replace(/[^a-zA-Z0-9]+/g, '') || 'Receipt';

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const styles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: white; padding: 0; }
        @media print {
          body { padding: 20px; }
          @page { margin: 0.5in; size: A4; }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${shipment?.trackingNumber || ''}</title>
          ${styles}
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${brand}-Receipt-${shipment?.trackingNumber || 'tracking'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadText = () => {
    if (!shipment) return;
    const text = generateTextReceipt(shipment, settings);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand}-Receipt-${shipment.trackingNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {shipment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Shipment Receipt</h2>
                  <p className="text-xs text-slate-500">Print or download for your records</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleDownloadText}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                  title="Download as TXT"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">TXT</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 rounded-lg transition-colors"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 ml-1"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Content (scrollable) */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
              <div ref={receiptRef} className="bg-white shadow-md rounded-lg">
                <Receipt shipment={shipment} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function generateTextReceipt(shipment: Shipment, settings: SiteSettings): string {
  const divider = '═'.repeat(60);
  const subDivider = '─'.repeat(60);
  const issuedAt = new Date().toLocaleString();
  const id = `RCP-${shipment.trackingNumber}-${Date.now().toString(36).toUpperCase()}`;

  let txt = '';
  txt += `${divider}\n`;
  txt += `  ${settings.siteName.toUpperCase()} - SHIPMENT RECEIPT\n`;
  txt += `${divider}\n\n`;
  txt += `Receipt ID:   ${id}\n`;
  txt += `Issued:       ${issuedAt}\n\n`;

  txt += `${subDivider}\n`;
  txt += `TRACKING DETAILS\n`;
  txt += `${subDivider}\n`;
  txt += `Tracking #:     ${shipment.trackingNumber}\n`;
  txt += `Status:         ${shipment.status.toUpperCase()}\n`;
  txt += `Shipped On:     ${new Date(shipment.createdAt).toLocaleString()}\n`;
  txt += `Est. Delivery:  ${new Date(shipment.estimatedDelivery).toLocaleString()}\n\n`;

  txt += `${subDivider}\n`;
  txt += `ROUTE\n`;
  txt += `${subDivider}\n`;
  txt += `From:  ${shipment.origin}\n`;
  txt += `To:    ${shipment.destination}\n\n`;

  txt += `${subDivider}\n`;
  txt += `PACKAGE DETAILS\n`;
  txt += `${subDivider}\n`;
  txt += `Description:    ${shipment.itemDescription}\n`;
  txt += `Weight:         ${shipment.weight} kg\n\n`;

  txt += `${subDivider}\n`;
  txt += `SENDER\n`;
  txt += `${subDivider}\n`;
  txt += `Name:     ${shipment.senderName}\n`;
  txt += `Address:  ${shipment.senderAddress}\n`;
  txt += `Phone:    ${shipment.senderPhone}\n\n`;

  txt += `${subDivider}\n`;
  txt += `RECEIVER\n`;
  txt += `${subDivider}\n`;
  txt += `Name:     ${shipment.receiverName}\n`;
  txt += `Address:  ${shipment.receiverAddress}\n`;
  txt += `Phone:    ${shipment.receiverPhone}\n\n`;

  txt += `${subDivider}\n`;
  txt += `TRACKING HISTORY\n`;
  txt += `${subDivider}\n`;
  [...shipment.events].reverse().forEach((event, i) => {
    txt += `${i + 1}. [${new Date(event.timestamp).toLocaleString()}]\n`;
    txt += `   Status:     ${event.status}\n`;
    txt += `   Location:   ${event.location}\n`;
    txt += `   Details:    ${event.description}\n\n`;
  });

  txt += `${divider}\n`;
  txt += `Thank you for choosing ${settings.siteName}!\n`;
  txt += `Support: ${settings.email} | ${settings.phone}\n`;
  txt += `${divider}\n`;

  return txt;
}
