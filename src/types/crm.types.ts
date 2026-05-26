export type LeadStage = 'New Inquiry' | 'Contacted' | 'Counselling Scheduled' | 'Documents Pending' | 'Admission Confirmed' | 'Inactive';

export interface StudentLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  degreeTarget: string;
  stage: LeadStage;
  source: string;
  counsellor: string;
  tags: string[];
  notes: string[];
  reminderDate?: string;
  reminderChecked?: boolean;
  timeline: {
    id: string;
    type: string;
    title: string;
    time: string;
    notes?: string;
  }[];
}
