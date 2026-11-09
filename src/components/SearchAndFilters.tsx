import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  DoorClosed, 
  Stethoscope, 
  Calendar, 
  X, 
  CheckCircle2, 
  Clock, 
  UserCheck,
  User,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { BookedByType, BookingStatus, RoomCategory } from '../types/index.ts';

interface SearchAndFiltersProps {
  onSelectBooking?: (bookingId: string) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({ onSelectBooking }) => {
  const { 
    filters, 
    setFilters, 
    doctors, 
    rooms, 
    filteredBookings, 
    language 
  } = useHospital();

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const isBn = language === 'bn';

  const roomCategories: RoomCategory[] = [
    'VIP Cabin', 
    'Deluxe Cabin', 
    'AC Cabin', 
    'Non-AC Cabin', 
    'General Ward', 
    'ICU', 
    'CCU'
  ];

  const bookedByOptions: BookedByType[] = ['Patient', 'AGM', 'DGM', 'AO'];

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      doctorName: '',
      roomNumber: '',
      status: 'all',
      bookedBy: 'all',
      dateFilter: '',
      onlyRunningDate: true,
      roomCategory: 'all',
    });
  };

  const hasActiveFilters = 
    Boolean(filters.searchQuery) ||
    Boolean(filters.doctorName) ||
    Boolean(filters.roomNumber) ||
    (filters.status && filters.status !== 'all') ||
    (filters.bookedBy && filters.bookedBy !== 'all') ||
    Boolean(filters.dateFilter) ||
    !filters.onlyRunningDate ||
    (filters.roomCategory && filters.roomCategory !== 'all');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      {/* Search Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-teal-50/30 to-emerald-50/20 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Main Search Input */}
          <div className="flex-1">
            <label htmlFor="hospital-search-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>{isBn ? 'রুম বুকিং সার্চ সিস্টেম (Room Booking Search)' : 'Room Booking Search System'}</span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                {isBn ? 'রুম নম্বর, ডাক্তার বা রোগীর নাম' : 'room no, doctor or patient name'}
              </span>
            </label>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="hospital-search-input"
                type="text"
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder={
                  isBn 
                    ? 'রুম নম্বর (যেমন: 101, 202) বা ডাক্তারের নাম (যেমন: ডাঃ করিম) দিয়ে অনুসন্ধান করুন...' 
                    : 'Search by room number (e.g. 101, 202) or doctor name (e.g. Dr. Karim)...'
                }
                className="w-full pl-11 pr-10 py-2.5 bg-white text-sm text-slate-900 border border-slate-300 rounded-lg shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Running Date Toggle & Advanced Filters Trigger */}
          <div className="flex items-center gap-2 self-start lg:self-end flex-wrap">
            {/* Running Date (চলমান তারিখের বুকিং) Toggle Button */}
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, onlyRunningDate: !prev.onlyRunningDate }))}
              className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
                filters.onlyRunningDate
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? 'শুধু চলমান তারিখের বুকিং' : 'Running Date Only'}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filters.onlyRunningDate ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {filters.onlyRunningDate ? (isBn ? 'সক্রিয়' : 'ON') : (isBn ? 'বন্ধ' : 'OFF')}
              </span>
            </button>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                isAdvancedOpen || hasActiveFilters
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 text-teal-600" />
              <span>{isBn ? 'ফিল্টার সমূহ' : 'Filters'}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1.5 hover:bg-rose-50 rounded-md transition-colors"
              >
                {isBn ? 'ফিল্টার মুছুন' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Match Summary Bar if user is searching */}
        {filters.searchQuery && (
          <div className="mt-3 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isBn 
                  ? `অনুসন্ধান ফলাফল: ${filteredBookings.length} টি রেকর্ড পাওয়া গেছে` 
                  : `Search results: ${filteredBookings.length} records found`}
              </span>
            </span>
            <span className="text-emerald-700">
              {filters.searchQuery}
            </span>
          </div>
        )}
      </div>

      {/* Expandable Filter Grid */}
      {isAdvancedOpen && (
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Specific Doctor Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>{isBn ? 'ডাক্তারের নাম দিয়ে খুঁজুন' : 'Filter by Doctor'}</span>
            </label>
            <select
              value={filters.doctorName || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, doctorName: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="">{isBn ? 'সকল ডাক্তার' : 'All Doctors'}</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {isBn ? d.nameBn : d.name} ({d.department})
                </option>
              ))}
            </select>
          </div>

          {/* Specific Room Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <DoorClosed className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? 'নির্দিষ্ট রুম নম্বর' : 'Room Number'}</span>
            </label>
            <select
              value={filters.roomNumber || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, roomNumber: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="">{isBn ? 'সকল রুম' : 'All Rooms'}</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.roomNumber}>
                  {isBn ? `রুম ${r.roomNumber} - ${r.categoryBn}` : `Room ${r.roomNumber} - ${r.category}`} ({r.status})
                </option>
              ))}
            </select>
          </div>

          {/* Booked By Filter (Patient, AGM, DGM, AO) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isBn ? 'বুকিংকারীর ধরন (Booked By)' : 'Booked By Role'}</span>
            </label>
            <select
              value={filters.bookedBy || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, bookedBy: e.target.value as BookedByType | 'all' }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">{isBn ? 'সকল বুকিংকারী' : 'All Roles'}</option>
              {bookedByOptions.map((role) => (
                <option key={role} value={role}>
                  {role === 'Patient' ? (isBn ? 'রোগী নিজে (Patient)' : 'Patient') : `${role} (প্রশাসন)`}
                </option>
              ))}
            </select>
          </div>

          {/* Room Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'রুমের শ্রেণি/ক্যাটাগরি' : 'Room Category'}
            </label>
            <select
              value={filters.roomCategory || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, roomCategory: e.target.value as RoomCategory | 'all' }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">{isBn ? 'সকল শ্রেণি' : 'All Categories'}</option>
              {roomCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isBn ? 'বুকিংয়ের বর্তমান অবস্থা' : 'Booking Status'}
            </label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as BookingStatus | 'all' }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">{isBn ? 'সকল অবস্থা (All)' : 'All Statuses'}</option>
              <option value="waiting">{isBn ? '১. অপেক্ষমাণ তালিকা (Waiting)' : 'Waiting List'}</option>
              <option value="booking_in_progress">{isBn ? '২. রুম বুকিং প্রক্রিয়াধীন (In Progress)' : 'Booking In Progress'}</option>
              <option value="confirmed">{isBn ? '৩. চূড়ান্ত বরাদ্দ (Confirmed)' : 'Confirmed'}</option>
              <option value="discharged">{isBn ? '৪. ছাড়পত্র প্রাপ্ত (Discharged)' : 'Discharged'}</option>
              <option value="cancelled">{isBn ? '৫. বাতিলকৃত (Cancelled)' : 'Cancelled'}</option>
            </select>
          </div>

          {/* Specific Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? 'ভর্তির তারিখ' : 'Admission Date'}</span>
            </label>
            <input
              type="date"
              value={filters.dateFilter || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFilter: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
