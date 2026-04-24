import "./App.css";
import { useNavigate } from "react-router-dom";
import { api } from "./config";
import { useEffect, useState } from "react";
import { useNotifications } from "./hooks/useNotifications";
import type { Notification } from "./types";
import NotificationModal from "./NotificationModal";
import { useAuth } from "./context/authContext";

function Menu() {
  const { user, logout } = useAuth();

  const nav = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(user?.id);
  const [notification, setNotification] = useState<Notification | undefined>();

  useEffect(() => {
    if (
      notifications.map((n) => {
        if (!n.isRead && (n.priority === "high" || n.priority === "medium")) {
          setNotification(n);
        }
      })
    ) {
    }
  }, [notifications]);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {notification && (
        <NotificationModal
          visible={true}
          item={notification}
          setVisible={(v) => {
            markAsRead(notification.id);
            if (!v) setNotification(undefined);
          }}
        />
      )}
      <div className="navbar-start">
        <a
          onClick={() => {
            nav("/home");
            api.deleteActiveProject(user?.id ?? "");
          }}
          className="btn btn-ghost text-xl"
        >
          PAW
        </a>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              onClick={() => {
                nav("/home");
                api.deleteActiveProject(user?.id ?? "");
              }}
            >
              Home
            </a>
          </li>

          <li>
            <a
              onClick={() => {
                nav("/projects");
                api.deleteActiveProject(user?.id ?? "");
              }}
            >
              Projects
            </a>
          </li>
          {user?.role === "admin" && (
            <li>
              <a
                onClick={() => {
                  nav("/users");
                  api.deleteActiveProject(user?.id ?? "");
                }}
              >
                Users
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <div>
              <h1 className="text-xl">
                {user == null
                  ? "Not logged in"
                  : `Logged in as: ${user.name} ${user.surname}`}
              </h1>
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu dropdown-content bg-base-100 border-base-200 shadow"
          >
            {user && (
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            )}
          </ul>
        </div>

        <div className="dropdown dropdown-center">
          <button className="btn btn-ghost btn-circle" tabIndex={0}>
            <div className="indicator" role="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              {unreadCount > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
          <div
            className="dropdown-content card bg-base-100 w-80 shadow-md mt-2"
            tabIndex={-1}
          >
            <div className="card-body p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-200">
                <span className="">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => markAllAsRead()}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <ul className="max-h-96 overflow-y-auto">
                {notifications.length === 0 && (
                  <li className="px-4 py-6 text-center text-base-content/50 text-sm">
                    No notifications
                  </li>
                )}
                {notifications
                  .sort((a, b) => Number(b.isRead) - Number(a.isRead))
                  .slice(0, 20)
                  .reverse()
                  .map((n) => (
                    <NotificationRow
                      key={n.id}
                      item={n}
                      onClick={() => {
                        markAsRead(n.id);
                        setNotification(n);
                      }}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            className="theme-controller"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />

          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
        </label>
      </div>
    </div>
  );
}

type NotificationRowProps = {
  item: Notification;
  onClick: () => void;
};

function NotificationRow({ item, onClick }: NotificationRowProps) {
  const priorityColor = {
    high: "badge-error",
    medium: "badge-warning",
    low: "badge-ghost",
  };

  return (
    <li
      className={`flex flex-col gap-1 px-4 py-3 cursor-pointer hover:bg-base-200 border-b border-base-200 last:border-0 ${!item.isRead ? "bg-base-200/50" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm">{item.title}</span>
        <span className={`badge badge-xs ${priorityColor[item.priority]}`}>
          {item.priority}
        </span>
      </div>

      <p className="text-xs text-base-content/60">{item.message}</p>
      <span className="text-xs text-base-content/40">
        {new Date(item.date).toLocaleString()}
      </span>
      {!item.isRead && (
        <span className="w-2 h-2 rounded-full bg-primary self-end" />
      )}
    </li>
  );
}

export default Menu;
