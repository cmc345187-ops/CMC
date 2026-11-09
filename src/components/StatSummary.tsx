import React from 'react';
import { 
  DoorOpen, 
  Hourglass, 
  Clock, 
  CheckCircle, 
  Activity, 
  Users 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext.tsx';

export const StatSummary: React.FC = () => {
  const { stats, language } = useHospital();
  const isBn = language === 'bn';

  const cards = [
    {
      titleBn: 'খালি রুম',
      titleEn: 'Available Rooms',
      value: stats.availableRooms,
      subBn: `মোট ${stats.totalRooms} টি রুমের মধ্যে`,
      subEn: `out of ${stats.totalRooms} total rooms`,
      icon: DoorOpen,
      color: 'emerald',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      badge: `${100 - stats.occupancyRate}% খালি`,
    },
    {
      titleBn: '১. অপেক্ষমাণ তালিকা',
      titleEn: '1. Waiting List',
      value: stats.waitingCount,
      subBn: 'রুম বরাদ্দের অপেক্ষায়',
      subEn: 'Awaiting room allocation',
      icon: Hourglass,
      color: 'amber',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      badge: isBn ? 'অগ্রাধিকার ভিত্তি' : 'Priority Queue',
    },
    {
      titleBn: '২. রুম বুকিং প্রক্রিয়াধীন',
      titleEn: '2. Booking In Progress',
      value: stats.bookingInProgressCount,
      subBn: 'রুম বরাদ্দকৃত, নিশ্চায়ন বাকি',
      subEn: 'Room assigned, pending confirm',
      icon: Clock,
      color: 'sky',
      bgGradient: 'from-sky-500/10 to-blue-500/10',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-700',
      badge: isBn ? 'প্রক্রিয়াধীন' : 'Pending Action',
    },
    {
      titleBn: '৩. চূড়ান্ত বরাদ্দ',
      titleEn: '3. Confirmed Bookings',
      value: stats.confirmedCount,
      subBn: 'সক্রিয়ভাবে চিকিৎসাধীন রোগী',
      subEn: 'Active admitted patients',
      icon: CheckCircle,
      color: 'indigo',
      bgGradient: 'from-indigo-500/10 to-violet-500/10',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      badge: isBn ? 'নিশ্চিতকৃত' : 'Confirmed',
    },
    {
      titleBn: 'চলমান তারিখের বুকিং',
      titleEn: 'Running Date Activity',
      value: stats.runningDateBookings,
      subBn: 'আজকের সক্রিয় রোগী ও বরাদ্দ',
      subEn: "Today's active admissions",
      icon: Activity,
      color: 'teal',
      bgGradient: 'from-teal-500/10 to-emerald-500/10',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      badge: `${stats.occupancyRate}% দখল`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-xl bg-white border ${c.borderColor} shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2 rounded-lg bg-gradient-to-br ${c.bgGradient} ${c.textColor}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {c.badge}
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {c.value}
            </div>

            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {isBn ? c.titleBn : c.titleEn}
            </div>

            <div className="text-[11px] text-slate-500 truncate mt-0.5">
              {isBn ? c.subBn : c.subEn}
            </div>
          </div>
        );
      })}
    </div>
  );
};
