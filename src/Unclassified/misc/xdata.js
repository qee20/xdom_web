// data.js
export const data = [
    {
      id: 0,
      bank: 'BRI',
      target: 3424523235,
      balance : 10000,
      actions : "buttons"
    },
    {
      id: 1,
      bank: 'BCA',
      target: 323523230,
      balance : 20000,
      actions : "buttons"
    },
    {
      id: 2,
      bank: 'John',
      target: 23454330,
      balance : 30000,
      actions : "buttons"
    },
  ];

  export const dataPlayer = [
    {
      id : 0,
      name : "Brian Dominos",
      phone : '082333434343',
      email : "bryan@gmail.com",
      bank : 'BCA',
      accountName : 'Brian Dominous',
      accountNumber : '324234234'
    },
    {
      id : 0,
      name : "Brian Dominos",
      phone : '082333434343',
      email : "bryan@gmail.com",
      bank : 'BCA',
      accountName : 'Brian Dominous',
      accountNumber : '324234234'
    },
    {
      id : 0,
      name : "Brian Dominos",
      phone : '082333434343',
      email : "bryan@gmail.com",
      bank : 'BCA',
      accountName : 'Brian Dominous',
      accountNumber : '324234234'
    }
  ]

  export const dataBank = [
    {
      id : 0,
      name : "BRI",
      accountNumber : '324234234',
      accountName : 'Brian Dominous',
      status : 'aktif',
      rowTrx : 10,
      targetWeb : 'None'
    },
    {
      id : 1,
      name : "BRI",
      accountNumber : '324234234',
      accountName : 'Brian Dominous',
      status : 'aktif',
      rowTrx : 10,
      targetWeb : 'None'
    },
    {
      id : 2,
      name : "BRI",
      accountNumber : '324234234',
      accountName : 'Brian Dominous',
      status : 'aktif',
      rowTrx : 10,
      targetWeb : 'None'
    }
  ]

  export function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  }