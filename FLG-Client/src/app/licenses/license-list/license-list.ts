/* Defines the license-list entity */
export interface LicenseList {
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

export interface LicenseListResolved {
    license: LicenseList[];
    error?: any;
  }
 