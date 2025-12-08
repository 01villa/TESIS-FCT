// src/types/ApplicationDTO.ts

export interface ApplicationDTO {
  id: string;

  // VACANTE
  vacancyId: string;
  vacancyTitle: string;
  vacancyStartDate?: string;   // <-- NUEVO
  vacancyEndDate?: string;     // <-- NUEVO

  // EMPRESA (opcional si lo usas)
  companyId?: string;
  companyName?: string;

  // ESTUDIANTE
  studentId: string;
  studentFullName: string;

  // TUTOR ESCOLAR
  schoolTutorId: string;
  schoolTutorName: string;

  // TUTOR EMPRESA (opcional)
  companyTutorId?: string;
  companyTutorName?: string;

  // INFO COMPLEMENTARIA DEL ESTUDIANTE (merge desde student + user)
  studentCi?: string;
  studentPhone?: string;
  studentEmail?: string;

  // ESTADO Y FECHAS
  appliedAt: string;  // ISO
  updatedAt?: string;
  status: number;     // 1=PENDIENTE, 2=APROBADA, 3=RECHAZADA, 4=FINALIZADA

  notes?: string;
  active?: boolean;
}
