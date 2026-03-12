import { NavLink } from "react-router-dom";
import type { Plant } from "../types";

export interface SidebarItem {
  label: string;
  path: string;
}

interface SidebarProps {
  plants: Plant[];
  plantId: string | null;
  onSelectPlant: (id: string) => void;
  loadingPlants: boolean;
  items: readonly SidebarItem[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({
  plants,
  plantId,
  onSelectPlant,
  loadingPlants,
  items,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const disableSelect = loadingPlants || plants.length === 0;

  return (
    <aside
      className={`relative z-20 flex-shrink-0 bg-white transition-all duration-200 ${
        collapsed ? "w-12 border-r border-slate-200" : "w-72"
      }`}
    >
      <button
        type="button"
        className="absolute right-0 top-3 z-20 flex h-7 w-7 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expandir panel" : "Colapsar panel"}
      >
        {collapsed ? "»" : "«"}
      </button>

      {!collapsed && (
        <>
          <div className="p-4">
            <select
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm"
              value={plantId ?? ""}
              onChange={(e) => onSelectPlant(e.target.value)}
              disabled={disableSelect}
            >
              {plants.length === 0 ? (
                <option value="">Sin plantas</option>
              ) : (
                plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.code ? ` (${p.code})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          <nav className="px-2 pb-4 text-sm">
            {items.map((item, idx) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 no-underline ${
                    isActive ? "bg-sky-50 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <span className="w-5 text-right text-xs text-slate-500">{idx + 1}.</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

