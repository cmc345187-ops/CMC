import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  FileText, 
  Grid3X3, 
  Users, 
  RefreshCw, 
  ShieldCheck, 
  Languages,
  Calendar,
  Clock
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';
import { UserRole } from '../types/index.ts';

interface NavbarProps {
  onOpenAddPatient: () => void;
  onOpenDailyReport: () => void;
  onOpenRoomGrid: () => void;
  onOpenDirectory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddPatient,
  onOpenDailyReport,
  onOpenRoomGrid,
  onOpenDirectory,
}) => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    language, 
    setLanguage, 
    resetToDefaultData 
  } = useHospital();

  const isBn = language === 'bn';
  const todayDateFormatted = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const roles: { role: UserRole; labelBn: string; labelEn: string }[] = [
    { role: 'Admin', labelBn: 'অ্যাডমিন', labelEn: 'Admin' },
    { role: 'Director', labelBn: 'পরিচালক (MD)', labelEn: 'Director (MD)' },
    { role: 'Doctor', labelBn: 'ডাক্তার', labelEn: 'Doctor' },
    { role: 'AGM', labelBn: 'এজিএম (AGM)', labelEn: 'AGM' },
    { role: 'DGM', labelBn: 'ডিজিএম (DGM)', labelEn: 'DGM' },
    { role: 'AO', labelBn: 'এও (AO)', labelEn: 'AO' },
    { role: 'Staff', labelBn: 'স্টাফ / ফ্রন্টডেস্ক', labelEn: 'Staff' },
  ];

  const handleReset = () => {
    if (window.confirm(isBn ? 'আপনি কি প্রাথমিক ডেমো ডেটায় রিসেট করতে চান?' : 'Reset all data to default demo state?')) {
      resetToDefaultData();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with Hospital Info and Global Role Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-slate-100 gap-3">
          
          {/* Logo & Hospital Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {isBn ? 'হাসপাতালের রুম বুকিং ও অপেক্ষমাণ তালিকা ব্যবস্থাপনা' : 'Hospital Room Booking & Waiting List Management'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  {isBn ? 'সেন্ট্রাল সিস্টেম' : 'Central Live'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {todayDateFormatted}
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="hidden sm:flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {isBn ? 'চলমান দৈনিক শিফট' : 'Daily Running Shift'}
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Tools: Language, Role Switcher, Reset */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isBn ? 'en' : 'bn')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Languages className="w-3.5 h-3.5 text-slate-600" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Current Active Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isBn ? 'লগইন প্রোফাইল' : 'Current Role'}
                </span>
                <select
                  value={currentUser.role}
                  onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-semibold text-slate-800 cursor-pointer focus:outline-hidden"
                  aria-label="User Role"
                >
                  {roles.map((r) => (
                    <option key={r.role} value={r.role}>
                      {isBn ? r.labelBn : r.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title={isBn ? 'ডেমো ডেটা রিসেট করুন' : 'Reset demo data'}
              aria-label="Reset data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar & Fast Action Buttons */}
        <div className="flex items-center justify-between py-2.5 flex-wrap gap-2">
          {/* Quick Module Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={onOpenRoomGrid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all"
            >
              <Grid3X3 className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'রুম ও বেড ম্যাপ' : 'Room & Bed Map'}</span>
            </button>

            <button
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 hover:border-teal-300 rounded-lg transition-all"
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span>{isBn ? 'ডাক্তার ও পরিচালক ডিরেক্টরি' : 'Doctors & Directors'}</span>
            </button>

            <button
              onClick={onOpenDailyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all shadow-2xs"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{isBn ? 'দৈনিক রিপোর্ট ও PDF প্রিন্ট' : 'Daily Report & PDF'}</span>
            </button>
          </div>

          {/* Primary CTA: Add Patient to Waiting List */}
          <button
            onClick={onOpenAddPatient}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? '+ অপেক্ষমাণ তালিকায় রোগী যোগ' : '+ Add Patient to Waiting List'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
