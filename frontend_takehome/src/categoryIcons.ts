import {
  LucideIcon,
  HeartPulse,
  Brain,
  Ribbon,
  Bone,
  Baby,
  Radiation,
  KeyRound,
  FileWarning,
  Copy,
  CalendarX,
  FileX,
  Stethoscope,
  FileQuestion,
  MapPinOff,
} from "lucide-react";
import { DEPARTMENTS, REASONS } from "./types";

// One representative icon per department/reason, purely a visual
// scanning aid -- independent of chart color (theme/vizPalettes.ts).
// Shared between the filter-bar selects (DepartmentSelect.tsx,
// ReasonSelect.tsx) and the Denial-Level Detail table (DenialsTable.tsx),
// which both want the exact same department/reason -> icon mapping.
export const DEPARTMENT_ICONS: Record<(typeof DEPARTMENTS)[number], LucideIcon> = {
  Cardiology: HeartPulse,
  Neurology: Brain,
  Oncology: Ribbon,
  Orthopedics: Bone,
  Pediatrics: Baby,
  Radiology: Radiation,
};

export const REASON_ICONS: Record<(typeof REASONS)[number], LucideIcon> = {
  "Authorization missing": KeyRound,
  "Coding error": FileWarning,
  "Duplicate claim": Copy,
  "Expired coverage": CalendarX,
  "Invalid CPT": FileX,
  "Medical necessity": Stethoscope,
  "Missing info": FileQuestion,
  "Out of network": MapPinOff,
};
