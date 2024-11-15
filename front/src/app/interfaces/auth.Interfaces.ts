export interface RegisterData {
  username: string;
  password: string;
  password2: string;  // Password confirmation
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  username: string;
  password: string;
}


export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
