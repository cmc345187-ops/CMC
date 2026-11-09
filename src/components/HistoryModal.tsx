import React from 'react';
import { X, History, Clock, User, ShieldCheck, FileText } from 'lucide-react';
import { PatientBooking } from '../types/index.ts';
import { useHospital } from '../context/HospitalContext.tsx';

interface HistoryModalProps {
  booking: PatientBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { language } = useHospital();
  const isBn = language === 'bn';

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10">
              <History className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h3 className="text-base font-bold">
                {isBn ? 'বুকিং পরিবর্তন ও বরাদ্দের ইতিহাস' : 'Booking Activity & History Log'}
              </h3>
              <p className="text-xs text-slate-300">
                {booking.patientName} ({booking.patientId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {booking.historyLog && booking.historyLog.length > 0 ? (
              booking.historyLog.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-600 shadow-xs"></div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {isBn ? item.actionBn || item.action : item.action}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                      </span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'সম্পাদনকারী:' : 'Action by:'} <strong className="text-slate-800">{item.user}</strong></span>
                    </div>

                    {item.details && (
                      <p className="text-[11px] text-slate-500 bg-white p-2 rounded-md border border-slate-100 mt-1">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                {isBn ? 'কোনো পূর্ববর্তী ইতিহাস পাওয়া যায়নি।' : 'No activity logged yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
