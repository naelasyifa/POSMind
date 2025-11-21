import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadDataPDF = (mode, data) => {
  const doc = new jsPDF();

  const title = mode === "bulanan" 
    ? "Laporan Data Bulanan"
    : "Laporan Data Mingguan";

  doc.setFontSize(18);
  doc.text(title, 14, 15);

  const tableColumn = ["Nama", "Penjualan", "Pendapatan"];

  const tableRows = data.map((item) => [
    item.name,
    item.penjualan,
    item.pendapatan,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`${mode}-data.pdf`);
};
