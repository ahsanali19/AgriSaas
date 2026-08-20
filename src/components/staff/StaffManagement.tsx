// src/components/staff/StaffManagement.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { StaffMember, SalaryAdvance, EnterpriseType } from '../../types';
import {
  Users,
  UserPlus,
  DollarSign,
  Calendar,
  Phone,
  CreditCard,
  Plus,
  CheckCircle2,
  TrendingDown,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  Search,
  ArrowDownRight
} from 'lucide-react';

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 1,
    fullName: 'Muhammad Ramzan',
    phone: '+92 301 7894561',
    cnicOrNationalId: '36502-1234567-1',
    role: 'Milker',
    enterpriseAssigned: 'dairy',
    monthlySalary: 28000,
    totalAdvancePaid: 8000,
    joiningDate: '2023-04-15',
    status: 'active'
  },
  {
    id: 2,
    fullName: 'Suresh Kumar',
    phone: '+92 304 9876543',
    cnicOrNationalId: '36502-7654321-3',
    role: 'Flock Manager',
    enterpriseAssigned: 'poultry',
    monthlySalary: 32000,
    totalAdvancePaid: 5000,
    joiningDate: '2023-08-01',
    status: 'active'
  },
  {
    id: 3,
    fullName: 'Allah Ditta',
    phone: '+92 306 4561234',
    cnicOrNationalId: '36502-4567890-5',
    role: 'Pond Worker',
    enterpriseAssigned: 'fish',
    monthlySalary: 25000,
    totalAdvancePaid: 12000,
    joiningDate: '2024-01-10',
    status: 'active'
  }
];

const INITIAL_ADVANCES: SalaryAdvance[] = [
  { id: 101, staffId: 1, staffName: 'Muhammad Ramzan', amount: 5000, date: '2026-08-05', notes: 'Emergency medical for son' },
  { id: 102, staffId: 1, staffName: 'Muhammad Ramzan', amount: 3000, date: '2026-08-12', notes: 'Household grocery advance' },
  { id: 103, staffId: 2, staffName: 'Suresh Kumar', amount: 5000, date: '2026-08-08', notes: 'Motorcycle repair' },
  { id: 104, staffId: 3, staffName: 'Allah Ditta', amount: 12000, date: '2026-08-02', notes: 'Home renovation advance' },
];

