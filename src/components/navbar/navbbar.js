"use client";
import { useContext, useEffect } from "react";
import styles from "./navbar.module.css";
import { MyContext } from "../context/context";

export default function Navbar() {
  const { loggedData, logout } = useContext(MyContext);


  return (
    <div className={styles.navbarbody}>
      <div>
        <div>{loggedData ? 
            <button onClick={() => {
              logout();
              window.location.reload(); 
            }} >
                Logout
            </button> : 
            <div>
                Please Login to see the content {loggedData}
            </div>
            }
        </div>
      </div>
    </div>
  );
}
