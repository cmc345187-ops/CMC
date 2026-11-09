import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  PatientBooking, 
  Room, 
  Doctor, 
  Director, 
  UserRole, 
  FilterCriteria,
  BookedByType
} from '../types/index.ts';
import { 
  INITIAL_BOOKINGS, 
  INITIAL_ROOMS, 
  INITIAL_DOCTORS, 
  INITIAL_DIRECTORS 
} from '../data/seedData.ts';
import {
  filterBookings,
  assignRoomToPatient,
  confirmPatientBooking,
  cancelPatientBooking,
  dischargePatientBooking,
  getHospitalStatistics,
  getCurrentTimestamp,
  getTodayDateString,
} from '../utils/bookingLogic.ts';

interface HospitalContextType {
  bookings: PatientBooking[];
  rooms: Room[];
  doctors: Doctor[];
  directors: Director[];
  currentUser: {
    role: UserRole;
    name: string;
    designation: string;
  };
  setCurrentUserRole: (role: UserRole) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  filters: FilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  filteredBookings: PatientBooking[];
  stats: ReturnType<typeof getHospitalStatistics>;
  
  // Actions
  addToWaitingList: (patientData: {
    patientName: string;
    contactNumber: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    admissionDate?: string;
    admissionTime?: string;
    doctorId: string;
    directorId?: string;
    bookedBy: BookedByType;
    roomCategoryPreference: PatientBooking['roomCategoryPreference'];
    priority: PatientBooking['priority'];
    notes?: string;
  }) => PatientBooking;

