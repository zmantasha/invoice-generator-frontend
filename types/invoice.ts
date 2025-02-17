export interface InvoiceData {
  _id: string,
  userId:string,
  senderDetails: {
    logo: string;
    name: string;
    address: string;
    // phone: string;
  };
  recipientDetails: {
    billTo: {
      name: string;
      address: string;
      // email: string;
      // phone: string;
    };
    shipTo: {
      name: string;
      address: string;
      // email: string;
      // phone: string;
    };
  };
  invoiceDetails: {
    number: string;
    date: string;
    dueDate: string;
    paymentTerms: string;
    poNumber: string;
    currency: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    taxRate: number;
    discount: number;
    shipping: number;
    discountType: "percentage" | "fixed";
    shippingType: "percentage" | "fixed";
    amountPaid: number,
    total: number;
    balanceDue: number,
  };
  notes: string;
  terms: string;
}