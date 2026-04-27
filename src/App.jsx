import { useMemo, useState } from 'react';

const initialEmployees = [
  { id: 'EMP-101', name: 'Ava Thompson', team: 'Engineering', status: 'Present', updatedAt: '09:02 AM' },
  { id: 'EMP-102', name: 'Noah Patel', team: 'Product', status: 'Absent', updatedAt: '08:45 AM' },
  { id: 'EMP-103', name: 'Sophia Garcia', team: 'HR', status: 'Present', updatedAt: '09:08 AM' },
  { id: 'EMP-104', name: 'Liam Walker', team: 'Sales', status: 'Present', updatedAt: '08:59 AM' },
  { id: 'EMP-105', name: 'Emma Johnson', team: 'Marketing', status: 'Absent', updatedAt: '08:52 AM' },
  { id: 'EMP-106', name: 'Mason Kim', team: 'Engineering', status: 'Present', updatedAt: '09:10 AM' },
  { id: 'EMP-107', name: 'Olivia Brown', team: 'Finance', status: 'Present', updatedAt: '09:01 AM' },
  { id: 'EMP-108', name: 'Ethan Reed', team: 'Operations', status: 'Absent', updatedAt: '08:40 AM' },
];

const trends = [
  { day: 'Mon', present: 88 },
  { day: 'Tue', present: 91 },
  { day: 'Wed', present: 86 },
  { day: 'Thu', present: 93 },
  { day: 'Fri', present: 89 },
];

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesQuery =
        employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.id.toLowerCase().includes(query.toLowerCase()) ||
        employee.team.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [employees, query, statusFilter]);

  const stats = useMemo(() => {
    const total = employees.length;
    const present = employees.filter((employee) => employee.status === 'Present').length;
    const absent = total - present;
    const attendanceRate = Math.round((present / total) * 100);

    return { total, present, absent, attendanceRate };
  }, [employees]);

  const toggleStatus = (employeeId) => {
    setEmployees((current) =>
      current.map((employee) => {
        if (employee.id !== employeeId) return employee;
        return {
          ...employee,
          status: employee.status === 'Present' ? 'Absent' : 'Present',
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }),
    );
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">HR ATTENDANCE PORTAL</p>
          <h1>Employee Attendance Command Center</h1>
          <p className="subtitle">
            Track daily presence, resolve absences quickly, and monitor performance trends from a single portal.
          </p>
        </div>
        <div className="attendance-ring">
          <span>{stats.attendanceRate}%</span>
          <small>Today&apos;s attendance rate</small>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Total Employees" value={stats.total} tone="neutral" />
        <StatCard label="Present" value={stats.present} tone="success" />
        <StatCard label="Absent" value={stats.absent} tone="danger" />
        <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} tone="info" />
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Weekly Attendance Trend</h2>
          <p>Average checked-in workforce this week</p>
        </div>
        <div className="chart-row" role="img" aria-label="Weekly attendance trend chart">
          {trends.map((item) => (
            <div className="bar-item" key={item.day}>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${item.present}%` }} />
              </div>
              <strong>{item.present}%</strong>
              <span>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head panel-head-inline">
          <div>
            <h2>Employee Directory</h2>
            <p>Search and update attendance in real-time</p>
          </div>
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name, ID, or team"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Team</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-id">{employee.id}</div>
                    <div>{employee.name}</div>
                  </td>
                  <td>{employee.team}</td>
                  <td>
                    <span className={`status status-${employee.status.toLowerCase()}`}>{employee.status}</span>
                  </td>
                  <td>{employee.updatedAt}</td>
                  <td>
                    <button type="button" onClick={() => toggleStatus(employee.id)}>
                      Mark as {employee.status === 'Present' ? 'Absent' : 'Present'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 ? (
            <div className="empty-state">No employees found for this filter combination.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default App;
