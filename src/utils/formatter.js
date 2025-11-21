// utils/formatter.js

/**
 * Mengubah angka menjadi format Rupiah (Rp).
 * @param {number} number Angka yang akan diformat.
 * @returns {string} String format Rupiah.
 */
export const formatRupiah = (number) => {
  if (typeof number !== 'number') {
    return 'Rp0,00';
  }
  
  // Menggunakan Intl.NumberFormat untuk format yang aman dan benar
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(number);
};

/**
 * Memformat tanggal menjadi "DD Mmm YYYY".
 * @param {string | Date} dateInput 
 * @returns {string}
 */
export const formatTanggal = (dateInput) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}