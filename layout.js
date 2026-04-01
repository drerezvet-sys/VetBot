# VetBot 🐾 — מרכז וטרינרי השחר כרמיאל

עוזר וטרינרי חכם מבוסס AI לבעלי חיות מחמד.

---

## 🚀 הוראות העלאה ל-Vercel (5 דקות)

### שלב 1 — הכן חשבונות חינמיים
1. פתח חשבון ב-**[github.com](https://github.com)** (אם אין לך)
2. פתח חשבון ב-**[vercel.com](https://vercel.com)** עם אותו Gmail

### שלב 2 — העלה לGitHub
1. לחץ **"New repository"** ב-GitHub
2. שם: `vetbot`
3. גרור את כל תיקיית הפרויקט לחלון הדפדפן
4. לחץ **"Commit changes"**

### שלב 3 — חבר ל-Vercel
1. היכנס ל-vercel.com
2. לחץ **"Add New Project"**
3. בחר את ה-repository `vetbot`
4. לחץ **"Deploy"**

### שלב 4 — הוסף את מפתח ה-API
1. ב-Vercel → Project Settings → **Environment Variables**
2. הוסף משתנה:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** המפתח שלך מ-console.anthropic.com
3. לחץ **Save** ואז **Redeploy**

### שלב 5 — סיום! 🎉
קבל קישור כמו `vetbot.vercel.app` — שלח לכל מי שרוצה!

---

## 🔑 איפה מקבלים מפתח API?
1. היכנס ל-[console.anthropic.com](https://console.anthropic.com)
2. API Keys → **Create Key**
3. העתק ושמור — מוצג פעם אחת בלבד!

---

## 📁 מבנה הפרויקט
```
vetbot/
├── app/
│   ├── api/chat/route.js      ← שרת: מסתיר את מפתח ה-API
│   ├── page-components/
│   │   └── VetBot.js          ← כל לוגיקת האפליקציה
│   ├── layout.js
│   └── page.js
├── package.json
└── next.config.js
```
