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

export const PAYERS = ['Medicare', 'Humana', 'Cigna', 'BCBS', 'Aetna'] as const;
