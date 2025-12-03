/**
 * Interface untuk mendefinisikan struktur data Reservasi.
 * Ini memastikan properti seperti 'fullName', 'deposit', dan 'cardName' dikenal.
 */
export interface Reservasi {
  id: number;
  table: string;
  people: number;
  date: string;
  time: string;
  duration: number;
  deposit: number; // Menggunakan number karena nilai berupa angka (60, 40, dst)
  status: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed'; // Jenis Status yang ada

  gender: string;
  fullName: string;
  phone: string;
  email: string;

  customerId: string;
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
}

// Menggunakan type assertion 'as Reservasi[]' untuk memastikan array ini sesuai dengan interface
export const DUMMY_RESERVATIONS: Reservasi[] = [
  {
    id: 1,
    table: '01',
    people: 5,
    date: '2024-03-28',
    time: '15:18',
    duration: 60,
    deposit: 60,
    status: 'Confirmed',

    gender: 'Pria',
    fullName: 'Watson Joyce',
    phone: '+1 (123) 123 4654',
    email: 'watsonjoyce112@gmail.com',

    customerId: '#12354564',
    paymentMethod: 'Visa Card',
    cardName: 'Watson Joyce',
    cardNumber: '**** 1236 4564 4546',
  },

  {
    id: 2,
    table: 'A2',
    people: 1,
    date: '2024-03-28',
    time: '11:00',
    duration: 60,
    deposit: 40,
    status: 'Confirmed',

    gender: 'Pria',
    fullName: 'Mila',
    phone: '-',
    email: '-',

    customerId: '#99887766',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 3,
    table: 'B1',
    people: 2,
    date: '2024-03-28',
    time: '12:00',
    duration: 60,
    deposit: 40,
    status: 'Pending',

    gender: 'Wanita',
    fullName: 'Dewi',
    phone: '-',
    email: '-',

    customerId: '#44556677',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 4,
    table: 'A2',
    people: 3,
    date: '2024-03-28',
    time: '12:00',
    duration: 120,
    deposit: 50,
    status: 'Checked In',

    gender: 'Wanita',
    fullName: 'Naela',
    phone: '-',
    email: '-',

    customerId: '#55667788',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 5,
    table: 'B2',
    people: 4,
    date: '2024-03-28',
    time: '15:00',
    duration: 60,
    deposit: 50,
    status: 'Confirmed',

    gender: 'Wanita',
    fullName: 'Syifa',
    phone: '-',
    email: '-',

    customerId: '#66778899',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 6,
    table: 'B3',
    people: 5,
    date: '2024-03-28',
    time: '13:00',
    duration: 60,
    deposit: 50,
    status: 'Confirmed',

    gender: 'Wanita',
    fullName: 'Atifa',
    phone: '-',
    email: '-',

    customerId: '#22334455',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 7,
    table: 'C2',
    people: 6,
    date: '2024-03-28',
    time: '19:00',
    duration: 90,
    deposit: 60,
    status: 'Confirmed',

    gender: 'Wanita',
    fullName: 'Safa',
    phone: '-',
    email: '-',

    customerId: '#88990011',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

  {
    id: 8,
    table: 'A1',
    people: 7,
    date: '2024-03-28',
    time: '10:00',
    duration: 120,
    deposit: 60,
    status: 'Completed',

    gender: 'Wanita',
    fullName: 'Nanda',
    phone: '-',
    email: '-',

    customerId: '#11223344',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },

   {
    id: 9,
    table: 'A1',
    people: 7,
    date: '2024-03-28',
    time: '10:00',
    duration: 120,
    deposit: 60,
    status: 'Completed',

    gender: 'Wanita',
    fullName: 'Nanda',
    phone: '-',
    email: '-',

    customerId: '#11223344',
    paymentMethod: 'Cash',
    cardName: '-',
    cardNumber: '-',
  },
]