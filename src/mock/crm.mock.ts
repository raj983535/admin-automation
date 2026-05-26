import type { StudentLead } from '../types/crm.types';

export const INITIAL_LEADS: StudentLead[] = [
  {
    id: 'lead-1',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@gmail.com',
    phone: '+91 91234 56780',
    city: 'Mumbai',
    degreeTarget: 'B.Tech CSE',
    stage: 'New Inquiry',
    source: 'Meta Ads',
    counsellor: 'Swati Sen',
    tags: ['Freshman', 'High Intent'],
    notes: ['Inquired about hostel bookings and double-sharing rates.'],
    reminderDate: '2026-05-24',
    reminderChecked: false,
    timeline: [
      { id: 't1-1', type: 'system', title: 'Lead Ingested', time: '10:15 AM', notes: 'Origin: Meta Facebook Ad Lead form (B.Tech CSE Campaign).' }
    ]
  },
  {
    id: 'lead-2',
    name: 'Kabir Malhotra',
    email: 'kabir.m@yahoo.com',
    phone: '+91 98321 04321',
    city: 'Delhi',
    degreeTarget: 'MBA Marketing',
    stage: 'Contacted',
    source: 'Google Search',
    counsellor: 'Dr. Sarah Jenkins',
    tags: ['Work Ex', 'Needs Scholarship'],
    notes: ['Has 2 years of work experience in retail tech. Score aggregate 74%.'],
    reminderDate: '2026-05-22',
    reminderChecked: false,
    timeline: [
      { id: 't2-1', type: 'system', title: 'Lead Ingested', time: 'Yesterday', notes: 'Origin: Organic SEO Search portal query.' },
      { id: 't2-2', type: 'communication', title: 'Outbound WhatsApp Dispatched', time: 'Yesterday 04:30 PM', notes: 'Sent MBA brochure links and references form links.' }
    ]
  },
  {
    id: 'lead-3',
    name: 'Priya Pillai',
    email: 'meera.d@gmail.com',
    phone: '+91 99887 76655',
    city: 'Pune',
    degreeTarget: 'B.Tech Biotechnology',
    stage: 'Counselling Scheduled',
    source: 'Referral',
    counsellor: 'Swati Sen',
    tags: ['State Board Topper', 'Scholarship Eligible'],
    notes: ['Daughter of alumni. Needs full syllabus guide for admissions entrance.'],
    reminderDate: '2026-05-23',
    reminderChecked: true,
    timeline: [
      { id: 't3-1', type: 'system', title: 'Lead Ingested', time: '3 days ago', notes: 'Origin: Alumni Referral (Sanjay Deshmukh, Class of 2008).' },
      { id: 't3-2', type: 'counsellor', title: 'Admissions Call Completed', time: '2 days ago', notes: 'Walked through merit waivers. Booked counselling slot for May 23.' }
    ]
  },
  {
    id: 'lead-4',
    name: 'Sahil Sharma',
    email: 'rohan.verma@outlook.com',
    phone: '+91 90011 22334',
    city: 'Bangalore',
    degreeTarget: 'MBA Finance',
    stage: 'Documents Pending',
    source: 'Meta Ads',
    counsellor: 'Dr. Sarah Jenkins',
    tags: ['CAT Qualified'],
    notes: ['CAT scorecard verified. Delaying income proof statement uploads.'],
    timeline: [
      { id: 't4-1', type: 'system', title: 'Lead Ingested', time: '5 days ago', notes: 'Origin: Instagram Ad Lead Form.' },
      { id: 't4-2', type: 'counsellor', title: 'Dossier Verification Initiated', time: '4 days ago', notes: 'Requested official Father Income Tax returns.' }
    ]
  },
  {
    id: 'lead-5',
    name: 'Priya Pillai',
    email: 'priya.pillai@gmail.com',
    phone: '+91 92233 44556',
    city: 'Chennai',
    degreeTarget: 'B.Tech CSE',
    stage: 'Admission Confirmed',
    source: 'Direct Traffic',
    counsellor: 'Swati Sen',
    tags: ['JEE >95%ile', 'Fee Paid'],
    notes: ['Full seat booking fee deposited. Reference ID: TXN-998821.'],
    timeline: [
      { id: 't5-1', type: 'system', title: 'Seat Locked', time: '2 days ago', notes: 'Seat reservation fee successfully reconciled.' }
    ]
  },
  {
    id: 'lead-6',
    name: 'Arjun Singhal',
    email: 'arjun.singhal@hotmail.com',
    phone: '+91 95566 77889',
    city: 'Kolkata',
    degreeTarget: 'B.Tech IT',
    stage: 'Inactive',
    source: 'Google Search',
    counsellor: 'Unassigned',
    tags: ['Unresponsive'],
    notes: ['No answer on phone calls for three consecutive days.'],
    timeline: [
      { id: 't6-1', type: 'system', title: 'Marked Inactive', time: 'Yesterday', notes: 'Auto-routed to passive email campaign trigger.' }
    ]
  }
];
