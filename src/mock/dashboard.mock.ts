import type { WorkflowStage } from '../theme';

export interface KpiMetric {
  id: string;
  label: string;
  chipLabel: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  stage: WorkflowStage;
  icon: 'inquiries' | 'leads' | 'conversion' | 'whatsapp' | 'workflow' | 'finance' | 'students' | 'ai' | 'calendar';
}

export const kpiMetrics: KpiMetric[] = [
  {
    id: 'inquiries',
    label: 'Admission Inquiries',
    chipLabel: 'Inquiries',
    value: '1,284',
    change: '+18% vs last week',
    trend: 'up',
    stage: 'blue',
    icon: 'inquiries',
  },
  {
    id: 'leads',
    label: 'Active Leads',
    chipLabel: 'Leads',
    value: '456',
    change: '62 hot · 394 warm',
    trend: 'up',
    stage: 'purple',
    icon: 'leads',
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    chipLabel: 'Conversion',
    value: '24.8%',
    change: '+2.1% this month',
    trend: 'up',
    stage: 'green',
    icon: 'conversion',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Activity',
    chipLabel: 'WhatsApp',
    value: '3,420',
    change: 'Msgs sent today',
    trend: 'up',
    stage: 'green',
    icon: 'whatsapp',
  },
  {
    id: 'workflow',
    label: 'Workflow Activity',
    chipLabel: 'Workflow',
    value: '89',
    change: '12 automations running',
    trend: 'neutral',
    stage: 'orange',
    icon: 'workflow',
  },
  {
    id: 'fees',
    label: 'Fee Collection',
    chipLabel: 'Finance',
    value: '₹42.6L',
    change: '73% of monthly target',
    trend: 'up',
    stage: 'yellow',
    icon: 'finance',
  },
  {
    id: 'engagement',
    label: 'Student Engagement',
    chipLabel: 'Students',
    value: '78%',
    change: '+5% vs last term',
    trend: 'up',
    stage: 'blue',
    icon: 'students',
  },
  {
    id: 'ai',
    label: 'AI Activity',
    chipLabel: 'AI',
    value: '234',
    change: 'Sessions in last 24h',
    trend: 'up',
    stage: 'purple',
    icon: 'ai',
  },
  {
    id: 'counselling',
    label: 'Counselling Sessions',
    chipLabel: 'Sessions',
    value: '12',
    change: 'Upcoming this week',
    trend: 'neutral',
    stage: 'orange',
    icon: 'calendar',
  },
];

export const admissionsTrend = [
  { day: 'Mon', inquiries: 142, leads: 48 },
  { day: 'Tue', inquiries: 168, leads: 52 },
  { day: 'Wed', inquiries: 155, leads: 45 },
  { day: 'Thu', inquiries: 198, leads: 61 },
  { day: 'Fri', inquiries: 210, leads: 58 },
  { day: 'Sat', inquiries: 124, leads: 38 },
  { day: 'Sun', inquiries: 98, leads: 29 },
];

export const conversionFunnel = [
  { stage: 'Inquiry', count: 1284, fill: '#3d6b9e' },
  { stage: 'Qualified', count: 892, fill: '#6b4f8a' },
  { stage: 'Applied', count: 534, fill: '#a66b3d' },
  { stage: 'Interview', count: 312, fill: '#8a7a3d' },
  { stage: 'Enrolled', count: 318, fill: '#3d7a52' },
];

export const feeCollectionTrend = [
  { month: 'Jan', collected: 38, target: 52 },
  { month: 'Feb', collected: 41, target: 52 },
  { month: 'Mar', collected: 45, target: 55 },
  { month: 'Apr', collected: 43, target: 55 },
  { month: 'May', collected: 48, target: 58 },
  { month: 'Jun', collected: 43, target: 58 },
];

export const activityFeed = [
  {
    id: '1',
    title: 'New admission inquiry',
    detail: 'Riya Patel — B.Tech CSE via website form',
    time: '4 min ago',
    stage: 'blue' as WorkflowStage,
  },
  {
    id: '2',
    title: 'Workflow completed',
    detail: 'Fee reminder sent to 24 students',
    time: '18 min ago',
    stage: 'green' as WorkflowStage,
  },
  {
    id: '3',
    title: 'WhatsApp campaign delivered',
    detail: 'Open Day invite — 98% delivery rate',
    time: '42 min ago',
    stage: 'green' as WorkflowStage,
  },
  {
    id: '4',
    title: 'Lead stage updated',
    detail: 'Vikram Singh moved to Interview',
    time: '1h ago',
    stage: 'purple' as WorkflowStage,
  },
  {
    id: '5',
    title: 'AI funnel suggestion',
    detail: '3 follow-up sequences recommended',
    time: '2h ago',
    stage: 'purple' as WorkflowStage,
  },
  {
    id: '6',
    title: 'Payment received',
    detail: '₹85,000 — Semester II fees',
    time: '3h ago',
    stage: 'yellow' as WorkflowStage,
  },
];

