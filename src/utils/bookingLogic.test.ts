import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterBookings,
  assignRoomToPatient,
  confirmPatientBooking,
  cancelPatientBooking,
  dischargePatientBooking,
  getHospitalStatistics,
} from './bookingLogic.ts';
import { PatientBooking, Room } from '../types/index.ts';

const mockRooms: Room[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    floor: 1,
    category: 'VIP Cabin',
    categoryBn: 'ভিআইপি কেবিন',
    ratePerDay: 5000,
    status: 'available',
  },
  {
    id: 'room-102',
    roomNumber: '102',
    floor: 1,
    category: 'Deluxe Cabin',
    categoryBn: 'ডিলাক্স কেবিন',
    ratePerDay: 3500,
    status: 'available',
  },
];

const mockWaitingBooking: PatientBooking = {
  id: 'book-1',
  patientName: 'Md. Abdul Karim',
  patientId: 'PAT-2026-001',
  age: 52,
  gender: 'Male',
  contactNumber: '01711223344',
  admissionDate: '2026-11-09',
  admissionTime: '10:30',
  doctorId: 'doc-1',
  doctorName: 'Prof. Dr. M. A. Karim',
  directorId: 'dir-1',
  directorName: 'Dr. A. K. Azad',
  bookedBy: 'AGM',
  roomCategoryPreference: 'VIP Cabin',
  status: 'waiting',
  priority: 'vip',
  createdAt: '2026-11-09T10:30:00.000Z',
  updatedAt: '2026-11-09T10:30:00.000Z',
  historyLog: [],
};

test('assignRoomToPatient moves status to booking_in_progress and marks room allocated', () => {
  const { updatedBooking, updatedRooms } = assignRoomToPatient(
    mockWaitingBooking,
    '101',
    'Admin User',
    mockRooms
  );

  assert.equal(updatedBooking.status, 'booking_in_progress');
  assert.equal(updatedBooking.assignedRoomNumber, '101');
  assert.equal(updatedBooking.historyLog.length, 1);
  assert.ok(updatedBooking.historyLog[0].actionBn.includes('রুম নম্বর'));

  const room101 = updatedRooms.find((r) => r.roomNumber === '101');
  assert.ok(room101);
  assert.equal(room101.status, 'allocated');
  assert.equal(room101.currentBookingId, 'book-1');
});

test('confirmPatientBooking moves status to confirmed and marks room occupied', () => {
  const inProgressBooking: PatientBooking = {
    ...mockWaitingBooking,
    assignedRoomNumber: '101',
    status: 'booking_in_progress',
  };
  const allocatedRooms: Room[] = [
    { ...mockRooms[0], status: 'allocated', currentBookingId: 'book-1' },
    mockRooms[1],
  ];

  const { updatedBooking, updatedRooms } = confirmPatientBooking(
    inProgressBooking,
    'Director Dr. Azad',
    allocatedRooms
  );

  assert.equal(updatedBooking.status, 'confirmed');
  assert.ok(updatedBooking.confirmedAt);
  const room101 = updatedRooms.find((r) => r.roomNumber === '101');
  assert.ok(room101);
  assert.equal(room101.status, 'occupied');
});

test('cancelPatientBooking frees allocated room and logs reason', () => {
  const inProgressBooking: PatientBooking = {
    ...mockWaitingBooking,
    assignedRoomNumber: '101',
    status: 'booking_in_progress',
  };
  const allocatedRooms: Room[] = [
    { ...mockRooms[0], status: 'allocated', currentBookingId: 'book-1' },
  ];

  const { updatedBooking, updatedRooms } = cancelPatientBooking(
    inProgressBooking,
    'Patient opted for another facility',
    'Officer AO',
    allocatedRooms
  );

  assert.equal(updatedBooking.status, 'cancelled');
  assert.equal(updatedRooms[0].status, 'available');
  assert.equal(updatedRooms[0].currentBookingId, undefined);
  assert.equal(updatedBooking.cancelReason, 'Patient opted for another facility');
});

test('dischargePatientBooking marks status discharged and frees room', () => {
  const confirmedBooking: PatientBooking = {
    ...mockWaitingBooking,
    assignedRoomNumber: '101',
    status: 'confirmed',
  };
  const occupiedRooms: Room[] = [
    { ...mockRooms[0], status: 'occupied', currentBookingId: 'book-1' },
  ];

  const { updatedBooking, updatedRooms } = dischargePatientBooking(
    confirmedBooking,
    'Discharge Officer',
    occupiedRooms
  );

  assert.equal(updatedBooking.status, 'discharged');
  assert.equal(updatedRooms[0].status, 'available');
  assert.ok(updatedBooking.dischargeDate);
});

test('filterBookings filters by doctorName and roomNumber correctly', () => {
  const bookings: PatientBooking[] = [
    mockWaitingBooking,
    {
      ...mockWaitingBooking,
      id: 'book-2',
      patientName: 'Farhana Akter',
      doctorName: 'Dr. Farhana Chowdhury',
      assignedRoomNumber: '205',
      status: 'confirmed',
      bookedBy: 'DGM',
    },
  ];

  const doctorFiltered = filterBookings(bookings, { doctorName: 'Farhana' });
  assert.equal(doctorFiltered.length, 1);
  assert.equal(doctorFiltered[0].patientName, 'Farhana Akter');

  const roomFiltered = filterBookings(bookings, { roomNumber: '205' });
  assert.equal(roomFiltered.length, 1);
  assert.equal(roomFiltered[0].id, 'book-2');

  const bookedByFiltered = filterBookings(bookings, { bookedBy: 'AGM' });
  assert.equal(bookedByFiltered.length, 1);
  assert.equal(bookedByFiltered[0].id, 'book-1');
});

test('getHospitalStatistics computes correct counts', () => {
  const bookings: PatientBooking[] = [
    mockWaitingBooking,
    {
      ...mockWaitingBooking,
      id: 'book-2',
      status: 'booking_in_progress',
      assignedRoomNumber: '101',
    },
  ];
  const rooms: Room[] = [
    { ...mockRooms[0], status: 'allocated' },
    mockRooms[1],
  ];

  const stats = getHospitalStatistics(bookings, rooms, '2026-11-09');
  assert.equal(stats.waitingCount, 1);
  assert.equal(stats.bookingInProgressCount, 1);
  assert.equal(stats.totalRooms, 2);
  assert.equal(stats.availableRooms, 1);
  assert.equal(stats.allocatedRooms, 1);
});