export const StaffManagement: React.FC = () => {
  const { farm, addKhataTransaction } = useFarm();
  const symbol = farm.currency === 'INR' ? '₹' : '₨';

  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [advancesList, setAdvancesList] = useState<SalaryAdvance[]>(INITIAL_ADVANCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnterprise, setFilterEnterprise] = useState<string>('all');

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedStaffForAdvance, setSelectedStaffForAdvance] = useState<StaffMember | null>(null);

  // New Staff Form State
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    phone: '',
    cnicOrNationalId: '',
    role: 'Milker' as StaffMember['role'],
    enterpriseAssigned: 'dairy' as EnterpriseType,
    monthlySalary: 25000,
    joiningDate: new Date().toISOString().split('T')[0]
  });

  // New Advance Form State
  const [advanceForm, setAdvanceForm] = useState({
    amount: 5000,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    syncToKhata: true
  });

  // Calculate totals
  const totalMonthlyPayroll = staffList.reduce((sum, s) => sum + s.monthlySalary, 0);
  const totalAdvancesPaid = staffList.reduce((sum, s) => sum + s.totalAdvancePaid, 0);
  const netPayablePending = totalMonthlyPayroll - totalAdvancesPaid;

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.phone) return;

    const created: StaffMember = {
      id: Date.now(),
      fullName: newStaff.fullName,
      phone: newStaff.phone,
      cnicOrNationalId: newStaff.cnicOrNationalId,
      role: newStaff.role,
      enterpriseAssigned: newStaff.enterpriseAssigned,
      monthlySalary: Number(newStaff.monthlySalary),
      totalAdvancePaid: 0,
      joiningDate: newStaff.joiningDate,
      status: 'active'
    };

    setStaffList([...staffList, created]);
    setShowAddStaffModal(false);
    setNewStaff({
      fullName: '',
      phone: '',
      cnicOrNationalId: '',
      role: 'Milker',
      enterpriseAssigned: 'dairy',
      monthlySalary: 25000,
      joiningDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleRecordAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForAdvance || advanceForm.amount <= 0) return;

    const advRecord: SalaryAdvance = {
      id: Date.now(),
      staffId: selectedStaffForAdvance.id,
      staffName: selectedStaffForAdvance.fullName,
      amount: Number(advanceForm.amount),
      date: advanceForm.date,
      notes: advanceForm.notes || 'Salary Advance / Peshgi'
    };

    // Update staff total advance
    setStaffList(staffList.map(s => {
      if (s.id === selectedStaffForAdvance.id) {
        return { ...s, totalAdvancePaid: s.totalAdvancePaid + Number(advanceForm.amount) };
      }
      return s;
    }));

    setAdvancesList([advRecord, ...advancesList]);

    // Optional: automatically post to Khata Ledger as an expense
    if (advanceForm.syncToKhata && addKhataTransaction) {
      addKhataTransaction({
        enterpriseType: selectedStaffForAdvance.enterpriseAssigned,
        categoryName: 'Labor & Wages (Advance)',
        transactionType: 'expense',
        amount: Number(advanceForm.amount),
        paymentMode: 'cash',
        transactionDate: advanceForm.date,
        partyName: selectedStaffForAdvance.fullName,
        description: `Advance wage payment: ${advanceForm.notes || 'Peshgi'}`
      });
    }

    setShowAdvanceModal(false);
    setSelectedStaffForAdvance(null);
    setAdvanceForm({
      amount: 5000,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      syncToKhata: true
    });
  };

  const openAdvanceModal = (staff: StaffMember) => {
    setSelectedStaffForAdvance(staff);
    setShowAdvanceModal(true);
  };

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.phone.includes(searchQuery) ||
                          s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnterprise = filterEnterprise === 'all' || s.enterpriseAssigned === filterEnterprise;
    return matchesSearch && matchesEnterprise;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Farm Human Resources
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">Wages & Peshgi Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Farm Staff & Laborer Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track permanent milkers, pond operators, and poultry workers. Log salary advances (peshgi) with automatic deductions from month-end payroll.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-emerald-950 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Farm Worker</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none pointer-events-none transform translate-x-8 translate-y-8">
          👥
        </div>
      </div>

      {/* Salary & Payroll Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Monthly Payroll</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 mt-2">
            {symbol} {totalMonthlyPayroll.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across <strong>{staffList.length}</strong> active farm workers
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase tracking-wider">
            <span>Total Advances (Peshgi) Paid</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-amber-600 mt-2">
            {symbol} {totalAdvancesPaid.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Deducted from this month's gross wages
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span>Net Payable Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-700 mt-2">
            {symbol} {netPayablePending.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Remaining to disburse on month-end
          </div>
        </div>

      </div>

      {/* Staff Directory & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-base text-slate-900">Farm Workers Directory</h2>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredStaff.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker by name, role..."
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Enterprise filter */}
            <select
              value={filterEnterprise}
              onChange={(e) => setFilterEnterprise(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Enterprises</option>
              <option value="dairy">🐄 Dairy Workers</option>
              <option value="poultry">🐔 Poultry Handlers</option>
              <option value="fish">🐟 Aquaculture Workers</option>
              <option value="general">🌾 General Farm Labor</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Worker Profile</th>
                <th className="py-3 px-4">Assigned Module</th>
                <th className="py-3 px-4">Monthly Salary</th>
                <th className="py-3 px-4">Advance (Peshgi)</th>
                <th className="py-3 px-4">Net Remaining</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => {
                const remaining = staff.monthlySalary - staff.totalAdvancePaid;
                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Worker Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                          {staff.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{staff.fullName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{staff.phone}</span>
                            {staff.cnicOrNationalId && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{staff.cnicOrNationalId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Enterprise */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                          {staff.role}
                        </span>
                        <div className="text-[10px] text-slate-400 capitalize font-medium">
                          {staff.enterpriseAssigned === 'dairy' && '🐄 Dairy Shed'}
                          {staff.enterpriseAssigned === 'poultry' && '🐔 Poultry Shed'}
                          {staff.enterpriseAssigned === 'fish' && '🐟 Fish Ponds'}
                          {staff.enterpriseAssigned === 'general' && '🌾 General Farm'}
                        </div>
                      </div>
                    </td>

                    {/* Base Salary */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-sm">
                      {symbol} {staff.monthlySalary.toLocaleString()}
                    </td>

                    {/* Total Advance */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {symbol} {staff.totalAdvancePaid.toLocaleString()}
                    </td>

                    {/* Net Remaining */}
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700 text-sm">
                      {symbol} {remaining.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {staff.joiningDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openAdvanceModal(staff)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 ml-auto shadow-sm active:scale-95"
                      >
                        <ArrowDownRight className="w-3.5 h-3.5 text-amber-700" />
                        <span>Give Advance</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Advance Payments (Peshgi) Ledger Log */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-slate-900">Recent Advance (Peshgi) Logs</h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Khata Synced
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Auto-deducted from wages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {advancesList.map((adv) => (
            <div key={adv.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="font-bold text-slate-900">{adv.staffName}</strong>
                <span className="font-mono font-bold text-amber-600">
                  -{symbol} {adv.amount.toLocaleString()}
                </span>
              </div>
              <p className="text-slate-500 italic truncate text-[11px]">
                "{adv.notes || 'Salary Advance'}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{adv.date}</span>
                </span>
                <span className="text-emerald-700 font-semibold">Logged</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW FARM WORKER
          ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Add New Farm Worker</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Aslam"
                  value={newStaff.fullName}
                  onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">National ID / CNIC</label>
                  <input
                    type="text"
                    placeholder="36502-XXXXXXX-X"
                    value={newStaff.cnicOrNationalId}
                    onChange={(e) => setNewStaff({ ...newStaff, cnicOrNationalId: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Designation</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Milker">🐄 Milker / Gwala</option>
                    <option value="Flock Manager">🐔 Poultry Flock Manager</option>
                    <option value="Pond Worker">🐟 Pond Operator</option>
                    <option value="General Labor">🌾 General Farm Labor</option>
                    <option value="Supervisor">📋 Farm Supervisor / Munshi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enterprise Assignment</label>
                  <select
                    value={newStaff.enterpriseAssigned}
                    onChange={(e) => setNewStaff({ ...newStaff, enterpriseAssigned: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="dairy">Dairy & Livestock</option>
                    <option value="poultry">Poultry Sheds</option>
                    <option value="fish">Aquaculture Ponds</option>
                    <option value="general">General Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary ({symbol}) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={newStaff.monthlySalary}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlySalary: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newStaff.joiningDate}
                    onChange={(e) => setNewStaff({ ...newStaff, joiningDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                >
                  Save Worker Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RECORD SALARY ADVANCE (PESHGI)
          ========================================================================= */}
      {showAdvanceModal && selectedStaffForAdvance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Advance (Peshgi)</h3>
                  <p className="text-[11px] text-slate-500">Worker: {selectedStaffForAdvance.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdvanceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-700">Current Monthly Salary</div>
                <div className="font-mono font-bold text-sm">{symbol} {selectedStaffForAdvance.monthlySalary.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-amber-700">Remaining Balance</div>
                <div className="font-mono font-bold text-sm text-emerald-700">
                  {symbol} {(selectedStaffForAdvance.monthlySalary - selectedStaffForAdvance.totalAdvancePaid).toLocaleString()}
                </div>
              </div>
            </div>

            <form onSubmit={handleRecordAdvance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Advance Amount ({symbol}) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={selectedStaffForAdvance.monthlySalary - selectedStaffForAdvance.totalAdvancePaid}
                  value={advanceForm.amount}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Disbursement Date</label>
                <input
                  type="date"
                  value={advanceForm.date}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, date: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent family emergency, grocery advance"
                  value={advanceForm.notes}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, notes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={advanceForm.syncToKhata}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, syncToKhata: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Automatically sync as Expense in Farm Khata Ledger</span>
              </label>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95"
                >
                  Record Advance Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManagement;
