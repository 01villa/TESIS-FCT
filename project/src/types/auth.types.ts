export const UserRole = {
  SUPER_ADMIN: 'ADMIN',
  ADMIN_SCHOOL: 'ADMIN_SCHOOL',
  ADMIN_COMPANY: 'ADMIN_COMPANY',
  SCHOOL_TUTOR: 'SCHOOL_TUTOR',
  COMPANY_TUTOR: 'COMPANY_TUTOR',
  STUDENT: 'STUDENT'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
