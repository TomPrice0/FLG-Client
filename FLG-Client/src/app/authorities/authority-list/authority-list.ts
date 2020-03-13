/* Defines the authority entity */
export interface AuthorityList {
    coordId: string; 
    department: string; 
    division: string; 
    board: string; 
    telephone: string; 
    teleext: string;
    email: string;
    url: string; 
    updatedDate: string;
  }

  export interface AuthorityListResolved {
    authorityList: any;
    error?: any;
  }