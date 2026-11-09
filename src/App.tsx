import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { SearchAndFilters } from './components/SearchAndFilters.tsx';
import { StatSummary } from './components/StatSummary.tsx';
import { MainColumnsDashboard } from './components/MainColumnsDashboard.tsx';
import { AddPatientModal } from './components/AddPatientModal.tsx';
import { AssignRoomModal } from './components/AssignRoomModal.tsx';
import { ConfirmBookingModal } from './components/ConfirmBookingModal.tsx';
import { DailyReportModal } from './components/DailyReportModal.tsx';
import { RoomGridModal } from './components/RoomGridModal.tsx';
import { DirectoryModal } from './components/DirectoryModal.tsx';
import { BookingSlipModal } from './components/BookingSlipModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { EditBookingModal } from './components/EditBookingModal.tsx';
import { PatientBooking } from './types/index.ts';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Download, 
  Upload, 
  HeartHandshake, 
  CheckCircle2,
  Database
} from 'lucide-react';

const HospitalAppContent: React.FC = () => {
  const { 
    cancelBooking, 
    dischargePatient, 
    language, 
    exportDatabaseJSON, 
    importDatabaseJSON 
  } = useHospital();
  
  const isBn = language === 'bn';

  // Modal States
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isRoomGridOpen, setIsRoomGridOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  
  const [assigningBooking, setAssigningBooking] = useState<PatientBooking | null>(null);
  const [confirmingBooking, setConfirmingBooking] = useState<PatientBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<PatientBooking | null>(null);
  const [viewingHistoryBooking, setViewingHistoryBooking] = useState<PatientBooking | null>(null);
  const [printingSlipBooking, setPrintingSlipBooking] = useState<PatientBooking | null>(null);

  // Cancellation Handler
  const handleCancelBooking = (booking: PatientBooking) => {
    const reasonPrompt = window.prompt(
      isBn 
        ? `বুকিং বাতিলের কারণ লিখুন (${booking.patientName} - ${booking.patientId}):` 
        : `Enter cancellation reason for ${booking.patientName}:`,
      isBn ? 'রোগী নিজে বাতিল করেছেন অথবা অন্য হাসপাতালে রেফার' : 'Patient requested cancellation'
    );
    if (reasonPrompt !== null) {
      cancelBooking(booking.id, reasonPrompt);
    }
  };

  // Discharge Handler
  const handleDischargePatient = (booking: PatientBooking) => {
    const confirmed = window.confirm(
      isBn
        ? `আপনি কি নিশ্চিত যে ${booking.patientName}-কে ছাড়পত্র (Discharge) প্রদান করে রুম ${booking.assignedRoomNumber} খালি করতে চান?`
        : `Are you sure you want to discharge ${booking.patientName} and release Room ${booking.assignedRoomNumber}?`
    );
    if (confirmed) {
      dischargePatient(booking.id);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hospital_Room_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importDatabaseJSON(content);
          if (success) {
            alert(isBn ? 'ডেটা সফলভাবে লোড হয়েছে।' : 'Database backup imported successfully.');
          } else {
            alert(isBn ? 'ভুল ফাইল ফরম্যাট।' : 'Invalid file format.');
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <Navbar
        onOpenAddPatient={() => setIsAddPatientOpen(true)}
        onOpenDailyReport={() => setIsDailyReportOpen(true)}
        onOpenRoomGrid={() => setIsRoomGridOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Room Booking Search System */}
        <SearchAndFilters />

        {/* Live Counters and Stats */}
        <StatSummary />

        {/* 3 Main Workflow Columns: Waiting List -> Room Booking -> Confirmed Booking */}
        <MainColumnsDashboard
          onAssignRoom={(booking) => setAssigningBooking(booking)}
          onConfirmBooking={(booking) => setConfirmingBooking(booking)}
          onEditBooking={(booking) => setEditingBooking(booking)}
          onCancelBooking={handleCancelBooking}
          onDischargePatient={handleDischargePatient}
          onViewHistory={(booking) => setViewingHistoryBooking(booking)}
          onPrintSlip={(booking) => setPrintingSlipBooking(booking)}
          onOpenAddPatient={() => setIsAddPatientOpen(true)}
        />
      </main>

      {/* Hospital Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">
                {isBn ? 'হাসপাতালের রুম বুকিং ও অপেক্ষমাণ তালিকা ব্যবস্থাপনা সিস্টেম' : 'Hospital Room Booking & Waiting List Management System'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isBn 
                  ? 'পরিচালক, ডাক্তার ও রোগীদের জন্য কেন্দ্রীয় রুম বরাদ্দ সফটওয়্যার' 
                  : 'Central Room & Cabin Management for Hospital Directorate & Doctors'}
              </p>
            </div>
          </div>

          {/* Backup & Restore Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
              title={isBn ? 'ডেটা ব্যাকআপ ডাউনলোড (JSON)' : 'Export JSON Backup'}
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'ব্যাকআপ ডাউনলোড' : 'Export JSON'}</span>
            </button>

            <button
              onClick={handleImportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
              title={isBn ? 'ডেটা ব্যাকআপ রিস্টোর' : 'Import JSON Backup'}
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'ব্যাকআপ রিস্টোর' : 'Restore'}</span>
            </button>

            <button
              onClick={() => setIsDailyReportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors border border-emerald-300 font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'দৈনিক PDF রিপোর্ট' : 'Daily Report'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

      <AssignRoomModal
        booking={assigningBooking}
        isOpen={Boolean(assigningBooking)}
        onClose={() => setAssigningBooking(null)}
      />

      <ConfirmBookingModal
        booking={confirmingBooking}
        isOpen={Boolean(confirmingBooking)}
        onClose={() => setConfirmingBooking(null)}
      />

      <DailyReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
      />

      <RoomGridModal
        isOpen={isRoomGridOpen}
        onClose={() => setIsRoomGridOpen(false)}
      />

      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />

      <BookingSlipModal
        booking={printingSlipBooking}
        isOpen={Boolean(printingSlipBooking)}
        onClose={() => setPrintingSlipBooking(null)}
      />

      <HistoryModal
        booking={viewingHistoryBooking}
        isOpen={Boolean(viewingHistoryBooking)}
        onClose={() => setViewingHistoryBooking(null)}
      />

      <EditBookingModal
        booking={editingBooking}
        isOpen={Boolean(editingBooking)}
        onClose={() => setEditingBooking(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <HospitalAppContent />
    </HospitalProvider>
  );
}
