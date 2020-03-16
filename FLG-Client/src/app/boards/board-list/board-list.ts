/* Defines the board entity */
export interface BoardList {
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

  export interface BoardListResolved {
    authorityList: any;
    error?: any;
  }