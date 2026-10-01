import { Bell, ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../utils/storage";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = getStoredUser<{ name?: string; userId?: string }>();
  function logout() { clearAuth(); navigate("/login", { replace: true }); }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="sidebar__brand"><div className="brand-mark">P</div><span>PrepRoute</span></div>
      <nav className="sidebar__nav">
        <NavLink to="/dashboard" className={({isActive}) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}><LayoutDashboard size={19}/>Dashboard</NavLink>
        <NavLink to="/tests/create" className={({isActive}) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}><ClipboardList size={19}/>Test Creation</NavLink>
        <button className="sidebar__link sidebar__link--disabled" disabled><ClipboardList size={19}/>Test Tracking</button>
      </nav>
      <button className="sidebar__logout" onClick={logout}><LogOut size={18}/>Logout</button>
    </aside>
    <div className="app-main">
      <header className="topbar"><div className="topbar__spacer"/><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button><div className="profile"><div className="profile__avatar">{(user?.name || user?.userId || "A").charAt(0).toUpperCase()}</div><div className="profile__info"><strong>{user?.name || user?.userId || "Admin"}</strong><span>Administrator</span></div></div></header>
      <main className="page-content"><Outlet/></main>
    </div>
  </div>;
}
