import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { moduleRoutes } from '../config/modules';

// --- LAZY LOADED PAGES ---
const DashboardPage = React.lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ModulePlaceholderPage = React.lazy(() => import('../pages/ModulePlaceholderPage').then(m => ({ default: m.ModulePlaceholderPage })));

const WebsiteBuilderPage = React.lazy(() => import('../pages/WebsiteBuilderPage').then(m => ({ default: m.WebsiteBuilderPage })));
const FunnelBuilderPage = React.lazy(() => import('../pages/FunnelBuilderPage').then(m => ({ default: m.FunnelBuilderPage })));
const FormBuilderPage = React.lazy(() => import('../pages/FormBuilderPage').then(m => ({ default: m.FormBuilderPage })));
const ShopBuilderPage = React.lazy(() => import('../pages/ShopBuilderPage').then(m => ({ default: m.ShopBuilderPage })));
const AdLauncherPage = React.lazy(() => import('../pages/AdLauncherPage').then(m => ({ default: m.AdLauncherPage })));
const UrlShortenerPage = React.lazy(() => import('../pages/UrlShortenerPage').then(m => ({ default: m.UrlShortenerPage })));

const EmailCampaignsPage = React.lazy(() => import('../pages/EmailCampaignsPage').then(m => ({ default: m.EmailCampaignsPage })));
const WhatsappSenderPage = React.lazy(() => import('../pages/WhatsappSenderPage').then(m => ({ default: m.WhatsappSenderPage })));
const WabaPage = React.lazy(() => import('../pages/WabaPage').then(m => ({ default: m.WabaPage })));
const SmsCampaignsPage = React.lazy(() => import('../pages/SmsCampaignsPage').then(m => ({ default: m.SmsCampaignsPage })));
const IvrCallsPage = React.lazy(() => import('../pages/IvrCallsPage').then(m => ({ default: m.IvrCallsPage })));
const BulkCampaignsPage = React.lazy(() => import('../pages/BulkCampaignsPage').then(m => ({ default: m.BulkCampaignsPage })));
const WorkflowAutomationPage = React.lazy(() => import('../pages/WorkflowAutomationPage').then(m => ({ default: m.WorkflowAutomationPage })));

const AiDashboardPage = React.lazy(() => import('../pages/AiDashboardPage').then(m => ({ default: m.AiDashboardPage })));
const AiBrainPage = React.lazy(() => import('../pages/AiBrainPage').then(m => ({ default: m.AiBrainPage })));
const AiFunnelsPage = React.lazy(() => import('../pages/AiFunnelsPage').then(m => ({ default: m.AiFunnelsPage })));
const AiAgentInboxPage = React.lazy(() => import('../pages/AiAgentInboxPage').then(m => ({ default: m.AiAgentInboxPage })));

