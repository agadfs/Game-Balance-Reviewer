import { Inter } from "next/font/google";
import "./globals.css";
import { MyContextProvider } from "@/src/components/context/context";
import Navbar from "@/src/components/navbar/navbbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Game Project",
  description: "Game Project",
};

export default function RootLayout({ children }) {
  return (
    <MyContextProvider>
      <html lang="en">
        <body className={inter.className}>
        <Navbar />
          {children}
        </body>
      </html>
    </MyContextProvider>
  );
}
