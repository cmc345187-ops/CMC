import React, { useState } from 'react';
import { 
  X, 
  Bed, 
  DoorClosed, 
  Check, 
  Filter, 
  Layers, 
  Sparkles, 
  User, 
  Stethoscope,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { PatientBooking, Room, RoomCategory } from '../types/index.ts';

interface AssignRoomModalProps {
  booking: PatientBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignRoomModal: React.FC<AssignRoomModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { rooms, assignRoom, language } = useHospital();
  const isBn = language === 'bn';

  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RoomCategory | 'all'>('all');

  if (!isOpen || !booking) return null;

  // Filter available rooms (and also show currently assigned room if modifying)
  const availableRooms = rooms.filter(
    (r) => r.status === 'available' || r.roomNumber === booking.assignedRoomNumber
  );

  const filteredRooms = availableRooms.filter((r) => {
    if (floorFilter !== 'all' && r.floor !== floorFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const handleConfirmAssignment = () => {
    if (!selectedRoomNumber) return;
    assignRoom(booking.id, selectedRoomNumber);
    setSelectedRoomNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15">
              <Bed className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? 'রোগীর জন্য রুম নম্বর প্রদান করুন' : 'Assign Room Number to Patient'}
              </h3>
              <p className="text-xs text-amber-100">
                {isBn 
                  ? 'অপেক্ষমাণ তালিকা থেকে রুম নম্বর প্রদান করে বুকিং তালিকায় স্থানান্তর' 
                  : 'Allocate an available room and advance to booking in progress'}
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

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Patient Details Snapshot Banner */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                  {booking.patientId}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {booking.patientName}
                </h4>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  {booking.doctorName}
                </span>
                <span>•</span>
                <span>{isBn ? 'বুকিংকারী:' : 'Booked By:'} <strong>{booking.bookedBy}</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">
                {isBn ? 'পছন্দের ক্যাটাগরি:' : 'Category Request:'}
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-md inline-block mt-0.5">
                {booking.roomCategoryPreference}
              </span>
            </div>
          </div>

          {/* Room Selection Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-slate-100 pb-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <DoorClosed className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'খালি রুম নির্বাচন করুন' : 'Select Available Room'}</span>
              <span className="text-[11px] font-normal text-slate-500">
                ({filteredRooms.length} {isBn ? 'টি রুম উপলব্ধ' : 'available'})
              </span>
            </h5>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Floor Filter */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500">{isBn ? 'তলা:' : 'Floor:'}</span>
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">{isBn ? 'সকল তলা' : 'All Floors'}</option>
                  <option value={1}>{isBn ? '১ম তলা' : '1st Floor'}</option>
                  <option value={2}>{isBn ? '২য় তলা' : '2nd Floor'}</option>
                  <option value={3}>{isBn ? '৩য় তলা' : '3rd Floor'}</option>
                  <option value={4}>{isBn ? '৪র্থ তলা (ICU)' : '4th Floor (ICU)'}</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500">{isBn ? 'শ্রেণি:' : 'Category:'}</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">{isBn ? 'সকল শ্রেণি' : 'All Categories'}</option>
                  <option value="VIP Cabin">VIP Cabin</option>
                  <option value="Deluxe Cabin">Deluxe Cabin</option>
                  <option value="AC Cabin">AC Cabin</option>
                  <option value="Non-AC Cabin">Non-AC Cabin</option>
                  <option value="General Ward">General Ward</option>
                  <option value="ICU">ICU</option>
                  <option value="CCU">CCU</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          {filteredRooms.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
              <DoorClosed className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-slate-700">
                {isBn ? 'এই ফিল্টারে কোনো খালি রুম পাওয়া যায়নি।' : 'No available rooms found for the selected filter.'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'অনুগ্রহ করে অন্য তলা বা শ্রেণি নির্বাচন করুন।' : 'Please adjust floor or category filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredRooms.map((room) => {
                const isSelected = selectedRoomNumber === room.roomNumber;
                const isMatchPreference = room.category === booking.roomCategoryPreference;

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomNumber(room.roomNumber)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500'
                        : isMatchPreference
                        ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <DoorClosed className="w-4 h-4 text-emerald-600" />
                          <span>{isBn ? `রুম ${room.roomNumber}` : `Room ${room.roomNumber}`}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {isBn ? `${room.floor}ম তলা` : `Floor ${room.floor}`}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800">
                        {isBn ? room.categoryBn : room.category}
                      </div>

                      <div className="text-[11px] text-emerald-700 font-bold mt-1">
                        ৳{room.ratePerDay.toLocaleString()} {isBn ? '/দিন' : '/day'}
                      </div>

                      {isMatchPreference && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-sm">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{isBn ? 'রোগীর পছন্দের শ্রেণি' : 'Matches Preference'}</span>
                        </div>
                      )}

                      {room.features && room.features.length > 0 && (
                        <div className="text-[10px] text-slate-500 mt-2 line-clamp-1">
                          {room.features.slice(0, 3).join(' • ')}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {isBn ? 'খালি আছে' : 'Available'}
                      </span>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'border-slate-300 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              {selectedRoomNumber ? (
                <span className="font-semibold text-slate-900">
                  {isBn ? `নির্বাচিত রুম: ${selectedRoomNumber}` : `Selected Room: ${selectedRoomNumber}`}
                </span>
              ) : (
                <span>{isBn ? 'তালিকা থেকে একটি রুম নির্বাচন করুন।' : 'Select a room to proceed.'}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={!selectedRoomNumber}
                onClick={handleConfirmAssignment}
                className={`px-5 py-2 text-xs sm:text-sm font-bold text-white rounded-lg shadow-sm transition-all ${
                  selectedRoomNumber
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20 active:scale-98'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                {isBn ? 'রুম বরাদ্দ নিশ্চিত করুন' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
