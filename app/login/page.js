"use client";

import { MyContext } from "@/src/components/context/context";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Login() {
  const { changeLoginToken } = useContext(MyContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const response = await fetch("/api/loginUser", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, password }),
        });

        const data = await response.json();
        if (data.success) {
          changeLoginToken(data.token);
          router.push("/home"); 
        } else {
          alert(data.message); 
        }
      }}>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
