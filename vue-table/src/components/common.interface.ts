export interface Balance {
  currency: string;
  amount: number;
}

export interface Country {
  code: number;
  name: string;
}

export interface User {
  id: string;
  balance: Balance;
  firstName: string;
  lastName: string;
  birthdate: number;
  sex: string;
  country: Country;
  receiveNews: boolean;
  status: string;
}

export interface UsersList {
  list: User[];
  count: number;
}
