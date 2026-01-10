export type ApplicationStatus =
  | "ASSIGNED"
  | "APPROVED_BY_COMPANY"
  | "REJECTED_BY_COMPANY"
  | "FINISHED"
  | "GRADED";

export interface ApplicationDTO {
  id: string;

  vacancyId: string;
  vacancyTitle: string;
  companyId: string;
  companyName: string;

  vacancyStartDate?: string;
  vacancyEndDate?: string;

  studentId: string;
  studentFullName: string;

  studentCi?: string;
  studentPhone?: string;
  studentEmail?: string;

  schoolTutorId: string;
  schoolTutorName: string;

  companyTutorId?: string;
  companyTutorName?: string;

  status: ApplicationStatus;

  notes?: string;
  finalGrade?: number | null;     
  finalFeedback?: string | null;
  finishedAt?: string | null;
  gradedAt?: string | null;
  active: boolean;
  appliedAt?: string;
  updatedAt?: string;
}
