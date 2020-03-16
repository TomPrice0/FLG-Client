/* Defines the license-list entity */
export interface StudentList {
    id: number;
    authid: number;
    coordid: number;
    licType: string;
    licTitle: string;
    keywords: string;
    activeStatus: string;
    licenseUpdated: string;
    flags: number;
}

export interface StudentListResolved {
    license: StudentList[];
    error?: any;
  }
 