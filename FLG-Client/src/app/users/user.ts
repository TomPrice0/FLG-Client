/* Defines the user entity */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  teleExt: string;
  userName: string;
  updatedDate: string;
  role: number;
  updatedBy: string;
  token: string;
}

export function newUser():User{
  const u:User= {
    id: 0,
    firstName: null,
    lastName: null,
    email: null,
    telephone: null,
    teleExt: null,
    userName: null,
    updatedDate: null,
    role: null,
    updatedBy: null,
    token: null,
  }
  return u;
}