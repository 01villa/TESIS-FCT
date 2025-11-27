import { UserRole } from '../types/auth.types';

export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const isSuperAdmin = (userRole: UserRole): boolean => {
  return userRole === UserRole.SUPER_ADMIN;
};

export const isAdminSchool = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN_SCHOOL;
};

export const isAdminCompany = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN_COMPANY;
};

export const isSchoolTutor = (userRole: UserRole): boolean => {
  return userRole === UserRole.SCHOOL_TUTOR;
};

export const isCompanyTutor = (userRole: UserRole): boolean => {
  return userRole === UserRole.COMPANY_TUTOR;
};

export const isStudent = (userRole: UserRole): boolean => {
  return userRole === UserRole.STUDENT;
};

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.ADMIN_SCHOOL]: 'Admin Escolar',
    [UserRole.ADMIN_COMPANY]: 'Admin Empresa',
    [UserRole.SCHOOL_TUTOR]: 'Tutor Escolar',
    [UserRole.COMPANY_TUTOR]: 'Tutor Empresa',
    [UserRole.STUDENT]: 'Estudiante',
  };
  return roleNames[role];
};
