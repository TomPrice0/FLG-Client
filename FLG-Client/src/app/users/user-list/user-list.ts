/* Defines the user-list entity */
export interface UserList {
    id: number;
    name: string;
    permLevel: number;  //  TODO: Really should have a capital L but requires host change
    userName: string;
    email: string;
    phone: string;
    authorities: number;
    licenses: number;
    updated: number;
  }
  
  export interface UserListResolved {
    userList: UserList;
    error?: any;
  }