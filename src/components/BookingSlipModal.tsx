import React from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  CheckCircle, 
  DoorClosed, 
  Stethoscope, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  User 
} from 'lucide-react';
import { PatientBooking } from '../types/index.ts';
import { useHospital } from '../context/HospitalContext.tsx';

interface BookingSlipModalProps {
  booking: PatientBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingSlipModal: React.FC<BookingSlipModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { language } = useHospital();
  const isBn = language === 'bn';

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Controls (no-print) */}
        <div className="no-print p-4 bg-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">
              {isBn ? 'রুম বরাদ্দ স্লিপ (Bed Allotment Token)' : 'Cabin Allotment Slip'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'স্লিপ প্রিন্ট' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Body */}
        <div className="p-6 bg-white text-slate-900 print:p-0">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black tracking-tight">
                {isBn ? 'সেন্ট্রাল স্পেশালাইজড হসপিটাল' : 'Central Specialized Hospital'}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              {isBn ? 'কেবিন ও ওয়ার্ড বরাদ্দ অনুমোদন পত্র' : 'Official Cabin & Bed Allotment Slip'}
            </p>
            <div className="mt-1 font-mono text-[10px] text-slate-600">
              TOKEN: CSH-{booking.patientId} • DATE: {booking.admissionDate}
            </div>
          </div>

          {/* Room Allocation Highlight */}
          <div className="my-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">
              {isBn ? 'চূড়ান্ত বরাদ্দকৃত রুম নম্বর' : 'Allocated Room Number'}
            </span>
            <div className="text-2xl font-black text-emerald-900 flex items-center justify-center gap-2 mt-0.5">
              <DoorClosed className="w-6 h-6 text-emerald-700" />
              <span>{booking.assignedRoomNumber ? `রুম ${booking.assignedRoomNumber}` : 'অপেক্ষমাণ তালিকা'}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800">
              {booking.roomCategoryPreference}
            </span>
          </div>

          {/* Patient & Booking Details */}
          <div className="space-y-2 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">{isBn ? 'রোগীর নাম:' : 'Patient Name:'}</span>
              <span className="font-bold text-slate-900">{booking.patientName}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">{isBn ? 'পেশেন্ট আইডি:' : 'Patient ID:'}</span>
              <span className="font-mono font-bold text-slate-800">{booking.patientId}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">{isBn ? 'মোবাইল নম্বর:' : 'Contact:'}</span>
              <span className="font-medium text-slate-800">{booking.contactNumber}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">{isBn ? 'চিকিৎসক:' : 'Attending Doctor:'}</span>
              <span className="font-semibold text-teal-800">{booking.doctorName}</span>
            </div>

            {booking.directorName && (
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">{isBn ? 'সুপারিশকারী পরিচালক:' : 'Recommended Director:'}</span>
                <span className="font-medium text-indigo-800">{booking.directorName}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">{isBn ? 'বুকিংকারী:' : 'Booked By:'}</span>
              <span className="font-bold text-slate-800">{booking.bookedBy}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">{isBn ? 'ভর্তির সময়:' : 'Admission Time:'}</span>
              <span className="font-medium text-slate-800">{booking.admissionDate} at {booking.admissionTime}</span>
            </div>
          </div>

          {/* Barcode Mock Visual */}
          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <div className="flex justify-center items-center gap-1 font-mono tracking-widest text-slate-700 text-xs">
              ||||| | |||| || |||||| | || ||||| |||||
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              *{booking.patientId}*
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-6 pt-6 border-t border-slate-300 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-600">
            <div>
              <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
              <span>{isBn ? 'রোগী বা প্রতিনিধির স্বাক্ষর' : 'Patient / Guardian Signature'}</span>
            </div>
            <div>
              <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
              <span>{isBn ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authorized Officer Signature'}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
