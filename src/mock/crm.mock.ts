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
  },
  {
    id: 'lead-7',
    name: 'Riya Nair',
    email: 'riya.nair@gmail.com',
    phone: '+91 94455 66778',
    city: 'Kochi',
    degreeTarget: 'B.Tech IT',
    stage: 'Counselling Scheduled',
    source: 'Google Search',
    counsellor: 'Swati Sen',
    tags: ['KEAM Qualified', 'Hostel Required'],
    notes: ['Interested in AI specialization track. Parents attending counselling session.'],
    reminderDate: '2026-05-26',
    reminderChecked: false,
    timeline: [
      { id: 't7-1', type: 'system', title: 'Lead Ingested', time: '4 days ago', notes: 'Origin: Google Ads Search (B.Tech IT Campaign).' },
      { id: 't7-2', type: 'communication', title: 'Outbound Email Sent', time: '3 days ago', notes: 'Sent B.Tech IT curriculum brochure and lab facility catalog.' },
      { id: 't7-3', type: 'counsellor', title: 'Counselling Session Booked', time: '2 days ago', notes: 'Virtual counselling slot confirmed for May 26, 11:00 AM.' }
    ]
  },
  {
    id: 'lead-8',
    name: 'Devendra Yadav',
    email: 'devendra.yadav@outlook.com',
    phone: '+91 88990 11223',
    city: 'Jaipur',
    degreeTarget: 'MBA Marketing',
    stage: 'Documents Pending',
    source: 'Referral',
    counsellor: 'Dr. Sarah Jenkins',
    tags: ['Work Ex', 'Digital Marketing Background'],
    notes: ['3 years at a Jaipur-based e-commerce startup. Awaiting employer experience letter and MAT scorecard.'],
    reminderDate: '2026-05-27',
    reminderChecked: false,
    timeline: [
      { id: 't8-1', type: 'system', title: 'Lead Ingested', time: '6 days ago', notes: 'Origin: Alumni Referral (Sneha Kapoor, Class of 2019).' },
      { id: 't8-2', type: 'counsellor', title: 'Telephonic Interview Completed', time: '4 days ago', notes: 'Strong communication skills. Recommended for fast-track admission.' },
      { id: 't8-3', type: 'system', title: 'Document Checklist Generated', time: '3 days ago', notes: 'Pending: MAT Scorecard, Work Experience Letter, Passport-size Photo.' }
    ]
  },
  {
    id: 'lead-9',
    name: 'Meghna Bose',
    email: 'meghna.bose@gmail.com',
    phone: '+91 97711 33445',
    city: 'Hyderabad',
    degreeTarget: 'B.Tech Biotechnology',
    stage: 'Admission Confirmed',
    source: 'Meta Ads',
    counsellor: 'Swati Sen',
    tags: ['NEET Qualified', 'Fee Paid', 'Hostel Booked'],
    notes: ['Secured 96.2 percentile in NEET. Full tuition deposit and hostel booking completed. Ref: TXN-112847.'],
    timeline: [
      { id: 't9-1', type: 'system', title: 'Lead Ingested', time: '8 days ago', notes: 'Origin: Facebook Lead Form (Biotechnology Awareness Campaign).' },
      { id: 't9-2', type: 'counsellor', title: 'Campus Visit Completed', time: '5 days ago', notes: 'Toured Biotech labs and research wing. Very enthusiastic.' },
      { id: 't9-3', type: 'system', title: 'Seat Locked', time: '3 days ago', notes: 'Tuition deposit of Rs 1,20,000 reconciled. Hostel Block-C allotted.' }
    ]
  }
];
