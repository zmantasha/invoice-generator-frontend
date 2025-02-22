"use client";

import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import Button from "./Button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./navbar.module.css";
import { useUser } from "../../hooks/UserContext";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const NavBar: FC = () => {
  const [isLoggedin, setIsLoggedin] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUserProfile } = useUser();
  const dropdownRef = useRef<HTMLDivElement | null>(null);  // Type ref here

  const checkLoginStatus = () => {
    const isloggedinCookie = Cookies.get("isLoggedin");
    setIsLoggedin(isloggedinCookie || null);
  };

  useEffect(() => {
    checkLoginStatus();

    if (isLoggedin) {
      fetchUserProfile();
    }

    const interval = setInterval(() => {
      checkLoginStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedin]);

  const handleLogout = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const response = await axios.post(
        "http://localhost:8002/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.status === "success") {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("isLoggedin");
        router.push("/account/login");
        setShowDropdown(null);
        setShowMobileMenu(false);
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => (prev ? null : "dropdown"));
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowDropdown(null);  // Close dropdown when mobile menu is opened
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    
    setShowDropdown(null);
    setShowMobileMenu(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(null); // Close dropdown if clicked outside
    }
  };

  // Attach event listener when dropdown is open
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <div className={styles.leftContainer}>
          <h3 className={styles.logo}>Invoice-Generator.com</h3>

          <div
            className={`${styles.menuContainer} ${
              showMobileMenu ? styles.showMobileMenu : ""
            }`}
          >
            {isLoggedin ? (
              <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                  <Link
                    href="/user/myinvoice"
                    className={`${styles.link} ${
                      pathname === "/user/myinvoice" ? styles.active : ""
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    My Invoices
                  </Link>
                </li>
                {/* <li className={styles.menuItem}>
                  <Link
                    href="/user/setting"
                    className={`${styles.link} ${
                      pathname === "/user/setting" ? styles.active : ""
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Setting
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Button href="/user/upgrade" onClick={() => setShowMobileMenu(false)}>
                    Upgrade
                  </Button>
                </li> */}
              </ul>
            ) : (
              <ul className={styles.menuList}>
                {/* <li className={styles.menuItem}>
                  <Link
                    href="/help"
                    className={styles.link}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Help
                  </Link>
                </li> */}
                {/* <li className={styles.menuItem}>
                  <Link
                    href="/history"
                    className={styles.link}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    History
                  </Link>
                </li> */}
                {/* <li className={styles.menuItem}>
                  <Link
                    href="/guide"
                    className={styles.link}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Invoicing Guide
                  </Link>
                </li> */}
              </ul>
            )}

            <div className={styles.mobileAuth}>
              {isLoggedin ? (
                <div className={styles.dropdownContainer}>
                  <div onClick={toggleDropdown} className={styles.linkProfile}>
                    {user?.user ? `${user?.user?.firstName} ${user?.user?.lastName}` : "Profile"}
                  </div>
                  {showDropdown && (
                    <div ref={dropdownRef} className={styles.dropdownMenu}>
                      <div className={styles.dropdownProfile}>
                        <div className={styles.avatar}>{user &&  <img src={user?.user?.avatar ||"profile"} alt="Profile" className={styles.profileImage} />}</div>
                        <div>
                          <p className={styles.dropdownProfileName}>
                            {user && user?.user?.firstName}
                          </p>
                          <p className={styles.dropdownProfileEmail}>
                            {user && user?.user?.email}
                          </p>
                        </div>
                      </div>
                      <div
                        className={styles.dropdownItem}
                        onClick={() => handleNavigation("/user/myaccount")}
                      >
                        My Account
                      </div>
                      <div onClick={handleLogout} className={styles.dropdownItem}>
                        Sign Out
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <Button href="/account/login" onClick={() => setShowMobileMenu(false)}>
                    Login
                  </Button>
                  <Button href="/account/signup" onClick={() => setShowMobileMenu(false)}>
                    Signup
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