const CrmPage = React.lazy(() => import('../pages/CrmPage').then(m => ({ default: m.CrmPage })));
const AnalyticsPage = React.lazy(() => import('../pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const FinanceManagementPage = React.lazy(() => import('../pages/FinanceManagementPage').then(m => ({ default: m.FinanceManagementPage })));
const PaymentGatewayPage = React.lazy(() => import('../pages/PaymentGatewayPage').then(m => ({ default: m.PaymentGatewayPage })));
const AffiliateManagementPage = React.lazy(() => import('../pages/AffiliateManagementPage').then(m => ({ default: m.AffiliateManagementPage })));
const CalendarBookingPage = React.lazy(() => import('../pages/CalendarBookingPage').then(m => ({ default: m.CalendarBookingPage })));

const LmsPage = React.lazy(() => import('../pages/LmsPage').then(m => ({ default: m.LmsPage })));
const StudentPortalPage = React.lazy(() => import('../pages/StudentPortalPage').then(m => ({ default: m.StudentPortalPage })));
const CommunityPage = React.lazy(() => import('../pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const DiscussionForumPage = React.lazy(() => import('../pages/DiscussionForumPage').then(m => ({ default: m.DiscussionForumPage })));
const SuccessHabitsPage = React.lazy(() => import('../pages/SuccessHabitsPage').then(m => ({ default: m.SuccessHabitsPage })));

const ManageStaffPage = React.lazy(() => import('../pages/ManageStaffPage').then(m => ({ default: m.ManageStaffPage })));
const VaultPage = React.lazy(() => import('../pages/VaultPage').then(m => ({ default: m.VaultPage })));
const AppStorePage = React.lazy(() => import('../pages/AppStorePage').then(m => ({ default: m.AppStorePage })));
const ProjectManagementPage = React.lazy(() => import('../pages/ProjectManagementPage').then(m => ({ default: m.ProjectManagementPage })));
const SchoolModulePage = React.lazy(() => import('../pages/SchoolModulePage').then(m => ({ default: m.SchoolModulePage })));
const HealthModulePage = React.lazy(() => import('../pages/HealthModulePage').then(m => ({ default: m.HealthModulePage })));

// Loading Fallback Component
const PageLoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', minHeight: '60vh' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-brown-dark)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Suspense fallback={<PageLoadingFallback />}><DashboardPage /></Suspense>} />
        
        {/* Builders */}
        <Route path="builders/website-builder" element={<Suspense fallback={<PageLoadingFallback />}><WebsiteBuilderPage /></Suspense>} />
        <Route path="builders/funnel-builder" element={<Suspense fallback={<PageLoadingFallback />}><FunnelBuilderPage /></Suspense>} />
        <Route path="builders/form-builder" element={<Suspense fallback={<PageLoadingFallback />}><FormBuilderPage /></Suspense>} />
        <Route path="builders/shop-builder" element={<Suspense fallback={<PageLoadingFallback />}><ShopBuilderPage /></Suspense>} />
        <Route path="builders/ad-launcher" element={<Suspense fallback={<PageLoadingFallback />}><AdLauncherPage /></Suspense>} />
        <Route path="builders/url-shortener" element={<Suspense fallback={<PageLoadingFallback />}><UrlShortenerPage /></Suspense>} />
        
        {/* Marketing */}
        <Route path="marketing/email-campaigns" element={<Suspense fallback={<PageLoadingFallback />}><EmailCampaignsPage /></Suspense>} />
        <Route path="marketing/whatsapp-sender" element={<Suspense fallback={<PageLoadingFallback />}><WhatsappSenderPage /></Suspense>} />
        <Route path="marketing/waba" element={<Suspense fallback={<PageLoadingFallback />}><WabaPage /></Suspense>} />
        <Route path="marketing/sms-campaigns" element={<Suspense fallback={<PageLoadingFallback />}><SmsCampaignsPage /></Suspense>} />
        <Route path="marketing/ivr-calls" element={<Suspense fallback={<PageLoadingFallback />}><IvrCallsPage /></Suspense>} />
        <Route path="marketing/bulk-campaigns" element={<Suspense fallback={<PageLoadingFallback />}><BulkCampaignsPage /></Suspense>} />
        <Route path="marketing/workflow-automation" element={<Suspense fallback={<PageLoadingFallback />}><WorkflowAutomationPage /></Suspense>} />

        {/* AI Suite */}
        <Route path="ai/dashboard" element={<Suspense fallback={<PageLoadingFallback />}><AiDashboardPage /></Suspense>} />
        <Route path="ai/brain" element={<Suspense fallback={<PageLoadingFallback />}><AiBrainPage /></Suspense>} />
        <Route path="ai/funnels" element={<Suspense fallback={<PageLoadingFallback />}><AiFunnelsPage /></Suspense>} />
        <Route path="ai/agent-inbox" element={<Suspense fallback={<PageLoadingFallback />}><AiAgentInboxPage /></Suspense>} />

        {/* CRM */}
        <Route path="crm" element={<Suspense fallback={<PageLoadingFallback />}><CrmPage /></Suspense>} />
        <Route path="crm/analytics" element={<Suspense fallback={<PageLoadingFallback />}><AnalyticsPage /></Suspense>} />
        <Route path="crm/finance" element={<Suspense fallback={<PageLoadingFallback />}><FinanceManagementPage /></Suspense>} />
        <Route path="crm/payment-gateway" element={<Suspense fallback={<PageLoadingFallback />}><PaymentGatewayPage /></Suspense>} />
        <Route path="crm/affiliates" element={<Suspense fallback={<PageLoadingFallback />}><AffiliateManagementPage /></Suspense>} />
        <Route path="crm/calendar" element={<Suspense fallback={<PageLoadingFallback />}><CalendarBookingPage /></Suspense>} />

        {/* Learning */}
        <Route path="learning/lms" element={<Suspense fallback={<PageLoadingFallback />}><LmsPage /></Suspense>} />
        <Route path="learning/student-portal" element={<Suspense fallback={<PageLoadingFallback />}><StudentPortalPage /></Suspense>} />
        <Route path="learning/community" element={<Suspense fallback={<PageLoadingFallback />}><CommunityPage /></Suspense>} />
        <Route path="learning/discussion-forum" element={<Suspense fallback={<PageLoadingFallback />}><DiscussionForumPage /></Suspense>} />
        <Route path="learning/success-habits" element={<Suspense fallback={<PageLoadingFallback />}><SuccessHabitsPage /></Suspense>} />

        {/* Operations */}
        <Route path="operations/staff" element={<Suspense fallback={<PageLoadingFallback />}><ManageStaffPage /></Suspense>} />
        <Route path="operations/vault" element={<Suspense fallback={<PageLoadingFallback />}><VaultPage /></Suspense>} />
        <Route path="operations/app-store" element={<Suspense fallback={<PageLoadingFallback />}><AppStorePage /></Suspense>} />
        <Route path="operations/projects" element={<Suspense fallback={<PageLoadingFallback />}><ProjectManagementPage /></Suspense>} />
        <Route path="operations/school" element={<Suspense fallback={<PageLoadingFallback />}><SchoolModulePage /></Suspense>} />
        <Route path="operations/health" element={<Suspense fallback={<PageLoadingFallback />}><HealthModulePage /></Suspense>} />

        {/* Dynamic Fallbacks */}
        {moduleRoutes.filter(m => 
          m.id !== 'website-builder' && 
          m.id !== 'funnel-builder' && 
          m.id !== 'form-builder' && 
          m.id !== 'shop-builder' && 
          m.id !== 'ad-launcher' && 
          m.id !== 'url-shortener' &&
          m.id !== 'email-campaigns' &&
          m.id !== 'whatsapp-sender' &&
          m.id !== 'waba' &&
          m.id !== 'sms-campaigns' &&
          m.id !== 'ivr-calls' &&
          m.id !== 'bulk-campaigns' &&
          m.id !== 'workflow-automation' &&
          m.id !== 'ai-dashboard' &&
          m.id !== 'ai-brain' &&
          m.id !== 'ai-funnels' &&
          m.id !== 'ai-agent-inbox' &&
          m.id !== 'crm' &&
          m.id !== 'analytics' &&
          m.id !== 'finance-management' &&
          m.id !== 'payment-gateway' &&
          m.id !== 'affiliate-management' &&
          m.id !== 'calendar-booking' &&
          m.id !== 'lms' &&
          m.id !== 'student-portal' &&
          m.id !== 'community' &&
          m.id !== 'discussion-forum' &&
          m.id !== 'success-habits' &&
          m.id !== 'manage-staff' &&
          m.id !== 'vault' &&
          m.id !== 'app-store' &&
          m.id !== 'project-management' &&
          m.id !== 'school-module' &&
          m.id !== 'health-module'
        ).map((module) => (
          <Route
            key={module.id}
            path={module.path.replace(/^\//, '')}
            element={<Suspense fallback={<PageLoadingFallback />}><ModulePlaceholderPage /></Suspense>}
          />
        ))}
        <Route path="foundation" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
