import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

const TABS = [
  { label: "Home",     path: "/"         },
  { label: "About",    path: "/about"    },
  { label: "Services", path: "/services" },
  { label: "Contact",  path: "/contact"  },
];

export const SlideTabs = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  const activeIdx = TABS.findIndex(t =>
    t.path === "/" ? location.pathname === "/" : location.pathname.startsWith(t.path)
  );

  return (
    <ul
      className="relative flex w-fit p-1"
      style={{ listStyle: "none", margin: 0 }}
      onMouseLeave={() => setPosition(pv => ({ ...pv, opacity: 0 }))}
    >
      {TABS.map((tab, i) => (
        <Tab
          key={tab.label}
          setPosition={setPosition}
          active={i === activeIdx}
          onClick={() => { window.scrollTo(0, 0); navigate(tab.path); }}
        >
          {tab.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
};

function Tab({ children, setPosition, active, onClick }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  return (
    <li
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      style={{
        position: "relative",
        zIndex: 10,
        cursor: "pointer",
        padding: isMobile ? "5px 8px" : "6px 14px",
        borderRadius: "9999px",
        fontFamily: "Archivo, sans-serif",
        fontSize: "12px",
        letterSpacing: "0.04em",
        userSelect: "none",
        listStyle: "none",
        color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.42)",
        mixBlendMode: "difference",
        transition: "color 150ms",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </li>
  );
}

function Cursor({ position }) {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 460, damping: 40, mass: 0.5 }}
      style={{
        position: "absolute",
        zIndex: 0,
        top: 4,
        height: "calc(100% - 8px)",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.92)",
        listStyle: "none",
        pointerEvents: "none",
      }}
    />
  );
}
