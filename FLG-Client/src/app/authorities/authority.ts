/* Defines the authority entity */
export interface Authority {
    address1: string;
    address2: string;
    city: string;
    contact: string;
    coordId: string;
    email: string;
    fax: string;
    id: number;
    multipleLocation: boolean;
    department: string;
    division: string;
    board: string;
    officeHours: string;
    st: string;
    teleExt: string;
    telephone: string;
    url: string;
    zip: string;
    zipExt: string;
    haslicenses: boolean;
  }
  
  export interface AuthorityResolved {
    authority: Authority;
    error?: any;
  }

  export function newAuthority(): Authority{
    const a: Authority={
      address1: '',
      address2: '',
      city: '',
      contact: '',
      coordId: null,
      email: '',
      fax: '',
      id: 0,
      multipleLocation: false,
      department: '',
      division: '',
      board: '',
      officeHours: '',
      st: 'NC',
      teleExt: '',
      telephone: '',
      url: '',
      zip: '',
      zipExt: '',
      haslicenses: false
    };
    return a;
  }

  