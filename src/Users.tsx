import { useState } from "react";
import { api } from "./api/api";
import { roles, type Role, type User } from "./types";

function Users() {
  const [users, setUsers] = useState<User[]>(api.getUsers());

  const handleRoleChange = (user: User, role: Role) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, role } : u));
    api.updateUser({ ...user, role });
  };

  const handleBanChange = (user: User, banned: boolean) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, banned } : u));
    api.updateUser({ ...user, banned });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {users.map((user) => (
          <li key={user.id} className="list-row">
            <span className="text-sm  ">#{user.id}</span>

            <span className="font-medium">
              {user.name} {user.surname}
            </span>
            <select
              className="select select-bordered select-sm font-medium w-32"
              value={user.role}
              onChange={(e) => handleRoleChange(user, e.target.value as Role)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <label className="label cursor-pointer ml-4">
              <span className="label-text mr-2">Ban</span>
              <input
                type="checkbox"
                className="checkbox checkbox-error"
                checked={user.banned}
                onChange={(e) => handleBanChange(user, e.target.checked)}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Users;
