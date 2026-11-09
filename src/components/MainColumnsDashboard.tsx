import React, { useState } from 'react';
import { 
  Hourglass, 
  DoorClosed, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Stethoscope, 
  UserCheck, 
  ArrowRight, 
  Edit3, 
  XCircle, 
  LogOut, 
  FileText, 
  History, 
  Bed, 
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  Calendar
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { PatientBooking, BookedByType } from '../types/index.ts';

interface MainColumnsDashboardProps {
  onAssignRoom: (booking: PatientBooking) => void;
  onConfirmBooking: (booking: PatientBooking) => void;
  onEditBooking: (booking: PatientBooking) => void;
  onCancelBooking: (booking: PatientBooking) => void;
  onDischargePatient: (booking: PatientBooking) => void;
  onViewHistory: (booking: PatientBooking) => void;
  onPrintSlip: (booking: PatientBooking) => void;
  onOpenAddPatient: () => void;
}

export const MainColumnsDashboard: React.FC<MainColumnsDashboardProps> = ({
  onAssignRoom,
  onConfirmBooking,
  onEditBooking,
  onCancelBooking,
  onDischargePatient,
  onViewHistory,
  onPrintSlip,
  onOpenAddPatient,
}) => {
  const { filteredBookings, language } = useHospital();
  const isBn = language === 'bn';

  // Responsive mobile active column state (on small screens, allows tab switching between the 3 main columns)
  const [activeMobileTab, setActiveMobileTab] = useState<'waiting' | 'booking_in_progress' | 'confirmed'>('waiting');

  // Separate bookings into the 3 core workflow stages
  const waitingList = filteredBookings.filter((b) => b.status === 'waiting');
  const inProgressList = filteredBookings.filter((b) => b.status === 'booking_in_progress');
  const confirmedList = filteredBookings.filter((b) => b.status === 'confirmed');

  // Helper for rendering Booked By badges
  const renderBookedByBadge = (bookedBy: BookedByType) => {
    switch (bookedBy) {
      case 'AGM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3 text-purple-700" />
            <span>AGM</span>
          </span>
        );
      case 'DGM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
            <Shield className="w-3 h-3 text-blue-700" />
            <span>DGM</span>
          </span>
        );
      case 'AO':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
            <Shield className="w-3 h-3 text-amber-700" />
            <span>AO</span>
          </span>
        );
      case 'Patient':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <UserCheck className="w-3 h-3 text-slate-500" />
            <span>{isBn ? 'রোগী নিজে' : 'Patient'}</span>
          </span>
        );
    }
  };

  // Helper for priority badge
  const renderPriorityBadge = (priority: PatientBooking['priority']) => {
    if (priority === 'vip') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          <Sparkles className="w-2.5 h-2.5 text-rose-600" />
          <span>VIP</span>
        </span>
      );
    }
    if (priority === 'urgent') {
      return (
        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          {isBn ? 'জরুরি' : 'Urgent'}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
        {isBn ? 'সাধারণ' : 'Normal'}
      </span>
    );
  };

  return (
    <div>
      {/* Workflow Step Indicator Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/60 rounded-xl p-3 sm:p-4 mb-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-600" />
              {isBn ? 'হাসপাতালের রুম বরাদ্দ প্রবাহ (Workflow):' : 'Hospital Room Workflow:'}
            </span>
            <span className="text-slate-600 hidden sm:inline">
              {isBn 
                ? '১. অপেক্ষমাণ তালিকা ➔ ২. রুম নম্বর প্রদান ➔ ৩. চূড়ান্ত নিশ্চায়ন' 
                : '1. Waiting List ➔ 2. Assign Room ➔ 3. Confirm Booking'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {isBn ? 'অপেক্ষমাণ' : 'Waiting'}: {waitingList.length}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              {isBn ? 'প্রক্রিয়াধীন' : 'In Progress'}: {inProgressList.length}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {isBn ? 'চূড়ান্ত বরাদ্দ' : 'Confirmed'}: {confirmedList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible on small screens) */}
      <div className="flex lg:hidden bg-slate-200/80 p-1 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveMobileTab('waiting')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'waiting'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Hourglass className="w-3.5 h-3.5 text-amber-600" />
          <span>{isBn ? '১. অপেক্ষমাণ' : '1. Waiting'}</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
            {waitingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMobileTab('booking_in_progress')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'booking_in_progress'
              ? 'bg-white text-sky-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DoorClosed className="w-3.5 h-3.5 text-sky-600" />
          <span>{isBn ? '২. রুম বুকিং' : '2. Room Booking'}</span>
          <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded-full">
            {inProgressList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveMobileTab('confirmed')}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'confirmed'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isBn ? '৩. চূড়ান্ত বরাদ্দ' : '3. Confirmed'}</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
            {confirmedList.length}
          </span>
        </button>
      </div>

      {/* The 3 Main Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ========================================================= */}
        {/* COLUMN 1: WAITING LIST (অপেক্ষমাণ তালিকা) */}
        {/* ========================================================= */}
        <div className={`flex flex-col bg-slate-50/70 border border-amber-200/80 rounded-2xl shadow-xs overflow-hidden ${
          activeMobileTab === 'waiting' ? 'block' : 'hidden lg:flex'
        }`}>
          {/* Column Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30">
                <Hourglass className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{isBn ? '১. অপেক্ষমাণ তালিকা' : '1. Waiting List'}</span>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    {waitingList.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'যেসব রোগী রুমের অপেক্ষায় রয়েছে' : 'Patients awaiting room allocation'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAddPatient}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors"
              title={isBn ? 'নতুন অপেক্ষমাণ রোগী যোগ করুন' : 'Add waiting patient'}
            >
              + {isBn ? 'যোগ করুন' : 'Add'}
            </button>
          </div>

          {/* Cards List */}
          <div className="p-3 sm:p-4 space-y-3 flex-1 overflow-y-auto max-h-[820px]">
            {waitingList.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <Hourglass className="w-10 h-10 text-amber-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isBn ? 'কোনো অপেক্ষমাণ রোগী নেই' : 'No patients currently in waiting list'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'নতুন রোগীর কেবিন অনুরোধ থাকলে উপরের বাটনে ক্লিক করে যুক্ত করুন।' : 'Add new admission requests to the queue.'}
                </p>
                <button
                  onClick={onOpenAddPatient}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  + {isBn ? 'অপেক্ষমাণ তালিকায় যোগ করুন' : 'Add to Waiting List'}
                </button>
              </div>
            ) : (
              waitingList.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-3 group"
                >
                  {/* Top Bar: Patient ID, Urgency & Booked By */}
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {booking.patientId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {renderPriorityBadge(booking.priority)}
                      {renderBookedByBadge(booking.bookedBy)}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {booking.patientName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      {booking.age && <span>{booking.age} {isBn ? 'বছর' : 'yrs'}</span>}
                      {booking.gender && <span>• {booking.gender}</span>}
                      <span className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {booking.contactNumber}
                      </span>
                    </div>
                  </div>

                  {/* Doctor & Requested Category */}
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{booking.doctorName}</span>
                    </div>
                    {booking.directorName && (
                      <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{isBn ? 'সুপারিশকারী পরিচালক:' : 'Recommended by:'} {booking.directorName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-500">
                      <span>{isBn ? 'পছন্দের ক্যাটাগরি:' : 'Preferred:'} <strong className="text-slate-700">{booking.roomCategoryPreference}</strong></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {booking.admissionDate} ({booking.admissionTime})
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-1.5 rounded-md border border-amber-100">
                      "{booking.notes}"
                    </p>
                  )}

                  {/* Core Action: Assign Room -> Moves to Room Booking */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onAssignRoom(booking)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-98"
                    >
                      <Bed className="w-4 h-4" />
                      <span>{isBn ? 'রুম নম্বর প্রদান করুন' : 'Assign Room'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditBooking(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'তথ্য সংশোধন' : 'Edit details'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onViewHistory(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'ইতিহাস ও লগ' : 'History'}
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onCancelBooking(booking)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={isBn ? 'তালিকা থেকে বাতিল' : 'Cancel request'}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: ROOM BOOKING (রুম বুকিং / প্রক্রিয়াধীন) */}
        {/* ========================================================= */}
        <div className={`flex flex-col bg-slate-50/70 border border-sky-200/80 rounded-2xl shadow-xs overflow-hidden ${
          activeMobileTab === 'booking_in_progress' ? 'block' : 'hidden lg:flex'
        }`}>
          {/* Column Header */}
          <div className="p-4 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border-b border-sky-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-600/30">
                <DoorClosed className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{isBn ? '২. রুম বুকিং ব্যবস্থাপনা' : '2. Room Booking'}</span>
                  <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-200">
                    {inProgressList.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'রুম নম্বর প্রদান করা হয়েছে, বুকিং প্রক্রিয়াধীন' : 'Room assigned, booking in progress'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-1 rounded-md border border-sky-200">
              {isBn ? 'যাচাই ও নিশ্চায়ন' : 'Verification'}
            </span>
          </div>

          {/* Cards List */}
          <div className="p-3 sm:p-4 space-y-3 flex-1 overflow-y-auto max-h-[820px]">
            {inProgressList.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <DoorClosed className="w-10 h-10 text-sky-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isBn ? 'বর্তমানে কোনো বুকিং প্রক্রিয়াধীন নেই' : 'No in-progress room bookings'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'অপেক্ষমাণ তালিকা থেকে রোগী নির্বাচন করে রুম নম্বর প্রদান করুন।' : 'Assign rooms to waiting patients to move them here.'}
                </p>
              </div>
            ) : (
              inProgressList.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl bg-white border border-sky-200 hover:border-sky-400 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-3 group"
                >
                  {/* Top Bar: Highlighted Assigned Room Number & Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-100">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs shadow-xs">
                        <DoorClosed className="w-3.5 h-3.5" />
                        <span>{isBn ? `রুম ${booking.assignedRoomNumber}` : `Room ${booking.assignedRoomNumber}`}</span>
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {booking.patientId}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {renderPriorityBadge(booking.priority)}
                      {renderBookedByBadge(booking.bookedBy)}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                      {booking.patientName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      {booking.age && <span>{booking.age} {isBn ? 'বছর' : 'yrs'}</span>}
                      {booking.gender && <span>• {booking.gender}</span>}
                      <span className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {booking.contactNumber}
                      </span>
                    </div>
                  </div>

                  {/* Doctor & Details */}
                  <div className="bg-sky-50/50 rounded-lg p-2.5 border border-sky-100 text-xs space-y-1">
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{booking.doctorName} ({booking.doctorDepartment})</span>
                    </div>
                    {booking.directorName && (
                      <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{isBn ? 'সুপারিশকারী পরিচালক:' : 'Recommended by:'} {booking.directorName}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-sky-100 flex items-center justify-between">
                      <span>{isBn ? 'ক্যাটাগরি:' : 'Category:'} <strong>{booking.roomCategoryPreference}</strong></span>
                      <span>{booking.admissionDate}</span>
                    </div>
                  </div>

                  {/* Core Action: Confirm Booking -> Moves to Confirmed Booking */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onConfirmBooking(booking)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isBn ? 'বুকিং নিশ্চিত করুন (Confirm)' : 'Confirm Booking'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onAssignRoom(booking)}
                        className="px-2 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                        title={isBn ? 'অন্য রুম পরিবর্তন করুন' : 'Change room'}
                      >
                        {isBn ? 'রুম বদল' : 'Reassign'}
                      </button>
                      <button
                        onClick={() => onViewHistory(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'ইতিহাস' : 'History'}
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onCancelBooking(booking)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={isBn ? 'বুকিং বাতিল' : 'Cancel booking'}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: CONFIRMED BOOKING LIST (চূড়ান্ত বরাদ্দ তালিকা) */}
        {/* ========================================================= */}
        <div className={`flex flex-col bg-slate-50/70 border border-emerald-200/80 rounded-2xl shadow-xs overflow-hidden ${
          activeMobileTab === 'confirmed' ? 'block' : 'hidden lg:flex'
        }`}>
          {/* Column Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{isBn ? '৩. চূড়ান্ত বরাদ্দ তালিকা' : '3. Confirmed List'}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {confirmedList.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'রুম বুকিং চূড়ান্তভাবে নিশ্চিত করা হয়েছে' : 'Confirmed allocated rooms & active patients'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
              {isBn ? 'সক্রিয় চিকিৎসা' : 'Active'}
            </span>
          </div>

          {/* Cards List */}
          <div className="p-3 sm:p-4 space-y-3 flex-1 overflow-y-auto max-h-[820px]">
            {confirmedList.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isBn ? 'কোনো নিশ্চিতকৃত বরাদ্দ নেই' : 'No confirmed bookings'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? '২য় কলাম থেকে বুকিং নিশ্চিত করলে তা এখানে প্রদর্শিত হবে।' : 'Confirm bookings from column 2 to move them here.'}
                </p>
              </div>
            ) : (
              confirmedList.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 shadow-2xs hover:shadow-sm transition-all flex flex-col gap-3 group"
                >
                  {/* Top Bar: Room Badge & Confirmed Check */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-100">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBn ? `রুম ${booking.assignedRoomNumber}` : `Room ${booking.assignedRoomNumber}`}</span>
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {booking.patientId}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {renderPriorityBadge(booking.priority)}
                      {renderBookedByBadge(booking.bookedBy)}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {booking.patientName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      {booking.age && <span>{booking.age} {isBn ? 'বছর' : 'yrs'}</span>}
                      {booking.gender && <span>• {booking.gender}</span>}
                      <span className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {booking.contactNumber}
                      </span>
                    </div>
                  </div>

                  {/* Doctor & Director Details as requested */}
                  <div className="bg-emerald-50/40 rounded-lg p-2.5 border border-emerald-100 text-xs space-y-1">
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{isBn ? 'চিকিৎসক:' : 'Doctor:'} {booking.doctorName}</span>
                    </div>
                    {booking.directorName ? (
                      <div className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{isBn ? 'পরিচালক:' : 'Director:'} {booking.directorName}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        {isBn ? 'বুকিংকারী:' : 'Booked By:'} {booking.bookedByName || booking.bookedBy}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-emerald-100 flex items-center justify-between">
                      <span>{isBn ? 'ক্যাটাগরি:' : 'Category:'} <strong>{booking.roomCategoryPreference}</strong></span>
                      <span>{booking.admissionDate}</span>
                    </div>
                  </div>

                  {/* Actions: Discharge / Release Room, Print Slip, Edit, Cancel */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                    {/* Discharge button */}
                    <button
                      onClick={() => onDischargePatient(booking)}
                      className="inline-flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                      title={isBn ? 'রোগীকে ছাড়পত্র প্রদান ও রুম খালি করুন' : 'Discharge patient and release room'}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ছাড়পত্র / রিলিজ' : 'Discharge'}</span>
                    </button>

                    {/* Print Slip */}
                    <button
                      onClick={() => onPrintSlip(booking)}
                      className="inline-flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title={isBn ? 'বুকিং স্লিপ প্রিন্ট করুন' : 'Print booking slip'}
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isBn ? 'স্লিপ' : 'Slip'}</span>
                    </button>

                    {/* Edit, History, Cancel */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditBooking(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'তথ্য সংশোধন' : 'Edit details'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onViewHistory(booking)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={isBn ? 'ইতিহাস' : 'History'}
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onCancelBooking(booking)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={isBn ? 'বুকিং বাতিল' : 'Cancel booking'}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
