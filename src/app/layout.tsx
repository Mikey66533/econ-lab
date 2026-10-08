import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Econ Lab — economics, made tangible",
    template: "%s · Econ Lab",
  },
  description:
    "Economics models you can play with and actually understand. An interactive learning project by Michael Galvin.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
