export interface School {
  id: string;
  name: string;
  address?: string | null;
  active: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  photoUrl?: string | null;
}
