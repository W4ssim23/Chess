import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./Providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Zt Chess",
  description: "an online chess game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
