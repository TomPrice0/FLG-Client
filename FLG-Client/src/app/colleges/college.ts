/* Defines the college entity */
export interface College {
    id: number;
    collegeName: string;
    president: string;
    city: string;
    phone: string;
    hasGrants: boolean; 
  }
  
  export interface CollegeResolved {
    authority: College;
    error?: any;
  }

  export function newCollege(): College{
    const c: College={
      id: 0,
      collegeName: null,
      city: null,
      president: null,
      phone: null,
      hasGrants: false
    };
    return c;
  }

  