  assignRoom: (bookingId: string, roomNumber: string) => void;
  confirmBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string, reason: string) => void;
  dischargePatient: (bookingId: string) => void;
  updateBooking: (bookingId: string, updateData: Partial<PatientBooking>) => void;
  
  // Auto API Directory Actions
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addDirector: (director: Omit<Director, 'id'>) => void;
  
  // Persistence Utilities
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY_BOOKINGS = 'hospital_room_system_bookings_v2';
const STORAGE_KEY_ROOMS = 'hospital_room_system_rooms_v2';
const STORAGE_KEY_DOCTORS = 'hospital_room_system_doctors_v2';
const STORAGE_KEY_DIRECTORS = 'hospital_room_system_directors_v2';
const STORAGE_KEY_LANG = 'hospital_room_system_lang_v2';

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<'bn' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return (saved === 'en' || saved === 'bn') ? saved : 'bn';
    } catch {
      return 'bn';
    }
  });

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // ignore
    }
  };

  // 2. Multi-role user state
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string; designation: string }>({
    role: 'Admin',
    name: 'ডাঃ এ. কে. আজাদ (ব্যবস্থাপনা পরিচালক ও অ্যাডমিন)',
    designation: 'Managing Director & Hospital Super Admin',
  });

  const setCurrentUserRole = (role: UserRole) => {
    switch (role) {
      case 'Director':
        setCurrentUser({ role, name: 'Dr. A. K. Azad', designation: 'Managing Director (MD)' });
        break;
      case 'Doctor':
        setCurrentUser({ role, name: 'Prof. Dr. M. A. Karim', designation: 'HOD - Cardiology' });
        break;
      case 'AGM':
        setCurrentUser({ role, name: 'Md. Rafiqul Alam', designation: 'AGM (Administration)' });
        break;
      case 'DGM':
        setCurrentUser({ role, name: 'Engr. Kazi Mahbub', designation: 'DGM (Operations)' });
        break;
      case 'AO':
        setCurrentUser({ role, name: 'Mohammad Jahangir Kabir', designation: 'Administrative Officer (AO)' });
        break;
      case 'Staff':
        setCurrentUser({ role, name: 'Admission Desk Staff', designation: 'Front Desk Operator' });
        break;
      case 'Admin':
      default:
        setCurrentUser({ role: 'Admin', name: 'System Administrator', designation: 'Central Hospital Admin' });
        break;
    }
  };

  // 3. Persistent Entities
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCTORS);
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [directors, setDirectors] = useState<Director[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIRECTORS);
      return saved ? JSON.parse(saved) : INITIAL_DIRECTORS;
    } catch {
      return INITIAL_DIRECTORS;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [bookings, setBookings] = useState<PatientBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed saving bookings to localStorage', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.warn('Failed saving rooms to localStorage', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.warn('Failed saving doctors to localStorage', e);
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DIRECTORS, JSON.stringify(directors));
    } catch (e) {
      console.warn('Failed saving directors to localStorage', e);
    }
  }, [directors]);

  // 4. Filtering State
  const [filters, setFilters] = useState<FilterCriteria>({
    searchQuery: '',
    doctorName: '',
    roomNumber: '',
    status: 'all',
    bookedBy: 'all',
    dateFilter: '',
    onlyRunningDate: true, // Default to true as specified: "শুধু চলমান (Running) তারিখের বুকিং প্রদর্শিত হবে" with toggle
    roomCategory: 'all',
  });

  // Filtered list
  const filteredBookings = useMemo(() => {
    return filterBookings(bookings, filters, getTodayDateString());
  }, [bookings, filters]);

  // Summary statistics
  const stats = useMemo(() => {
    return getHospitalStatistics(bookings, rooms, getTodayDateString());
  }, [bookings, rooms]);

  // --- ACTIONS ---

  const addToWaitingList = (patientData: {
    patientName: string;
    contactNumber: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    admissionDate?: string;
    admissionTime?: string;
    doctorId: string;
    directorId?: string;
    bookedBy: BookedByType;
    roomCategoryPreference: PatientBooking['roomCategoryPreference'];
    priority: PatientBooking['priority'];
    notes?: string;
  }): PatientBooking => {
    const doctor = doctors.find((d) => d.id === patientData.doctorId) || doctors[0];
    const director = directors.find((d) => d.id === patientData.directorId);

    const nowIso = getCurrentTimestamp();
    const todayStr = getTodayDateString();
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Generate unique sequential Patient ID
    const count = bookings.length + 1;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newPatientId = `PAT-2026-${String(count).padStart(3, '0')}`;

    const newBooking: PatientBooking = {
      id: `book-${Date.now()}-${randomSuffix}`,
      patientName: patientData.patientName.trim(),
      patientId: newPatientId,
      age: patientData.age,
      gender: patientData.gender,
      contactNumber: patientData.contactNumber.trim(),
      admissionDate: patientData.admissionDate || todayStr,
      admissionTime: patientData.admissionTime || timeStr,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorDepartment: doctor.department,
      directorId: director?.id,
      directorName: director?.name,
      bookedBy: patientData.bookedBy,
      bookedByName: `${patientData.bookedBy === 'Patient' ? 'রোগী নিজে' : `${director?.name || currentUser.name} (${patientData.bookedBy})`}`,
      roomCategoryPreference: patientData.roomCategoryPreference,
      status: 'waiting',
      priority: patientData.priority,
      notes: patientData.notes || '',
      createdAt: nowIso,
      updatedAt: nowIso,
      historyLog: [
        {
          timestamp: nowIso,
          action: `Added to Waiting List by ${patientData.bookedBy}`,
          actionBn: `${patientData.bookedBy} কর্তৃক অপেক্ষমাণ তালিকায় অন্তর্ভুক্ত`,
          user: currentUser.name,
          details: `প্রাথমিক অপেক্ষমাণ তালিকায় রোগী যুক্ত করা হয়েছে। অগ্রাধিকার: ${patientData.priority}।`,
        },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const assignRoom = (bookingId: string, roomNumber: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const { updatedBooking, updatedRooms } = assignRoomToPatient(
      booking,
      roomNumber,
      currentUser.name,
      rooms
    );

    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)));
    setRooms(updatedRooms);
  };

  const confirmBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const { updatedBooking, updatedRooms } = confirmPatientBooking(
      booking,
      currentUser.name,
      rooms
    );

    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)));
    setRooms(updatedRooms);
  };

  const cancelBooking = (bookingId: string, reason: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const { updatedBooking, updatedRooms } = cancelPatientBooking(
      booking,
      reason,
      currentUser.name,
      rooms
    );

    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)));
    setRooms(updatedRooms);
  };

  const dischargePatient = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const { updatedBooking, updatedRooms } = dischargePatientBooking(
      booking,
      currentUser.name,
      rooms
    );

    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)));
    setRooms(updatedRooms);
  };

  const updateBooking = (bookingId: string, updateData: Partial<PatientBooking>) => {
    const nowIso = getCurrentTimestamp();
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          ...updateData,
          updatedAt: nowIso,
          historyLog: [
            ...b.historyLog,
            {
              timestamp: nowIso,
              action: 'Booking Details Updated',
              actionBn: 'বুকিংয়ের তথ্য সংশোধন করা হয়েছে',
              user: currentUser.name,
              details: 'ব্যবহারকারী কর্তৃক রোগীর তথ্য আপডেট করা হয়েছে।',
            },
          ],
        };
      })
    );
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [...prev, newDoc]);
  };

  const addDirector = (directorData: Omit<Director, 'id'>) => {
    const newDir: Director = {
      ...directorData,
      id: `dir-${Date.now()}`,
    };
    setDirectors((prev) => [...prev, newDir]);
  };

  const resetToDefaultData = () => {
    setBookings(INITIAL_BOOKINGS);
    setRooms(INITIAL_ROOMS);
    setDoctors(INITIAL_DOCTORS);
    setDirectors(INITIAL_DIRECTORS);
    try {
      localStorage.removeItem(STORAGE_KEY_BOOKINGS);
      localStorage.removeItem(STORAGE_KEY_ROOMS);
      localStorage.removeItem(STORAGE_KEY_DOCTORS);
      localStorage.removeItem(STORAGE_KEY_DIRECTORS);
    } catch {
      // ignore
    }
  };

  const exportDatabaseJSON = () => {
    const data = {
      hospital: 'Hospital Room Booking & Waiting List Management System',
      exportedAt: getCurrentTimestamp(),
      bookings,
      rooms,
      doctors,
      directors,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.bookings) && Array.isArray(parsed.rooms)) {
        setBookings(parsed.bookings);
        setRooms(parsed.rooms);
        if (Array.isArray(parsed.doctors)) setDoctors(parsed.doctors);
        if (Array.isArray(parsed.directors)) setDirectors(parsed.directors);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <HospitalContext.Provider
      value={{
        bookings,
        rooms,
        doctors,
        directors,
        currentUser,
        setCurrentUserRole,
        language,
        setLanguage,
        filters,
        setFilters,
        filteredBookings,
        stats,
        addToWaitingList,
        assignRoom,
        confirmBooking,
        cancelBooking,
        dischargePatient,
        updateBooking,
        addDoctor,
        addDirector,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
