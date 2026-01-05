export interface ApplicationDTO {
  id: string;

  vacancyId: string;
  vacancyTitle: string;
  companyId: string;
  companyName: string;

  vacancyStartDate?: string;  // NUEVO
  vacancyEndDate?: string;    // NUEVO

  studentId: string;
  studentFullName: string;

  studentCi?: string;
  studentPhone?: string;
  studentEmail?: string;

  schoolTutorId: string;
  schoolTutorName: string;

  companyTutorId?: string;
  companyTutorName?: string;

  status: number;
  notes?: string;
  active: boolean;
  appliedAt?: string;
  updatedAt?: string;
}
