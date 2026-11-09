import React from 'react';
import { 
  X, 
  CheckCircle2, 
  DoorClosed, 
  User, 
  Stethoscope, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Phone 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { PatientBooking } from '../types/index.ts';

interface ConfirmBookingModalProps {
  booking: PatientBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { confirmBooking, language } = useHospital();
  const isBn = language === 'bn';

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    confirmBooking(booking.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? 'রুম বুকিং চূড়ান্তভাবে নিশ্চিত করুন' : 'Confirm Room Booking'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isBn ? 'চূড়ান্ত বরাদ্দ তালিকায় স্থানান্তর ও রুম লক করা হবে' : 'Move to confirmed list and lock room status'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
              {isBn ? 'বরাদ্দকৃত রুম' : 'Assigned Room'}
            </span>
            <div className="text-3xl font-black text-emerald-800 flex items-center justify-center gap-2">
              <DoorClosed className="w-7 h-7 text-emerald-600" />
              <span>{isBn ? `রুম ${booking.assignedRoomNumber}` : `Room ${booking.assignedRoomNumber}`}</span>
            </div>
            <div className="text-xs font-bold text-emerald-900 mt-1">
              {booking.roomCategoryPreference}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">{isBn ? 'রোগীর নাম ও আইডি:' : 'Patient Name & ID:'}</span>
              <span className="font-bold text-slate-900 text-sm">
                {booking.patientName} ({booking.patientId})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isBn ? 'যোগাযোগ:' : 'Contact:'}</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {booking.contactNumber}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isBn ? 'চিকিৎসক:' : 'Attending Doctor:'}</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                {booking.doctorName}
              </span>
            </div>

            {booking.directorName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{isBn ? 'সুপারিশকারী পরিচালক:' : 'Recommended Director:'}</span>
                <span className="font-semibold text-indigo-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  {booking.directorName}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isBn ? 'বুকিংকারীর ধরন:' : 'Booked By:'}</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-sm border border-purple-200">
                {booking.bookedBy}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">{isBn ? 'ভর্তির তারিখ ও সময়:' : 'Admission Date & Time:'}</span>
              <span className="font-semibold text-slate-800">
                {booking.admissionDate} ({booking.admissionTime})
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            {isBn 
              ? 'বুকিং নিশ্চিত করলে সংশ্লিষ্ট রুমটি সিস্টেমে চূড়ান্তভাবে বরাদ্দ এবং অন্য কোনো রোগীর জন্য অকার্যকর হয়ে যাবে।' 
              : 'Confirming will mark this room as occupied and officially admitted in the system.'}
          </p>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              {isBn ? 'হ্যাঁ, বুকিং নিশ্চিত করুন' : 'Yes, Confirm Booking'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
