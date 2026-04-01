export const metadata = {
  title: "VetBot 🐾 — עוזר וטרינרי",
  description: "עוזר וטרינרי חכם למרכז וטרינרי השחר כרמיאל",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
