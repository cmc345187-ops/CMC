import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  Filter, 
  CheckCircle,
  DoorClosed,
  Stethoscope
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { getTodayDateString } from '../utils/bookingLogic.ts';
import { BookedByType, BookingStatus } from '../types/index.ts';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose }) => {
  const { bookings, rooms, language } = useHospital();
  const isBn = language === 'bn';

  const [reportDate, setReportDate] = useState<string>(getTodayDateString());
  const [reportStatusFilter, setReportStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [reportBookedByFilter, setReportBookedByFilter] = useState<BookedByType | 'all'>('all');

  if (!isOpen) return null;

  // Filter bookings for the selected daily report date
  const filteredReportBookings = bookings.filter((b) => {
    // Match date: either admission date is reportDate OR it is an active in-progress/confirmed booking covering this date
    const dateMatches = b.admissionDate === reportDate || 
      ((b.status === 'confirmed' || b.status === 'booking_in_progress') && b.admissionDate <= reportDate);
    
    if (!dateMatches) return false;

    if (reportStatusFilter !== 'all' && b.status !== reportStatusFilter) {
      return false;
    }

    if (reportBookedByFilter !== 'all' && b.bookedBy !== reportBookedByFilter) {
      return false;
    }

    return true;
  });

  // Calculate stats for this specific report day
  const confirmedOnDay = filteredReportBookings.filter((b) => b.status === 'confirmed').length;
  const inProgressOnDay = filteredReportBookings.filter((b) => b.status === 'booking_in_progress').length;
  const waitingOnDay = filteredReportBookings.filter((b) => b.status === 'waiting').length;
  const totalOccupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const totalAvailableRooms = rooms.filter((r) => r.status === 'available').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'SL',
      'Patient Name',
      'Patient ID',
      'Room Number',
      'Room Category',
      'Doctor Name',
      'Director Name',
      'Booked By',
      'Admission Date & Time',
      'Status',
    ];

    const rows = filteredReportBookings.map((b, idx) => [
      idx + 1,
      `"${b.patientName}"`,
      b.patientId,
      b.assignedRoomNumber || 'N/A',
      `"${b.roomCategoryPreference}"`,
      `"${b.doctorName}"`,
      `"${b.directorName || 'None'}"`,
      b.bookedBy,
      `${b.admissionDate} ${b.admissionTime}`,
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hospital_Daily_Room_Report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-700 font-bold">{isBn ? 'চূড়ান্ত বরাদ্দ' : 'Confirmed'}</span>;
      case 'booking_in_progress':
        return <span className="text-sky-700 font-bold">{isBn ? 'বুকিং প্রক্রিয়াধীন' : 'In Progress'}</span>;
      case 'waiting':
        return <span className="text-amber-700 font-bold">{isBn ? 'অপেক্ষমাণ' : 'Waiting'}</span>;
      case 'discharged':
        return <span className="text-slate-600 font-medium">{isBn ? 'ছাড়পত্র প্রাপ্ত' : 'Discharged'}</span>;
      case 'cancelled':
        return <span className="text-rose-600 font-medium">{isBn ? 'বাতিলকৃত' : 'Cancelled'}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-4 sm:my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="no-print p-4 bg-slate-800 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">
                {isBn ? 'দৈনিক রুম বুকিং ও বরাদ্দ রিপোর্ট' : 'Daily Room Booking & Allocation Report'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'PDF প্রিন্ট ও আর্কাইভ তৈরি' : 'One-click PDF generation & print ready'}
              </p>
            </div>
          </div>

          {/* Quick Date and Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-600">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer"
              />
            </div>

            <select
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value as any)}
              className="bg-slate-700 text-white px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-hidden"
            >
              <option value="all">{isBn ? 'সকল অবস্থা' : 'All Statuses'}</option>
              <option value="confirmed">{isBn ? 'চূড়ান্ত বরাদ্দ' : 'Confirmed'}</option>
              <option value="booking_in_progress">{isBn ? 'প্রক্রিয়াধীন' : 'In Progress'}</option>
              <option value="waiting">{isBn ? 'অপেক্ষমাণ' : 'Waiting'}</option>
            </select>

            <select
              value={reportBookedByFilter}
              onChange={(e) => setReportBookedByFilter(e.target.value as any)}
              className="bg-slate-700 text-white px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-hidden"
            >
              <option value="all">{isBn ? 'সকল বুকিংকারী' : 'All Roles'}</option>
              <option value="Patient">Patient</option>
              <option value="AGM">AGM</option>
              <option value="DGM">DGM</option>
              <option value="AO">AO</option>
            </select>

            {/* Print & CSV buttons */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / PDF সেভ' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-colors"
              title={isBn ? 'এক্সেল / সিএসভি ফাইল ডাউনলোড' : 'Download CSV'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Hospital Report Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white print:p-0 print:overflow-visible">
          
          {/* Hospital Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold text-xl print:border print:border-black">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {isBn ? 'সেন্ট্রাল স্পেশালাইজড হসপিটাল লিমিটেড' : 'Central Specialized Hospital Limited'}
                  </h1>
                  <p className="text-xs text-slate-600">
                    {isBn 
                      ? 'রুম বুকিং, কেবিন বরাদ্দ ও ভর্তি ব্যবস্থাপনা বিভাগ | ঢাকা, বাংলাদেশ' 
                      : 'Room Booking, Cabin Allotment & Admission Directorate | Dhaka, Bangladesh'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Phone: +880 2-9876543 | Emergency: 10616 | Web: www.centralhospital.gov.bd
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-sm bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-300">
                  REF: CSH-REP-{reportDate.replace(/-/g, '')}
                </span>
                <p className="text-xs text-slate-600 mt-1 flex items-center justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'রিপোর্টের তারিখ:' : 'Report Date:'} <strong>{reportDate}</strong></span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'মুদ্রণ সময়:' : 'Generated at:'} {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-center">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                {isBn 
                  ? 'দৈনিক রুম বুকিং ও রোগী বরাদ্দ রিপোর্ট (DAILY ROOM BOOKING & ALLOCATION REPORT)' 
                  : 'DAILY ROOM BOOKING & ALLOCATION REPORT'}
              </h2>
            </div>
          </div>

          {/* Daily Metrics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200 print:bg-white print:border-slate-400">
            <div className="text-center p-2 border-r border-slate-200 last:border-none">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {isBn ? 'মোট রুম' : 'Total Rooms'}
              </span>
              <span className="text-lg font-black text-slate-800">{rooms.length}</span>
            </div>

            <div className="text-center p-2 border-r border-slate-200 last:border-none">
              <span className="text-[10px] text-emerald-600 uppercase font-bold block">
                {isBn ? 'খালি রুম' : 'Available Rooms'}
              </span>
              <span className="text-lg font-black text-emerald-700">{totalAvailableRooms}</span>
            </div>

            <div className="text-center p-2 border-r border-slate-200 last:border-none">
              <span className="text-[10px] text-indigo-600 uppercase font-bold block">
                {isBn ? 'চূড়ান্ত বরাদ্দ' : 'Confirmed'}
              </span>
              <span className="text-lg font-black text-indigo-700">{confirmedOnDay}</span>
            </div>

            <div className="text-center p-2 border-r border-slate-200 last:border-none">
              <span className="text-[10px] text-sky-600 uppercase font-bold block">
                {isBn ? 'প্রক্রিয়াধীন' : 'In Progress'}
              </span>
              <span className="text-lg font-black text-sky-700">{inProgressOnDay}</span>
            </div>

            <div className="text-center p-2">
              <span className="text-[10px] text-amber-600 uppercase font-bold block">
                {isBn ? 'অপেক্ষমাণ রোগী' : 'Waiting List'}
              </span>
              <span className="text-lg font-black text-amber-700">{waitingOnDay}</span>
            </div>
          </div>

          {/* Detailed Patient & Room Allotment Table as specified in Section 2.5 */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 print:bg-slate-200">
                  <th className="p-2 border border-slate-300 text-center w-10">
                    {isBn ? 'ক্রমিক' : 'SL'}
                  </th>
                  <th className="p-2 border border-slate-300">
                    {isBn ? 'রোগীর নাম ও আইডি' : 'Patient Name & ID'}
                  </th>
                  <th className="p-2 border border-slate-300 text-center">
                    {isBn ? 'রুম নম্বর ও ধরন' : 'Room No & Type'}
                  </th>
                  <th className="p-2 border border-slate-300">
                    {isBn ? 'চিকিৎসকের নাম' : 'Doctor Name'}
                  </th>
                  <th className="p-2 border border-slate-300">
                    {isBn ? 'পরিচালকের নাম / সুপারিশ' : 'Director / Reference'}
                  </th>
                  <th className="p-2 border border-slate-300 text-center">
                    {isBn ? 'বুকিংকারীর ধরন' : 'Booked By'}
                  </th>
                  <th className="p-2 border border-slate-300 text-center">
                    {isBn ? 'ভর্তির তারিখ ও সময়' : 'Date & Time'}
                  </th>
                  <th className="p-2 border border-slate-300 text-center">
                    {isBn ? 'বর্তমান অবস্থা' : 'Current Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReportBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500 border border-slate-300">
                      {isBn ? 'এই তারিখে কোনো বুকিং বা বরাদ্দের রেকর্ড নেই।' : 'No records found for this date.'}
                    </td>
                  </tr>
                ) : (
                  filteredReportBookings.map((b, idx) => (
                    <tr key={b.id} className="border-b border-slate-200 hover:bg-slate-50 print:hover:bg-transparent">
                      <td className="p-2 border border-slate-300 text-center font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="font-bold text-slate-900">{b.patientName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{b.patientId} • {b.contactNumber}</div>
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        {b.assignedRoomNumber ? (
                          <div>
                            <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {b.assignedRoomNumber}
                            </span>
                            <div className="text-[10px] text-slate-500">{b.roomCategoryPreference}</div>
                          </div>
                        ) : (
                          <span className="text-amber-700 italic text-[11px]">
                            {isBn ? `অপেক্ষমাণ (${b.roomCategoryPreference})` : `Pending (${b.roomCategoryPreference})`}
                          </span>
                        )}
                      </td>
                      <td className="p-2 border border-slate-300">
                        <div className="font-medium text-slate-800">{b.doctorName}</div>
                        <div className="text-[10px] text-slate-500">{b.doctorDepartment}</div>
                      </td>
                      <td className="p-2 border border-slate-300">
                        {b.directorName ? (
                          <div className="text-slate-800 font-medium">{b.directorName}</div>
                        ) : (
                          <div className="text-slate-400 italic">{isBn ? 'সাধারণ ভর্তি' : 'General'}</div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-800">
                          {b.bookedBy}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-[11px]">
                        <div>{b.admissionDate}</div>
                        <div className="text-slate-500">{b.admissionTime}</div>
                      </td>
                      <td className="p-2 border border-slate-300 text-center">
                        {getStatusBadge(b.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Authorized Signature Blocks for Official Hospital Report */}
          <div className="print-break-inside-avoid mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs text-slate-800">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <p className="font-bold">{isBn ? 'প্রস্তুতকারীর স্বাক্ষর' : 'Prepared By'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'অ্যাডমিশন ও ফ্রন্টডেস্ক অফিসার' : 'Admission & Front Desk Officer'}</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <p className="font-bold">{isBn ? 'মেডিকেল অফিসার / ইনচার্জ' : 'Medical Officer / Incharge'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'চিকিৎসা সেবা শাখা' : 'Clinical Service Division'}</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <p className="font-bold">{isBn ? 'পরিচালক / এজিএম / ডিজিএম' : 'Director / AGM / DGM'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'হাসপাতাল প্রশাসন ও বরাদ্দ অনুমোদন' : 'Hospital Administration Approval'}</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-[10px] text-slate-400 print:text-black border-t border-slate-100 pt-3">
            {isBn 
              ? 'এই রিপোর্টটি সেন্ট্রাল হসপিটাল রুম বুকিং অ্যান্ড ওয়েটিং লিস্ট ম্যানেজমেন্ট সফটওয়্যার দ্বারা স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত।' 
              : 'This official report was generated by Central Hospital Room Booking & Waiting List Management System.'}
          </div>

        </div>

      </div>
    </div>
  );
};
