import { 
  PatientBooking, 
  Room, 
  FilterCriteria, 
  BookedByType, 
  BookingStatus 
} from '../types/index.ts';

/**
 * Format current timestamp for log entries
 */
export function getCurrentTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Filter bookings based on user criteria (search, doctor, room, running date, etc.)
 */
export function filterBookings(
  bookings: PatientBooking[],
  criteria: FilterCriteria,
  referenceDate: string = getTodayDateString()
): PatientBooking[] {
  return bookings.filter((b) => {
    // Running date filter: matches running date (admission date equals referenceDate OR currently active)
    if (criteria.onlyRunningDate) {
      const isToday = b.admissionDate === referenceDate;
      const isActiveRunning = (b.status === 'confirmed' || b.status === 'booking_in_progress') && b.admissionDate <= referenceDate;
      if (!isToday && !isActiveRunning) {
        return false;
      }
    }

    // Explicit date filter
    if (criteria.dateFilter && criteria.dateFilter.trim() !== '') {
      if (b.admissionDate !== criteria.dateFilter) {
        return false;
      }
    }

    // Status filter
    if (criteria.status && criteria.status !== 'all') {
      if (b.status !== criteria.status) {
        return false;
      }
    }

    // Booked by filter (Patient, AGM, DGM, AO)
    if (criteria.bookedBy && criteria.bookedBy !== 'all') {
      if (b.bookedBy !== criteria.bookedBy) {
        return false;
      }
    }

    // Room category preference filter
    if (criteria.roomCategory && criteria.roomCategory !== 'all') {
      if (b.roomCategoryPreference !== criteria.roomCategory) {
        return false;
      }
    }

    // Specific Room number filter
    if (criteria.roomNumber && criteria.roomNumber.trim() !== '') {
      const targetRoom = criteria.roomNumber.trim().toLowerCase();
      if (!b.assignedRoomNumber || !b.assignedRoomNumber.toLowerCase().includes(targetRoom)) {
        return false;
      }
    }

    // Specific Doctor name filter
    if (criteria.doctorName && criteria.doctorName.trim() !== '') {
      const targetDoctor = criteria.doctorName.trim().toLowerCase();
      if (!b.doctorName.toLowerCase().includes(targetDoctor)) {
        return false;
      }
    }

    // General text search query (patient name, ID, room, doctor, director)
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.trim().toLowerCase();
      const matchName = b.patientName.toLowerCase().includes(q);
      const matchId = b.patientId.toLowerCase().includes(q);
      const matchDoctor = b.doctorName.toLowerCase().includes(q);
      const matchRoom = b.assignedRoomNumber?.toLowerCase().includes(q) ?? false;
      const matchDirector = b.directorName?.toLowerCase().includes(q) ?? false;
      const matchPhone = b.contactNumber.includes(q);
      const matchBookedBy = b.bookedBy.toLowerCase().includes(q);

      if (!matchName && !matchId && !matchDoctor && !matchRoom && !matchDirector && !matchPhone && !matchBookedBy) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Assign a room to a waiting patient, transitioning status to 'booking_in_progress'
 */
export function assignRoomToPatient(
  booking: PatientBooking,
  roomNumber: string,
  user: string,
  rooms: Room[]
): { updatedBooking: PatientBooking; updatedRooms: Room[] } {
  const now = getCurrentTimestamp();

  // Update room list: release previously assigned room if any, allocate new room
  const updatedRooms = rooms.map((r) => {
    // If this room is the newly assigned room
    if (r.roomNumber === roomNumber) {
      return {
        ...r,
        status: 'allocated' as const,
        currentBookingId: booking.id,
        patientName: booking.patientName,
        doctorName: booking.doctorName,
      };
    }
    // If releasing previously assigned room for this booking
    if (r.currentBookingId === booking.id && r.roomNumber !== roomNumber) {
      return {
        ...r,
        status: 'available' as const,
        currentBookingId: undefined,
        patientName: undefined,
        doctorName: undefined,
      };
    }
    return r;
  });

  const updatedBooking: PatientBooking = {
    ...booking,
    assignedRoomNumber: roomNumber,
    status: 'booking_in_progress',
    updatedAt: now,
    historyLog: [
      ...booking.historyLog,
      {
        timestamp: now,
        action: `Room Assigned: ${roomNumber}`,
        actionBn: `রুম নম্বর প্রদান করা হয়েছে: ${roomNumber}`,
        user,
        details: `রুম নম্বর ${roomNumber} প্রদান করে অপেক্ষমাণ তালিকা থেকে রুম বুকিং তালিকায় স্থানান্তর করা হয়েছে।`,
      },
    ],
  };

  return { updatedBooking, updatedRooms };
}

/**
 * Confirm booking, transitioning status from 'booking_in_progress' to 'confirmed'
 */
export function confirmPatientBooking(
  booking: PatientBooking,
  user: string,
  rooms: Room[]
): { updatedBooking: PatientBooking; updatedRooms: Room[] } {
  if (!booking.assignedRoomNumber) {
    throw new Error('Cannot confirm booking without an assigned room number');
  }

  const now = getCurrentTimestamp();

  // Mark room as occupied
  const updatedRooms = rooms.map((r) => {
    if (r.roomNumber === booking.assignedRoomNumber) {
      return {
        ...r,
        status: 'occupied' as const,
        currentBookingId: booking.id,
        patientName: booking.patientName,
        doctorName: booking.doctorName,
      };
    }
    return r;
  });

  const updatedBooking: PatientBooking = {
    ...booking,
    status: 'confirmed',
    confirmedAt: now,
    updatedAt: now,
    historyLog: [
      ...booking.historyLog,
      {
        timestamp: now,
        action: `Booking Confirmed: Room ${booking.assignedRoomNumber}`,
        actionBn: `বুকিং নিশ্চিত করা হয়েছে: রুম ${booking.assignedRoomNumber}`,
        user,
        details: `রুম নম্বর ${booking.assignedRoomNumber}-এর বুকিং চূড়ান্তভাবে নিশ্চিত করা হয়েছে।`,
      },
    ],
  };

  return { updatedBooking, updatedRooms };
}

/**
 * Cancel a booking and free up any assigned room
 */
export function cancelPatientBooking(
  booking: PatientBooking,
  reason: string,
  user: string,
  rooms: Room[]
): { updatedBooking: PatientBooking; updatedRooms: Room[] } {
  const now = getCurrentTimestamp();

  // Release room if allocated or occupied
  const updatedRooms = rooms.map((r) => {
    if (r.currentBookingId === booking.id || (booking.assignedRoomNumber && r.roomNumber === booking.assignedRoomNumber)) {
      return {
        ...r,
        status: 'available' as const,
        currentBookingId: undefined,
        patientName: undefined,
        doctorName: undefined,
      };
    }
    return r;
  });

  const updatedBooking: PatientBooking = {
    ...booking,
    status: 'cancelled',
    cancelledAt: now,
    cancelReason: reason,
    updatedAt: now,
    historyLog: [
      ...booking.historyLog,
      {
        timestamp: now,
        action: `Booking Cancelled: ${reason || 'No reason provided'}`,
        actionBn: `বুকিং বাতিল করা হয়েছে: ${reason || 'কোনো কারণ উল্লেখ করা হয়নি'}`,
        user,
        details: reason,
      },
    ],
  };

  return { updatedBooking, updatedRooms };
}

/**
 * Discharge patient, freeing up the room
 */
export function dischargePatientBooking(
  booking: PatientBooking,
  user: string,
  rooms: Room[]
): { updatedBooking: PatientBooking; updatedRooms: Room[] } {
  const now = getCurrentTimestamp();
  const today = getTodayDateString();

  // Release room
  const updatedRooms = rooms.map((r) => {
    if (r.currentBookingId === booking.id || (booking.assignedRoomNumber && r.roomNumber === booking.assignedRoomNumber)) {
      return {
        ...r,
        status: 'available' as const,
        currentBookingId: undefined,
        patientName: undefined,
        doctorName: undefined,
      };
    }
    return r;
  });

  const updatedBooking: PatientBooking = {
    ...booking,
    status: 'discharged',
    dischargeDate: today,
    updatedAt: now,
    historyLog: [
      ...booking.historyLog,
      {
        timestamp: now,
        action: `Patient Discharged from Room ${booking.assignedRoomNumber || 'N/A'}`,
        actionBn: `রোগী ছাড়পত্র পেয়েছেন (রুম: ${booking.assignedRoomNumber || 'প্রযোজ্য নয়'})`,
        user,
        details: `রোগীকে ছাড়পত্র প্রদান করা হয়েছে এবং রুম খালি করা হয়েছে।`,
      },
    ],
  };

  return { updatedBooking, updatedRooms };
}

/**
 * Calculate summary statistics for the hospital dashboard & daily report
 */
export function getHospitalStatistics(
  bookings: PatientBooking[],
  rooms: Room[],
  targetDate: string = getTodayDateString()
) {
  const waitingCount = bookings.filter((b) => b.status === 'waiting').length;
  const bookingInProgressCount = bookings.filter((b) => b.status === 'booking_in_progress').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const dischargedCount = bookings.filter((b) => b.status === 'discharged').length;

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const allocatedRooms = rooms.filter((r) => r.status === 'allocated').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;

  const runningDateBookings = bookings.filter(
    (b) => b.admissionDate === targetDate || ((b.status === 'confirmed' || b.status === 'booking_in_progress') && b.admissionDate <= targetDate)
  ).length;

  const occupancyRate = totalRooms > 0 ? Math.round(((occupiedRooms + allocatedRooms) / totalRooms) * 100) : 0;

  return {
    waitingCount,
    bookingInProgressCount,
    confirmedCount,
    dischargedCount,
    totalRooms,
    availableRooms,
    allocatedRooms,
    occupiedRooms,
    maintenanceRooms,
    runningDateBookings,
    occupancyRate,
  };
}
