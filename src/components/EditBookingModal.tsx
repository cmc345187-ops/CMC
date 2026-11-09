import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Phone, 
  User, 
  Stethoscope, 
  Building2, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { PatientBooking, RoomCategory } from '../types/index.ts';
import { useHospital } from '../context/HospitalContext.tsx';

interface EditBookingModalProps {
  booking: PatientBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditBookingModal: React.FC<EditBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { doctors, directors, updateBooking, language } = useHospital();
  const isBn = language === 'bn';

  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [doctorId, setDoctorId] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [priority, setPriority] = useState<PatientBooking['priority']>('normal');
  const [roomCategoryPreference, setRoomCategoryPreference] = useState<RoomCategory>('Deluxe Cabin');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (booking) {
      setPatientName(booking.patientName);
      setContactNumber(booking.contactNumber);
      setAge(booking.age);
      setDoctorId(booking.doctorId);
      setDirectorId(booking.directorId || '');
      setPriority(booking.priority);
      setRoomCategoryPreference(booking.roomCategoryPreference);
      setNotes(booking.notes || '');
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const roomCategories: RoomCategory[] = [
    'VIP Cabin', 
    'Deluxe Cabin', 
    'AC Cabin', 
    'Non-AC Cabin', 
    'General Ward', 
    'ICU', 
    'CCU'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];
    const dir = directors.find((d) => d.id === directorId);

    updateBooking(booking.id, {
      patientName: patientName.trim(),
      contactNumber: contactNumber.trim(),
      age: age ? Number(age) : undefined,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorDepartment: doc.department,
      directorId: dir?.id,
      directorName: dir?.name,
      priority,
      roomCategoryPreference,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10">
              <Edit3 className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h3 className="text-base font-bold">
                {isBn ? 'রোগী ও বুকিং তথ্য সংশোধন' : 'Edit Booking Details'}
              </h3>
              <p className="text-xs text-slate-300">
                {booking.patientId} • {booking.assignedRoomNumber ? `রুম ${booking.assignedRoomNumber}` : 'অপেক্ষমাণ'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'রোগীর পুরো নাম *' : 'Patient Name *'}
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'মোবাইল নম্বর' : 'Phone'}
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'বয়স' : 'Age'}
              </label>
              <input
                type="number"
                value={age ?? ''}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'চিকিৎসক' : 'Attending Doctor'}
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {isBn ? d.nameBn : d.name} ({d.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'সুপারিশকারী পরিচালক' : 'Director Reference'}
            </label>
            <select
              value={directorId}
              onChange={(e) => setDirectorId(e.target.value)}
              className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">{isBn ? '-- কোনো বিশেষ সুপারিশ নেই --' : '-- None --'}</option>
              {directors.map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {isBn ? dir.nameBn : dir.name} ({dir.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <select
                value={roomCategoryPreference}
                onChange={(e) => setRoomCategoryPreference(e.target.value as any)}
                className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                {roomCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isBn ? 'অগ্রাধিকার' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="normal">{isBn ? 'সাধারণ' : 'Normal'}</option>
                <option value="urgent">{isBn ? 'জরুরি' : 'Urgent'}</option>
                <option value="vip">{isBn ? 'ভিআইপি' : 'VIP'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isBn ? 'চিকিৎসা বা বুকিং মন্তব্য' : 'Clinical Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
            >
              {isBn ? 'তথ্য সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
