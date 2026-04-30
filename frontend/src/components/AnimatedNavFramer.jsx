import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
    expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    collapsed: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 0.15,
      }
    },
}

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = useState(true);
  const { user, logout, isAdmin, isEmployee } = useAuth();
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollPositionOnCollapse = useRef(0);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest; 
    } 
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }
    
    lastScrollY.current = latest;
  });

  const handleNavClick = (e) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const navItems = [];
  
  if (!isEmployee()) {
    if (isAdmin()) navItems.push({ name: "Dashboard", href: "/dashboard" });
    navItems.push({ name: "Products", href: "/products" });
    navItems.push({ name: "Cart", href: "/cart" });
    navItems.push({ name: "Wishlist", href: "/wishlist" });
    navItems.push({ name: "Orders", href: "/orders" });
    navItems.push({ name: "Refunds", href: "/refunds" });
  }

  if (isEmployee()) {
    navItems.push({ name: "My Dashboard", href: "/employee-dashboard" });
    navItems.push({ name: "Leave Requests", href: "/leaves" });
  }

  if (isAdmin()) {
    navItems.push({ divider: true });
    navItems.push({ name: "Staff", href: "/admin/staff" });
    navItems.push({ name: "Leaves", href: "/leaves" });
    navItems.push({ name: "Categories", href: "/categories" });
    navItems.push({ name: "Manage Products", href: "/admin/products" });
    navItems.push({ name: "Coupons", href: "/coupons" });
  }

  return (
    <div className="animated-nav-wrapper">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={`animated-nav-container ${!isExpanded ? 'is-collapsed' : ''}`}
      >
        <motion.div variants={logoVariants} className="nav-logo">
          <Navigation className="nav-logo-icon" />
        </motion.div>
        
        <motion.div className={`nav-links-wrapper ${!isExpanded ? 'pointer-disabled' : ''}`}>
          {navItems.map((item, idx) => {
            if (item.divider) {
              return <motion.div key={`div-${idx}`} variants={itemVariants} className="nav-divider"></motion.div>;
            }
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <NavLink
                  to={item.href}
                  onClick={(e) => e.stopPropagation()}
                  className={({ isActive }) => `animated-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.name}
                </NavLink>
              </motion.div>
            );
          })}
          
          <motion.div variants={itemVariants} className="nav-divider"></motion.div>
          
          {/* User Profile */}
          <motion.div variants={itemVariants} className="nav-user-profile">
            <div className="user-avatar-sm">{getInitial(user?.name)}</div>
            <button 
              className="nav-logout" 
              onClick={(e) => { e.stopPropagation(); logout(); navigate('/login'); }}
              title="Logout"
            >
              Logout
            </button>
          </motion.div>

        </motion.div>
        
        <div className="collapsed-icon-wrapper">
          <motion.div variants={collapsedIconVariants} animate={isExpanded ? "expanded" : "collapsed"}>
            <Menu className="collapsed-icon" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
