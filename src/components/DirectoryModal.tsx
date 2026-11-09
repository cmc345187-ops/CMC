import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Stethoscope, 
  Building2, 
  Plus, 
  Phone, 
  Check, 
  Search,
  ShieldCheck
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { Doctor, Director } from '../types/index.ts';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({ isOpen, onClose }) => {
  const { doctors, directors, addDoctor, addDirector, language } = useHospital();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'doctors' | 'directors'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Doctor Form State
  const [docName, setDocName] = useState('');
  const [docNameBn, setDocNameBn] = useState('');
  const [docDept, setDocDept] = useState('');
  const [docDesignation, setDocDesignation] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docRoomNo, setDocRoomNo] = useState('');

  // New Director Form State
  const [dirName, setDirName] = useState('');
  const [dirNameBn, setDirNameBn] = useState('');
  const [dirDesignation, setDirDesignation] = useState('');
  const [dirDept, setDirDept] = useState('');
  const [dirPhone, setDirPhone] = useState('');

  if (!isOpen) return null;

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameBn.includes(searchQuery) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDirectors = directors.filter(
    (dir) =>
      dir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.nameBn.includes(searchQuery) ||
      dir.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDoctor({
      name: docName.trim(),
      nameBn: docNameBn.trim() || docName.trim(),
      department: docDept.trim() || 'General Medicine',
      departmentBn: docDept.trim() || 'জেনারেল মেডিসিন',
      designation: docDesignation.trim() || 'Consultant',
      designationBn: docDesignation.trim() || 'কনসালটেন্ট',
      phone: docPhone.trim() || '+880 1700-000000',
      roomNo: docRoomNo.trim() || 'OPD-101',
    });

    setDocName('');
    setDocNameBn('');
    setDocDept('');
    setDocDesignation('');
    setDocPhone('');
    setDocRoomNo('');
    setIsAddingNew(false);
  };

  const handleAddDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirName.trim()) return;

    addDirector({
      name: dirName.trim(),
      nameBn: dirNameBn.trim() || dirName.trim(),
      designation: dirDesignation.trim() || 'Director',
      designationBn: dirDesignation.trim() || 'পরিচালক',
      department: dirDept.trim() || 'Hospital Directorate',
      phone: dirPhone.trim() || '+880 1700-000000',
    });

    setDirName('');
    setDirNameBn('');
    setDirDesignation('');
    setDirDept('');
    setDirPhone('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/15">
              <Users className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? 'স্বয়ংক্রিয় তথ্য সংযুক্তি ডিরেক্টরি (Auto API Registry)' : 'Doctor & Director Auto Directory'}
              </h3>
              <p className="text-xs text-teal-100">
                {isBn ? 'ডাক্তার ও পরিচালকদের তালিকা সরাসরি বুকিং ফর্মে সংযুক্ত' : 'Standard registry for seamless selection and auto-population'}
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

        {/* Tab switcher & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('doctors');
                setIsAddingNew(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'doctors'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{isBn ? `ডাক্তারদের তালিকা (${doctors.length})` : `Doctors (${doctors.length})`}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('directors');
                setIsAddingNew(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'directors'
                  ? 'bg-indigo-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isBn ? `পরিচালক ও প্রশাসন (${directors.length})` : `Directors & Admin (${directors.length})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম বা বিভাগ দিয়ে খুঁজুন...' : 'Search directory...'}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors flex items-center gap-1 border border-teal-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন যোগ' : 'Add New'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Add New Doctor / Director Form */}
          {isAddingNew && (
            <div className="p-4 bg-slate-50 border border-teal-200 rounded-xl mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                {activeTab === 'doctors'
                  ? (isBn ? '+ নতুন ডাক্তার তথ্য যোগ করুন' : '+ Register New Doctor')
                  : (isBn ? '+ নতুন পরিচালক বা কর্মকর্তা যোগ করুন' : '+ Register New Director / Admin')}
              </h4>

              {activeTab === 'doctors' ? (
                <form onSubmit={handleAddDoctorSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'ডাক্তারের নাম (English) *' : 'Doctor Name (English) *'}
                    </label>
                    <input
                      required
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Prof. Dr. Kamal Ahmed"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'ডাক্তারের নাম (বাংলা)' : 'Doctor Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={docNameBn}
                      onChange={(e) => setDocNameBn(e.target.value)}
                      placeholder="যেমন: অধ্যাপক ডাঃ কামাল আহমেদ"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'চিকিৎসা বিভাগ' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={docDept}
                      onChange={(e) => setDocDept(e.target.value)}
                      placeholder="e.g. Cardiology"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'পদবি (Designation)' : 'Designation'}
                    </label>
                    <input
                      type="text"
                      value={docDesignation}
                      onChange={(e) => setDocDesignation(e.target.value)}
                      placeholder="e.g. Senior Consultant"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'ফোন নম্বর' : 'Phone'}
                    </label>
                    <input
                      type="text"
                      value={docPhone}
                      onChange={(e) => setDocPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'ওপিডি চেম্বার / রুম নং' : 'Chamber / Room No'}
                    </label>
                    <input
                      type="text"
                      value={docRoomNo}
                      onChange={(e) => setDocRoomNo(e.target.value)}
                      placeholder="e.g. OPD-305"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-700 text-white font-bold rounded-lg shadow-2xs"
                    >
                      {isBn ? 'সংরক্ষণ করুন' : 'Save Doctor'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddDirectorSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'পরিচালকের নাম (English) *' : 'Director Name *'}
                    </label>
                    <input
                      required
                      type="text"
                      value={dirName}
                      onChange={(e) => setDirName(e.target.value)}
                      placeholder="e.g. Dr. A. K. Azad"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'পরিচালকের নাম (বাংলা)' : 'Director Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={dirNameBn}
                      onChange={(e) => setDirNameBn(e.target.value)}
                      placeholder="যেমন: ডাঃ এ. কে. আজাদ"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'পদবি (Designation)' : 'Designation'}
                    </label>
                    <input
                      type="text"
                      value={dirDesignation}
                      onChange={(e) => setDirDesignation(e.target.value)}
                      placeholder="e.g. Managing Director (MD)"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'ফোন নম্বর' : 'Phone'}
                    </label>
                    <input
                      type="text"
                      value={dirPhone}
                      onChange={(e) => setDirPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-700 text-white font-bold rounded-lg shadow-2xs"
                    >
                      {isBn ? 'সংরক্ষণ করুন' : 'Save Director'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* List of Registered Entities */}
          {activeTab === 'doctors' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{doc.name}</h5>
                      <p className="text-xs text-teal-800 font-semibold">{doc.nameBn}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-bold border border-teal-200">
                      {doc.roomNo}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                    <p className="font-medium text-slate-700">{doc.department} ({doc.designation})</p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Phone className="w-3 h-3" />
                      <span>{doc.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDirectors.map((dir) => (
                <div
                  key={dir.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{dir.name}</h5>
                      <p className="text-xs text-indigo-800 font-semibold">{dir.nameBn}</p>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold border border-indigo-200">
                      {dir.designation.split(' ')[0]}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                    <p className="font-medium text-slate-700">{dir.designation}</p>
                    <p className="text-slate-500 text-[11px]">{dir.department}</p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Phone className="w-3 h-3" />
                      <span>{dir.phone}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
