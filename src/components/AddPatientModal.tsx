import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Calendar, 
  Clock, 
  Stethoscope, 
  Building2, 
  Phone, 
  User, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { BookedByType, RoomCategory } from '../types/index.ts';
import { getTodayDateString } from '../utils/bookingLogic.ts';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose }) => {
  const { doctors, directors, addToWaitingList, language } = useHospital();
  const isBn = language === 'bn';

  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [admissionDate, setAdmissionDate] = useState(getTodayDateString());
  const [admissionTime, setAdmissionTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [directorId, setDirectorId] = useState<string>('');
  const [bookedBy, setBookedBy] = useState<BookedByType>('Patient');
  const [roomCategoryPreference, setRoomCategoryPreference] = useState<RoomCategory>('Deluxe Cabin');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'vip'>('normal');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    if (!patientName.trim()) {
      setError(isBn ? 'অনুগ্রহ করে রোগীর নাম প্রদান করুন।' : 'Please enter patient name.');
      return;
    }
    if (!contactNumber.trim()) {
      setError(isBn ? 'অনুগ্রহ করে যোগাযোগের মোবাইল নম্বর প্রদান করুন।' : 'Please enter contact phone number.');
      return;
    }
    if (!doctorId) {
      setError(isBn ? 'অনুগ্রহ করে চিকিৎসক নির্বাচন করুন।' : 'Please select attending doctor.');
      return;
    }

    addToWaitingList({
      patientName: patientName.trim(),
      contactNumber: contactNumber.trim(),
      age: age ? Number(age) : undefined,
      gender,
      admissionDate,
      admissionTime,
      doctorId,
      directorId: directorId ? directorId : undefined,
      bookedBy,
      roomCategoryPreference,
      priority,
      notes: notes.trim(),
    });

    // Reset and close
    setPatientName('');
    setContactNumber('');
    setAge(undefined);
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15">
              <UserPlus className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? 'অপেক্ষমাণ তালিকায় নতুন রোগী যোগ করুন' : 'Add Patient to Waiting List'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isBn ? 'হাসপাতালে ভর্তি হওয়া রোগীর তথ্য ও রুমের চাহিদা এন্ট্রি' : 'Patient admission and cabin requirement entry'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'রোগীর পুরো নাম *' : 'Patient Full Name *'}
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  setError('');
                }}
                placeholder={isBn ? 'যেমন: মোঃ আব্দুল করিম' : 'e.g. Md. Abdul Karim'}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'মোবাইল নম্বর *' : 'Contact Phone Number *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'বয়স' : 'Age'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age ?? ''}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={isBn ? 'যেমন: ৪৫' : 'e.g. 45'}
                  className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'লিঙ্গ' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Male">{isBn ? 'পুরুষ' : 'Male'}</option>
                  <option value="Female">{isBn ? 'নারী' : 'Female'}</option>
                  <option value="Other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admission Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'ভর্তির তারিখ' : 'Admission Date'}</span>
              </label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{isBn ? 'ভর্তির সময়' : 'Admission Time'}</span>
              </label>
              <input
                type="time"
                value={admissionTime}
                onChange={(e) => setAdmissionTime(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Doctor Selection (from Auto Directory) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isBn ? 'চিকিৎসকের নাম (Doctor) *' : 'Attending Doctor *'}</span>
                </span>
                <span className="text-[10px] text-teal-600 font-normal">
                  {isBn ? 'স্বয়ংক্রিয় API ডিরেক্টরি' : 'Auto Directory'}
                </span>
              </label>
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isBn ? d.nameBn : d.name} — {d.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Director Recommendation Selection (from Auto Directory) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isBn ? 'সুপারিশকারী পরিচালক (ঐচ্ছিক)' : 'Director Reference (Optional)'}</span>
                </span>
                <span className="text-[10px] text-indigo-600 font-normal">
                  {isBn ? 'বোর্ড তালিকা' : 'Director Board'}
                </span>
              </label>
              <select
                value={directorId}
                onChange={(e) => setDirectorId(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value="">{isBn ? '-- কোনো বিশেষ সুপারিশ নেই --' : '-- None / General --'}</option>
                {directors.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {isBn ? dir.nameBn : dir.name} ({dir.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Booked By Role: Patient, AGM, DGM, AO (Explicitly Required by User) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'বুকিংকারী ব্যক্তির ধরন (Booked By Role) *' : 'Booked By Role Option *'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Patient', 'AGM', 'DGM', 'AO'] as BookedByType[]).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer font-bold text-xs transition-all ${
                    bookedBy === role
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="bookedBy"
                    value={role}
                    checked={bookedBy === role}
                    onChange={() => setBookedBy(role)}
                    className="sr-only"
                  />
                  <span>
                    {role === 'Patient' ? (isBn ? 'Patient (রোগী)' : 'Patient') : role}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {isBn 
                ? 'পরিচালক বা প্রশাসনিক কর্মকর্তাদের (AGM, DGM, AO) মাধ্যমে আসা বুকিং চিহ্নিত করতে ভূমিকা নির্বাচন করুন।'
                : 'Select role to track administrative references (AGM, DGM, AO) or self-booked patients.'}
            </p>
          </div>

          {/* Room Category Preference & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isBn ? 'চাহিদা অনুযায়ী রুমের ক্যাটাগরি' : 'Room Category Preference'}
              </label>
              <select
                value={roomCategoryPreference}
                onChange={(e) => setRoomCategoryPreference(e.target.value as RoomCategory)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                {roomCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isBn ? 'অগ্রাধিকার (Priority)' : 'Priority'}</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value="normal">{isBn ? 'সাধারণ (Normal)' : 'Normal'}</option>
                <option value="urgent">{isBn ? 'জরুরি (Urgent)' : 'Urgent'}</option>
                <option value="vip">{isBn ? 'ভিআইপি / বিশেষ সুপারিশ (VIP)' : 'VIP Recommendation'}</option>
              </select>
            </div>
          </div>

          {/* Notes / Special Clinical Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'বিশেষ মন্তব্য বা চিকিৎসার বিবরণ (ঐচ্ছিক)' : 'Clinical Notes / Instructions (Optional)'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBn ? 'যেমন: সার্জারি প্রস্তুতি, নিচতলায় কেবিন প্রয়োজন...' : 'e.g. Pre-op prep, floor preference...'}
              className="w-full text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {isBn ? 'অপেক্ষমাণ তালিকায় যুক্ত করুন' : 'Add to Waiting List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
