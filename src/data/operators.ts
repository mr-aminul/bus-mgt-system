// Operator / Bus Service Provider master data (from BMS)

export interface BusOperator {
  id: string
  name: string
  shortName: string
  color: string
  colorBg: string
  colorText: string
  founded: string
  hq: string
  hqBn: string
  totalBuses: number
  routes: string[]
  logo: string
}

export const OPERATORS: BusOperator[] = [
  { id: 'saintmartin', name: 'Saint Martin Paribahan', shortName: 'Saint Martin', color: '#0F766E', colorBg: '#F0FDF9', colorText: '#0F766E', founded: '2004', hq: 'Arambagh, Dhaka', hqBn: 'আরামবাগ, ঢাকা', totalBuses: 38, routes: ['Dhaka → Chittagong', 'Dhaka → Cox\'s Bazar', 'Chittagong → Cox\'s Bazar'], logo: '🚌' },
  { id: 'greenline', name: 'Green Line Paribahan', shortName: 'Green Line', color: '#16A34A', colorBg: '#F0FDF4', colorText: '#16A34A', founded: '1991', hq: 'Motijheel, Dhaka', hqBn: 'মতিঝিল, ঢাকা', totalBuses: 62, routes: ['Dhaka → Chittagong', 'Dhaka → Sylhet', 'Dhaka → Khulna', 'Dhaka → Rajshahi'], logo: '🟢' },
  { id: 'hanif', name: 'Hanif Enterprise', shortName: 'Hanif', color: '#B45309', colorBg: '#FFFBEB', colorText: '#B45309', founded: '1965', hq: 'Kamalapur, Dhaka', hqBn: 'কমলাপুর, ঢাকা', totalBuses: 85, routes: ['Dhaka → Chittagong', 'Dhaka → Sylhet', 'Dhaka → Cox\'s Bazar', 'Dhaka → Rajshahi', 'Dhaka → Khulna'], logo: '🏆' },
  { id: 'shyamoli', name: 'Shyamoli Paribahan', shortName: 'Shyamoli', color: '#7C3AED', colorBg: '#F5F3FF', colorText: '#7C3AED', founded: '1986', hq: 'Shyamoli, Dhaka', hqBn: 'শ্যামলী, ঢাকা', totalBuses: 74, routes: ['Dhaka → Chittagong', 'Dhaka → Rajshahi', 'Dhaka → Khulna', 'Dhaka → Barishal'], logo: '🟣' },
  { id: 'shohag', name: 'Shohag Paribahan', shortName: 'Shohag', color: '#DC2626', colorBg: '#FEF2F2', colorText: '#DC2626', founded: '1997', hq: 'Sayedabad, Dhaka', hqBn: 'সায়েদাবাদ, ঢাকা', totalBuses: 56, routes: ['Dhaka → Chittagong', 'Dhaka → Comilla', 'Dhaka → Feni', 'Chittagong → Comilla'], logo: '🔴' },
  { id: 'desh', name: 'Desh Travels', shortName: 'Desh', color: '#1D4ED8', colorBg: '#EFF6FF', colorText: '#1D4ED8', founded: '2001', hq: 'Gabtoli, Dhaka', hqBn: 'গাবতলী, ঢাকা', totalBuses: 43, routes: ['Dhaka → Rajshahi', 'Dhaka → Khulna', 'Dhaka → Barishal', 'Dhaka → Sylhet'], logo: '🔵' },
]

export interface FleetBus {
  id: string
  reg: string
  model: string
  ac: boolean
  operatorId: string
  route: string
  routeBn: string
  driver: string
  driverBn: string
  status: 'Active' | 'Delayed' | 'Idle' | 'Maintenance'
  compliance: 'OK' | 'Warning' | 'Critical'
  lastTrip: string
}

