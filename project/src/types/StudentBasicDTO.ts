export interface StudentBasicDTO {
  id: string;
  fullName: string;
  ci: string;
  phone: string | null;
  userId: string;
  photoUrl?: string | null;

  specialtyId?: string;
  specialtyName?: string;
}
