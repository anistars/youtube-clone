import { Link } from "react-router-dom";
import { HouseFill, Fire, CollectionPlay } from "react-bootstrap-icons";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <SidebarItem icon={<HouseFill />} label="Home" />
      <SidebarItem icon={<Fire />} label="Trending" />
      <SidebarItem icon={<CollectionPlay />} label="Subscriptions" />
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <Link to="/" className="sidebar-item">
      <span className="icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
