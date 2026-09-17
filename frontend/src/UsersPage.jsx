import { useEffect, useState } from "react";
import "./UsersPage.css";

const API_URL = "http://localhost:8000/api/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next_page: false,
  });
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          per_page: String(pagination.per_page),
        });

        if (status) params.set("status", status);
        if (role) params.set("role", role);

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to load users");

        const data = await response.json();
        setUsers(data.data);
        setPagination(data.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load users. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, [status, role, page, pagination.per_page]);

  function onStatusChange(event) {
    setStatus(event.target.value);
    setPage(1);
  }

  function onRoleChange(event) {
    setRole(event.target.value);
    setPage(1);
  }

  return (
    <main className="users-page">
      <section className="users-container">
        <header className="page-header">
          <div>
            <p className="eyebrow">Directory</p>
            <h1>Users</h1>
            <p className="page-description">
              Manage and review everyone in your workspace.
            </p>
          </div>

          <div className="user-count">
            <strong>{pagination.total}</strong>
            <span>Total users</span>
          </div>
        </header>

        <section className="filters-card" aria-label="User filters">
          <div className="filter-heading">
            <h2>Filter users</h2>
            {(status || role) && (
              <button
                className="clear-button"
                onClick={() => {
                  setStatus("");
                  setRole("");
                  setPage(1);
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="filter-controls">
            <label>
              Status
              <select value={status} onChange={onStatusChange}>
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <label>
              Role
              <select value={role} onChange={onRoleChange}>
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>
          </div>
        </section>

        <section className="table-card">
          {loading && <div className="table-message">Loading users...</div>}
          {error && <div className="table-message error-message">{error}</div>}

          {!loading && !error && users.length === 0 && (
            <div className="table-message">No users match these filters.</div>
          )}

          {!error && users.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar">
                            {user.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td className="email-cell">{user.email}</td>
                      <td>
                        <span className={`badge ${user.status}`}>
                          <span className="badge-dot" />
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="pagination">
            <span>
              Page {pagination.page} of {pagination.total_pages || 1}
            </span>

            <div className="pagination-buttons">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((current) => current + 1)}
                disabled={!pagination.has_next_page || loading}
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}