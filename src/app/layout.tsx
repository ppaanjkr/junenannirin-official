import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import UserProvider from "../context/UserProvider";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});


export const metadata: Metadata = {
  title: "Junenannirin Official",
  description: "Junenannirin Official Fanclub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className + ""}>
        <UserProvider>{children}</UserProvider>
        </body>
    </html>
  );
}
