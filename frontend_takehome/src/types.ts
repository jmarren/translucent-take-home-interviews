export interface Denial {
  id: string;
  department: string;
  amount: number;
  reason: string;
  date: string;
  payer: string;
}

export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
] as const;
