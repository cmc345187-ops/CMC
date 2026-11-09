import React, { useState } from 'react';
import { 
  X, 
  Grid3X3, 
  DoorClosed, 
  DoorOpen, 
  Wrench, 
  User, 
  Stethoscope, 
  Clock, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { Room, RoomStatus } from '../types/index.ts';

interface RoomGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoomForAllocation?: (roomNumber: string) => void;
}

export const RoomGridModal: React.FC<RoomGridModalProps> = ({
  isOpen,
  onClose,
  onSelectRoomForAllocation,
}) => {
  const { rooms, bookings, language } = useHospital();
  const isBn = language === 'bn';

  const [activeFloor, setActiveFloor] = useState<number | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  if (!isOpen) return null;

  const floors = [1, 2, 3, 4];

  const filteredRooms = rooms.filter((r) => {
    if (activeFloor !== 'all' && r.floor !== activeFloor) return false;
    return true;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500';
      case 'allocated':
        return 'border-sky-300 bg-sky-50 text-sky-800 hover:border-sky-500';
      case 'occupied':
        return 'border-indigo-300 bg-indigo-50 text-indigo-800 hover:border-indigo-500';
      case 'maintenance':
        return 'border-slate-300 bg-slate-100 text-slate-600 hover:border-slate-400';
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <DoorOpen className="w-3 h-3 text-emerald-600" />
            <span>{isBn ? 'খালি (Available)' : 'Available'}</span>
          </span>
        );
      case 'allocated':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            <span>{isBn ? 'বরাদ্দ প্রক্রিয়াধীন' : 'Allocated'}</span>
          </span>
        );
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            <span>{isBn ? 'দখলকৃত / রোগী ভর্তি' : 'Occupied'}</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            <Wrench className="w-3 h-3 text-slate-500" />
            <span>{isBn ? 'মেরামত / পরিচ্ছন্নতা' : 'Maintenance'}</span>
          </span>
        );
    }
  };

  const currentBooking = selectedRoom?.currentBookingId 
    ? bookings.find((b) => b.id === selectedRoom.currentBookingId || b.assignedRoomNumber === selectedRoom.roomNumber)
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15">
              <Grid3X3 className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? 'হাসপাতালের রুম ও বেড ম্যাপ (Live Room Bed Grid)' : 'Hospital Live Room & Bed Map'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isBn ? 'সকল তলার রুমের বর্তমান অবস্থা ও রোগী তথ্যের রিয়েল-টাইম দৃশ্য' : 'Floor-by-floor real-time room occupancy and details'}
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

        {/* Floor Switcher & Legend */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Floor tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveFloor('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFloor === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isBn ? 'সকল তলা' : 'All Floors'}
            </button>
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => setActiveFloor(floor)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeFloor === floor
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {floor === 4 
                  ? (isBn ? '৪র্থ তলা (ICU / CCU)' : 'Floor 4 (ICU/CCU)') 
                  : (isBn ? `${floor}ম তলা` : `Floor ${floor}`)}
              </button>
            ))}
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
              {isBn ? 'খালি (Available)' : 'Available'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-500"></span>
              {isBn ? 'প্রক্রিয়াধীন' : 'In Progress'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600"></span>
              {isBn ? 'দখলকৃত (Occupied)' : 'Occupied'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-400"></span>
              {isBn ? 'মেরামত' : 'Maintenance'}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Rooms Grid */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredRooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${getStatusColor(room.status)} ${
                    isSelected ? 'ring-2 ring-emerald-500 shadow-md' : 'shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-black tracking-tight">
                      {isBn ? `রুম ${room.roomNumber}` : `Room ${room.roomNumber}`}
                    </span>
                    <span className="text-[10px] font-semibold opacity-75">
                      {isBn ? `${room.floor}ম তলা` : `Fl ${room.floor}`}
                    </span>
                  </div>

                  <div className="text-xs font-bold truncate">
                    {isBn ? room.categoryBn : room.category}
                  </div>

                  <div className="text-[11px] opacity-80 mt-1">
                    ৳{room.ratePerDay.toLocaleString()} {isBn ? '/দিন' : '/day'}
                  </div>

                  {room.patientName && (
                    <div className="mt-2 pt-2 border-t border-black/10 text-xs font-semibold truncate flex items-center gap-1">
                      <User className="w-3 h-3 shrink-0" />
                      <span>{room.patientName}</span>
                    </div>
                  )}

                  <div className="mt-2">
                    {getStatusBadge(room.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Room Details Sidebar */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            {selectedRoom ? (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {isBn ? 'রুমের তথ্য' : 'Room Details'}
                    </span>
                    {getStatusBadge(selectedRoom.status)}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    {isBn ? `রুম ${selectedRoom.roomNumber}` : `Room ${selectedRoom.roomNumber}`}
                  </h4>
                  <p className="text-xs font-bold text-slate-700">
                    {isBn ? selectedRoom.categoryBn : selectedRoom.category} • {isBn ? `${selectedRoom.floor}ম তলা` : `Floor ${selectedRoom.floor}`}
                  </p>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">
                    ৳{selectedRoom.ratePerDay.toLocaleString()} {isBn ? 'প্রতি দিন' : 'per day'}
                  </p>
                </div>

                {/* Features */}
                {selectedRoom.features && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      {isBn ? 'সুযোগ-সুবিধা' : 'Features'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoom.features.map((f, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Patient info if booked/occupied */}
                {currentBooking ? (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      {isBn ? 'ভর্তি রোগীর বিবরণ' : 'Admitted Patient Info'}
                    </span>
                    <div className="font-bold text-slate-900 text-sm">{currentBooking.patientName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{currentBooking.patientId}</div>
                    <div className="text-slate-700 flex items-center gap-1 pt-1 border-t border-slate-100">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>{currentBooking.doctorName}</span>
                    </div>
                    {currentBooking.directorName && (
                      <div className="text-slate-600 text-[11px]">
                        {isBn ? 'সুপারিশ:' : 'Director:'} {currentBooking.directorName}
                      </div>
                    )}
                    <div className="text-slate-500 text-[11px]">
                      {isBn ? 'ভর্তির তারিখ:' : 'Admission:'} {currentBooking.admissionDate} ({currentBooking.admissionTime})
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                    {isBn 
                      ? 'এই রুমটি বর্তমানে সম্পূর্ণ খালি এবং নতুন রোগীর জন্য বরাদ্দ উপযোগী।' 
                      : 'This room is vacant and ready for new patient allocation.'}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <DoorClosed className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">
                  {isBn ? 'বিস্তারিত দেখতে যেকোনো রুমে ক্লিক করুন' : 'Click on any room to inspect details'}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
