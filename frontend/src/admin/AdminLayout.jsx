import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#0f172a" 
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <div style={{ padding: "24px", flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}