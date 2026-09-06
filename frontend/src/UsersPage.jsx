import { useEffect, useState } from "react";

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

        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (role) params.set("role", role);
        params.set("page", String(page));
        params.set("per_page", String(pagination.per_page));

        const res = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const data = await res.json();
        setUsers(data.data);
        setPagination(data.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load users");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, [status, role, page]);

  function onStatusChange(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function onRoleChange(e) {
    setRole(e.target.value);
    setPage(1);
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Users</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select value={status} onChange={onStatusChange}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select value={role} onChange={onRoleChange}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>

        <span>
          Page {pagination.page} of {pagination.total_pages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!pagination.has_next_page || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}