export const automationRuns = [
  {
    id: '1',
    name: 'Admission follow-up sequence',
    progress: 72,
    status: 'Running',
    stage: 'blue' as WorkflowStage,
  },
  {
    id: '2',
    name: 'Fee defaulter reminders',
    progress: 45,
    status: 'Running',
    stage: 'orange' as WorkflowStage,
  },
  {
    id: '3',
    name: 'Open day RSVP nudges',
    progress: 100,
    status: 'Completed',
    stage: 'green' as WorkflowStage,
  },
  {
    id: '4',
    name: 'Counselling slot confirmations',
    progress: 28,
    status: 'Scheduled',
    stage: 'purple' as WorkflowStage,
  },
];

export const communicationStats = {
  whatsappSent: 3420,
  whatsappRead: 2891,
  emailSent: 1840,
  smsSent: 620,
  responseRate: 84,
};

export const topLeads = [
  { id: '1', name: 'Ananya Krishnan', program: 'MBA', score: 92, stage: 'purple' as WorkflowStage },
  { id: '2', name: 'Rohan Desai', program: 'B.Tech AI', score: 88, stage: 'orange' as WorkflowStage },
  { id: '3', name: 'Meera Joshi', program: 'B.Des', score: 85, stage: 'yellow' as WorkflowStage },
  { id: '4', name: 'Karthik Nair', program: 'M.Tech', score: 81, stage: 'blue' as WorkflowStage },
];

export interface PipelineItem {
  id: string;
  name: string;
  department: string;
  stage: WorkflowStage;
  updatedAt: string;
}

export const pipelinePreview: PipelineItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    department: 'Computer Science',
    stage: 'blue',
    updatedAt: '2h ago',
  },
  {
    id: '2',
    name: 'Arjun Mehta',
    department: 'Mechanical Eng.',
    stage: 'purple',
    updatedAt: '4h ago',
  },
  {
    id: '3',
    name: 'Sneha Reddy',
    department: 'Business Admin',
    stage: 'orange',
    updatedAt: '1d ago',
  },
  {
    id: '4',
    name: 'Rahul Verma',
    department: 'Electronics',
    stage: 'yellow',
    updatedAt: '1d ago',
  },
  {
    id: '5',
    name: 'Ananya Iyer',
    department: 'Architecture',
    stage: 'green',
    updatedAt: '2d ago',
  },
];

export const studentEngagement = [
  { program: 'Engineering', active: 89, label: '89%' },
  { program: 'Management', active: 76, label: '76%' },
  { program: 'Design', active: 82, label: '82%' },
  { program: 'Sciences', active: 71, label: '71%' },
];

export const financeSummary = {
  collected: 4260000,
  pending: 1580000,
  overdue: 420000,
  target: 5800000,
};

export const financeBreakdown = [
  { label: 'Tuition', amount: 28.4, stage: 'green' as WorkflowStage },
  { label: 'Hostel', amount: 8.2, stage: 'blue' as WorkflowStage },
  { label: 'Lab & Misc', amount: 4.1, stage: 'yellow' as WorkflowStage },
  { label: 'Transport', amount: 1.9, stage: 'gray' as WorkflowStage },
];

export const aiActivity = [
  { id: '1', action: 'Lead scoring batch', count: 156, time: '1h ago' },
  { id: '2', action: 'Chatbot resolutions', count: 48, time: '2h ago' },
  { id: '3', action: 'Funnel optimizations', count: 12, time: '4h ago' },
  { id: '4', action: 'Email copy suggestions', count: 18, time: '6h ago' },
];

export const counsellingSessions = [
  {
    id: '1',
    student: 'Priya Sharma',
    counsellor: 'Dr. Mehta',
    time: 'Today, 2:30 PM',
    type: 'Career',
    stage: 'blue' as WorkflowStage,
  },
  {
    id: '2',
    student: 'Arjun Patel',
    counsellor: 'Ms. Rao',
    time: 'Today, 4:00 PM',
    type: 'Admission',
    stage: 'purple' as WorkflowStage,
  },
  {
    id: '3',
    student: 'Sneha Iyer',
    counsellor: 'Dr. Khan',
    time: 'Tomorrow, 10:00 AM',
    type: 'Academic',
    stage: 'green' as WorkflowStage,
  },
  {
    id: '4',
    student: 'Rahul Verma',
    counsellor: 'Ms. Rao',
    time: 'Wed, 11:30 AM',
    type: 'Admission',
    stage: 'orange' as WorkflowStage,
  },
];

export const analyticsHighlights = [
  { label: 'Avg. response time', value: '4.2 min', stage: 'green' as WorkflowStage },
  { label: 'Lead-to-enroll cycle', value: '18 days', stage: 'blue' as WorkflowStage },
  { label: 'Campaign ROI', value: '3.4×', stage: 'purple' as WorkflowStage },
];
