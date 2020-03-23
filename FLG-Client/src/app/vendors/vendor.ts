import { stringify } from 'querystring';

/* Defines the college entity */
export interface Vendor {
    id: number;
    vendorName: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    hasGrants: boolean; 
  }
  
  export interface VendorResolved {
    vendor: Vendor;
    error?: any;
  }

  export function newVendor(): Vendor{
    const v: Vendor={
      id: 0,
      vendorName: null,
      address: null,
      city: null,
      state: 'NC',
      phone: null,
      hasGrants: false
    };
    return v;
  }

  