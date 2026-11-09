export type UserRole = 'Admin' | 'Doctor' | 'Director' | 'AGM' | 'DGM' | 'AO' | 'Staff';

export type BookedByType = 'Patient' | 'AGM' | 'DGM' | 'AO';

export type BookingStatus = 
  | 'waiting'              // অপেক্ষমাণ তালিকা
  | 'booking_in_progress'  // রুম বুকিং / প্রক্রিয়াধীন (রুম নম্বর প্রদান করা হয়েছে)
  | 'confirmed'            // চূড়ান্ত বরাদ্দ
  | 'discharged'           // ছাড়পত্র প্রাপ্ত
  | 'cancelled';           // বাতিলকৃত

export type RoomCategory = 
  | 'VIP Cabin' 
  | 'Deluxe Cabin' 
  | 'AC Cabin' 
  | 'Non-AC Cabin' 
  | 'General Ward' 
  | 'ICU' 
  | 'CCU';

export type RoomStatus = 'available' | 'allocated' | 'occupied' | 'maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  categoryBn: string;
  ratePerDay: number;
  status: RoomStatus;
  currentBookingId?: string;
  patientName?: string;
  doctorName?: string;
  bedCount?: number;
  features?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  department: string;
  departmentBn: string;
  designation: string;
  designationBn: string;
  phone: string;
  roomNo: string;
}

export interface Director {
  id: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  department: string;
  phone: string;
}

export interface BookingHistoryItem {
  timestamp: string;
  action: string;
  actionBn: string;
  user: string;
  details?: string;
}

export interface PatientBooking {
  id: string;
  patientName: string;
  patientId: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  admissionDate: string; // YYYY-MM-DD
  admissionTime: string; // HH:mm
  doctorId: string;
  doctorName: string;
  doctorDepartment?: string;
  directorId?: string;
  directorName?: string;
  bookedBy: BookedByType; // Patient | AGM | DGM | AO
  bookedByName?: string;
  roomCategoryPreference: RoomCategory;
  assignedRoomNumber?: string;
  status: BookingStatus;
  priority: 'normal' | 'urgent' | 'vip';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  dischargeDate?: string;
  historyLog: BookingHistoryItem[];
}

export interface FilterCriteria {
  searchQuery?: string;
  doctorName?: string;
  roomNumber?: string;
  status?: BookingStatus | 'all';
  bookedBy?: BookedByType | 'all';
  dateFilter?: string; // YYYY-MM-DD
  onlyRunningDate?: boolean; // চলমান তারিখের বুকিং
  roomCategory?: RoomCategory | 'all';
}