export const ALL_BUSES: FleetBus[] = [
  { id: 'SM-1101', reg: 'SM-11-1101', model: 'Hino AK', ac: true, operatorId: 'saintmartin', route: 'Dhaka → Chittagong', routeBn: 'ঢাকা → চট্টগ্রাম', driver: 'Karim Uddin', driverBn: 'করিম উদ্দিন', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'SM-1208', reg: 'SM-12-1208', model: 'Scania K360', ac: true, operatorId: 'saintmartin', route: 'Dhaka → Cox\'s Bazar', routeBn: 'ঢাকা → কক্সবাজার', driver: 'Alam Hossain', driverBn: 'আলম হোসেন', status: 'Active', compliance: 'Warning', lastTrip: '02 Mar 2026' },
  { id: 'SM-0934', reg: 'SM-09-0934', model: 'Hino RK', ac: false, operatorId: 'saintmartin', route: 'Chittagong → Cox\'s Bazar', routeBn: 'চট্টগ্রাম → কক্সবাজার', driver: 'Sabbir Mia', driverBn: 'সাব্বির মিয়া', status: 'Idle', compliance: 'OK', lastTrip: '01 Mar 2026' },
  { id: 'GL-2087', reg: 'GL-20-2087', model: 'Scania K360', ac: true, operatorId: 'greenline', route: 'Dhaka → Sylhet', routeBn: 'ঢাকা → সিলেট', driver: 'Karim Ali', driverBn: 'করিম আলী', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'GL-1142', reg: 'GL-11-1142', model: 'Volvo B11R', ac: true, operatorId: 'greenline', route: 'Dhaka → Chittagong', routeBn: 'ঢাকা → চট্টগ্রাম', driver: 'Rahim Uddin', driverBn: 'রহিম উদ্দিন', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'GL-3315', reg: 'GL-33-3315', model: 'Hino RK', ac: false, operatorId: 'greenline', route: 'Dhaka → Khulna', routeBn: 'ঢাকা → খুলনা', driver: 'Hasan Mia', driverBn: 'হাসান মিয়া', status: 'Delayed', compliance: 'Critical', lastTrip: '02 Mar 2026' },
  { id: 'GL-0891', reg: 'GL-08-0891', model: 'Scania K230', ac: true, operatorId: 'greenline', route: 'Dhaka → Rajshahi', routeBn: 'ঢাকা → রাজশাহী', driver: 'Jalal Khan', driverBn: 'জলাল খান', status: 'Active', compliance: 'OK', lastTrip: '01 Mar 2026' },
  { id: 'HN-4401', reg: 'HN-44-4401', model: 'Hino AK', ac: true, operatorId: 'hanif', route: 'Dhaka → Chittagong', routeBn: 'ঢাকা → চট্টগ্রাম', driver: 'Ruhul Amin', driverBn: 'রুহুল আমিন', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'HN-2205', reg: 'HN-22-2205', model: 'Volvo B11R', ac: true, operatorId: 'hanif', route: 'Dhaka → Sylhet', routeBn: 'ঢাকা → সিলেট', driver: 'Faruk Hossain', driverBn: 'ফারুক হোসেন', status: 'Active', compliance: 'Warning', lastTrip: '02 Mar 2026' },
  { id: 'HN-0542', reg: 'HN-05-0542', model: 'Hino RK', ac: false, operatorId: 'hanif', route: 'Unassigned', routeBn: 'অনির্ধারিত', driver: '—', driverBn: '—', status: 'Maintenance', compliance: 'OK', lastTrip: '28 Feb 2026' },
  { id: 'HN-3302', reg: 'HN-33-3302', model: 'Scania K360', ac: false, operatorId: 'hanif', route: 'Dhaka → Cox\'s Bazar', routeBn: 'ঢাকা → কক্সবাজার', driver: 'Bellal Hossain', driverBn: 'বেলাল হোসেন', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'SH-1776', reg: 'SH-17-1776', model: 'Scania K230', ac: true, operatorId: 'shyamoli', route: 'Dhaka → Khulna', routeBn: 'ঢাকা → খুলনা', driver: 'Nabil Ahmed', driverBn: 'নাবিল আহমেদ', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'SH-2290', reg: 'SH-22-2290', model: 'Volvo B11R', ac: true, operatorId: 'shyamoli', route: 'Dhaka → Rajshahi', routeBn: 'ঢাকা → রাজশাহী', driver: 'Sohel Rana', driverBn: 'সোহেল রানা', status: 'Delayed', compliance: 'Warning', lastTrip: '01 Mar 2026' },
  { id: 'SH-0875', reg: 'SH-08-0875', model: 'Hino RK', ac: false, operatorId: 'shyamoli', route: 'Dhaka → Barishal', routeBn: 'ঢাকা → বরিশাল', driver: 'Kabir Mia', driverBn: 'কবির মিয়া', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'SG-1903', reg: 'SG-19-1903', model: 'Hino AK', ac: true, operatorId: 'shohag', route: 'Dhaka → Chittagong', routeBn: 'ঢাকা → চট্টগ্রাম', driver: 'Manik Hossain', driverBn: 'মানিক হোসেন', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'SG-0441', reg: 'SG-04-0441', model: 'Hino RK', ac: false, operatorId: 'shohag', route: 'Dhaka → Comilla', routeBn: 'ঢাকা → কুমিল্লা', driver: 'Dulal Mia', driverBn: 'দুলাল মিয়া', status: 'Active', compliance: 'Critical', lastTrip: '02 Mar 2026' },
  { id: 'SG-2114', reg: 'SG-21-2114', model: 'Scania K360', ac: true, operatorId: 'shohag', route: 'Dhaka → Feni', routeBn: 'ঢাকা → ফেনী', driver: 'Ripon Ahmed', driverBn: 'রিপন আহমেদ', status: 'Idle', compliance: 'OK', lastTrip: '01 Mar 2026' },
  { id: 'DT-3388', reg: 'DT-33-3388', model: 'Volvo B11R', ac: true, operatorId: 'desh', route: 'Dhaka → Rajshahi', routeBn: 'ঢাকা → রাজশাহী', driver: 'Tarek Rahman', driverBn: 'তারেক রহমান', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'DT-1205', reg: 'DT-12-1205', model: 'Scania K230', ac: true, operatorId: 'desh', route: 'Dhaka → Sylhet', routeBn: 'ঢাকা → সিলেট', driver: 'Liton Das', driverBn: 'লিটন দাস', status: 'Active', compliance: 'OK', lastTrip: '02 Mar 2026' },
  { id: 'DT-0780', reg: 'DT-07-0780', model: 'Hino RK', ac: false, operatorId: 'desh', route: 'Dhaka → Barishal', routeBn: 'ঢাকা → বরিশাল', driver: 'Rasel Khan', driverBn: 'রাসেল খান', status: 'Maintenance', compliance: 'Warning', lastTrip: '27 Feb 2026' },
]
