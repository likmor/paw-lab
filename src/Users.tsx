import { api } from "./api/api";

function Users() {
  const users = api.getUsers();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="list bg-base-100 rounded-box shadow-md">
        {users.map((user) => (
          <li key={user.id} className="list-row">
            <span className="text-sm w-8 ">#{user.id}</span>

            <span className="font-medium">
              {user.name} {user.surname}
            </span>
            <span className="text-sm ml-auto">
              {user.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Users;
