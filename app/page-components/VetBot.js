"use client";
import { useState, useRef, useEffect } from "react";

/* ─── צבעים ─── */
const C = {
  cream:     "#F0F4FA",
  sand:      "#D0DCF0",
  bark:      "#4A6FA5",
  forest:    "#1B3A6B",
  sage:      "#2A5298",
  mint:      "#C8DAFF",
  white:     "#FFFFFF",
  charcoal:  "#1E1E1E",
  rust:      "#C4622D",
  gold:      "#D4A853",
  red:       "#C0392B",
  lightSage: "#E8EFF9",
  paleGold:  "#FDF4E3",
  paleRust:  "#FEE9E0",
  paleRed:   "#FDECEA",
};

const SERVICES = [
  { name: "🧬 אונקולוגיה ואלקטרוכמותרפיה (אלקטרו-ווט)", url: "https://karmielvetcenter.com/services/%d7%90%d7%9c%d7%a7%d7%98%d7%a8%d7%95%d7%95%d7%98-%d7%90%d7%95%d7%a0%d7%a7%d7%95%d7%9c%d7%95%d7%92%d7%99%d7%94/" },
  { name: "🦷 טיפולי שיניים וחלל הפה", url: "https://karmielvetcenter.com/services/%d7%98%d7%99%d7%a4%d7%95%d7%9c%d7%99-%d7%a9%d7%99%d7%a0%d7%99%d7%99%d7%9d-%d7%9c%d7%97%d7%99%d7%95%d7%aa-%d7%9e%d7%97%d7%9e%d7%93/" },
  { name: "🔍 אנדוסקופיה והדמיה מתקדמת", url: "https://karmielvetcenter.com/services/%d7%90%d7%a0%d7%93%d7%95%d7%a1%d7%a7%d7%95%d7%a4%d7%99%d7%94/" },
  { name: "🩺 כירורגיה ואורתופדיה", url: "https://karmielvetcenter.com/services/%d7%9b%d7%99%d7%a8%d7%95%d7%a8%d7%92%d7%99%d7%94-%d7%95%d7%90%d7%95%d7%a8%d7%98%d7%95%d7%a4%d7%93%d7%99%d7%94/" },
  { name: "🛡️ חיסונים וטיפולים מונעים", url: "https://karmielvetcenter.com/services/%d7%97%d7%99%d7%a1%d7%95%d7%a0%d7%99%d7%9d-%d7%95%d7%98%d7%99%d7%a4%d7%95%d7%9c%d7%99%d7%9d-%d7%9e%d7%95%d7%a0%d7%a2%d7%99%d7%9d/" },
  { name: "🧪 בדיקות מעבדה", url: "https://karmielvetcenter.com/services/%d7%91%d7%93%d7%99%d7%a7%d7%95%d7%aa-%d7%9e%d7%a2%d7%91%d7%93%d7%94/" },
  { name: "🌿 דרמטולוגיה ועור", url: "https://karmielvetcenter.com/services/%d7%93%d7%a8%d7%9e%d7%98%d7%95%d7%9c%d7%95%d7%92%d7%99%d7%94-%d7%a2%d7%95%d7%a8/" },
];

const CLINIC = {
  name:            "מרכז וטרינרי השחר",
  city:            "כרמיאל",
  phone:           "04-9982808",
  whatsapp:        "0587350700",
  whatsappDisplay: "058-7350700",
  address:         "מבצע נחשון 4, כרמיאל",
  maps:            "https://maps.google.com/?q=מבצע+נחשון+4+כרמיאל",
  waze:            "https://waze.com/ul?q=מבצע+נחשון+4+כרמיאל&navigate=yes",
  hours: [
    { days: "א׳, ב׳, ד׳, ה׳", times: "09:00–13:00 | 17:00–20:00" },
    { days: "ו׳ וערבי חג",    times: "10:00–13:00" },
    { days: "ג׳",             times: "סגור" },
  ],
};

const REFERRAL = {
  routine:   { title: `צור קשר עם ${CLINIC.name}`, desc: `מומלץ לבצע בדיקה מקצועית. ניתן לפנות ל${CLINIC.name} ב${CLINIC.city}.`, color: C.gold, bg: C.paleGold },
  urgent:    { title: `פנה היום ל${CLINIC.name}`, desc: `צור קשר עם ${CLINIC.name} ב${CLINIC.city} בהקדם האפשרי.`, color: C.rust, bg: C.paleRust },
  emergency: { title: `חירום — פנה עכשיו ל${CLINIC.name}!`, desc: `ייתכן שמדובר במצב חירום רפואי. ${CLINIC.name} ב${CLINIC.city} — פנה עכשיו!`, color: C.red, bg: C.paleRed },
};

const QUICK = [
  "לא אוכל/ת", "הקאות", "שלשולים", "עייפות / חולשה",
  "מתגרד/ת הרבה", "צולע/ת", "שותה הרבה מים",
  "הפרשה מהעיניים", "עיטושים / שיעול", "בטן נפוחה",
];

const SYSTEM_PROMPT = `אתה VetBot — עוזר וטרינרי חכם ואמפתי המדבר עברית. אתה עוזר לבעלי חיות מחמד בישראל: כלבים, חתולים, אוגרים, ארנבים, חמוסים, ציפורים, דגים וחיות מחמד קטנות אחרות.

חוקים:
1. **שאל שאלה אחת בלבד** בכל הודעה — השאלה הכי חשובה לאבחון. אל תשאל רשימה של שאלות. **חריג:** במקרי חירום ברורים (קריסה, אובדן הכרה, חסימת שתן בחתול, הרעלה ידועה) — אל תשאל שאלות, פנה לחירום מיד.
2. אחרי לכל היותר 2 סבבי שאלה-תשובה — תן הערכה והנחיה ברורה, גם אם המידע חלקי.
3. **פנייה ניטרלית תמיד:** השתמש תמיד ב"אתה/את", "שמת לב", "הבחנת" — לעולם לא "אתה" בלבד או "את" בלבד, אלא אם המשתמש גילה את מינו.
4. תן טיפים קצרים לטיפול ביתי לבעיות קלות.
5. **חירום מוחלט — פנה מיד ללא שאלות:** קריסה/אובדן הכרה, קשיי נשימה חריפים, עוויתות, חסימת שתן בחתול (מנסה להשתין ולא יוצא כלום — חירום תוך שעות!), חניכיים חיוורות/כחולות, חשד להרעלה, פצעים עמוקים/פעורים, הידרדרות מהירה מאוד.
5b. **הרעלה:** אל תמליץ לגרום להקאה ללא הנחיית ווטרינר — זה עלול להזיק. הפנה לחירום מיד.
5c. **הקאות — הבחנה חשובה:** הקאה בודדת עם תיאבון תקין = low urgency, מעקב בית. הקאות חוזרות (3+ פעמים), דם בהקאה, חולשה נלווית = high/emergency.
6. המלץ על ביקור רגיל לבעיות קלות שחוזרות.
7. אל תאבחן סופית — אתה עוזר AI.
8. **מין החיה — שאל במהלך השיחה:** אל תשאל על מין בהתחלה. כאשר הפונה מתאר סימנים — אם המין לא ידוע עדיין ורלוונטי רפואית — שאל "האם מדובר בזכר או נקבה?" כשאלת ההמשך הראשונה שלך. אם הפונה כבר ציין את המין — אל תשאל שוב.
8b. **הפניה — המתן לתשובה:** כשאתה רוצה להפנות, שאל תחילה: "האם תרצה/י את פרטי המרפאה?" — ואז **עצור**. שלח referralType שאינו "none" **רק** בהודעה הבאה, לאחר שהפונה ענה. לא באותה הודעה שבה שאלת!
8c. **timeout — אם אין תגובה:** אם שאלת על פרטי המרפאה ולא קיבלת תגובה תוך זמן מה, הבוט יוסיף אוטומטית הודעה עם הכרטיס (מטופל בקוד, לא עלייך).
8d. סיים כל תשובה עם הבלוק הנסתר הזה בדיוק:
   <!--VETBOT_META:{"urgency":"none|low|medium|high|emergency","referral":true|false,"referralType":"none|routine|urgent|emergency"}-->
9. אם יש ספק — המלץ לבדוק אצל ווטרינר.
10. תשובות קצרות וממוקדות — אל תאריך.
10b. **שינוי חיה באמצע שיחה:** אם המשתמש מזכיר חיה שונה מזו שנבחרה בהתחלה — עבור מיד לחיה החדשה ועדכן את ההמלצות בהתאם.
10e. **פיומטרה — מודעות גבוהה:** בנקבות לא מעוקרות (כלבות וחתולות), **שתייה מוגברת יכולה להיות הסימן הכמעט יחיד לפיומטרה** — גם בהיעדר הפרשה, חולשה, או חום. פיומטרה היא חירום מסכן חיים. אם נקבה לא מעוקרת שותה הרבה — שאל על מחזור/ייחום אחרון וקצב שתייה, ושקול הפניה דחופה.
10c. **ציפורים וחיות קטנות (אוגר, ארנב, חמוס):** הידע שלי מוגבל יחסית לכלבים/חתולים. הפנה מוקדם יותר לווטרינר, אל תנחש אבחנות. ציפור שלא אוכל יומיים = ביקור ווטרינר דחוף.
10d. **מוות של חיית מחמד:** אם המשתמש מדווח שהחיה מתה — הגב בחמלה ואמפתיה בלבד. אל תשאל שאלות רפואיות. לדוגמה: "אני מצטער מאוד לשמוע על אובדן החיה שלך 💙 זה כואב מאוד."
11. **ייחום בחתולות:** השתמש תמיד במילה "ייחום" — לא "חום", לא "אסטרוס". אם בעלים שואל על חתולה בייחום — הסבר שזה תקין לחלוטין ואין סכנה. ניתן ואף מומלץ לעקר חתולה גם כשהיא בייחום. הפנה להתקשר למרכז וטרינרי השחר בכרמיאל לקביעת תור לעיקור. השתמש ב-referralType: "routine".
12. **מילות מקצוע — חובה מוחלטת:** המילה "שד" או "שדיים" אסורה לחלוטין — תמיד השתמש ב"עטין" או "עטינים". המילה "חום" בהקשר מיני אסורה — תמיד השתמש ב"ייחום". המילה "אסטרוס" אסורה — תמיד "ייחום". אם תכתוב "שד" או "שדיים" זו שגיאה חמורה.
12b. **פרטי קשר — חובה מוחלטת:** טלפון: 04-9982808 בלבד. וואטסאפ: 058-7350700 בלבד. אסור להמציא כל מספר אחר. כשמישהו שואל על וואטסאפ — תן את המספר 058-7350700 ישירות.
13. **פרטי המרכז — חובה לדעת ולענות בביטחון:**
   - **שם:** מרכז וטרינרי השחר
   - **כתובת:** מבצע נחשון 4, כרמיאל
   - **טלפון:** 04-9982808
   - **וואטסאפ:** 058-7350700
   - **שעות פעילות:** א׳, ב׳, ד׳, ה׳ — 09:00–13:00 ו-17:00–20:00 | ו׳ וערבי חג — 10:00–13:00 | ג׳ (יום שלישי) — **סגור לחלוטין**
   - **ניווט:** Waze / Google Maps — "מרכז וטרינרי השחר כרמיאל"
   כאשר שואלים על כתובת, שעות, וואטסאפ, טלפון, ניווט — ענה ישירות מהמידע הזה ללא היסוס. אל תגיד "אני לא מוצא" — המידע כאן.

13b. **ד"ר ארז כהן — פרופיל מקצועי:** ד"ר ארז כהן הוא מומחה ABVP אמריקאי-ישראלי ברפואת כלבים וחתולים, ומוסמך באונקולוגיה וטרינרית. בעל ניסיון של למעלה מ-20 שנה בכירורגיה (מאז 2004), מרצה ומדריך בתחום רפואת שיניים וטרינרית, ומומחה באנדוסקופיה, אונקולוגיה וכירורגיה מורכבת.

14. **שירותי המרכז — פירוט מלא:**

   **🦷 טיפולי שיניים וחלל הפה:**
   המרכז מציע טיפולי שיניים מתקדמים הכוללים: בדיקה קלינית מקדימה, הרדמה ובדיקות דם, **צילום שיניים דיגיטלי (רנטגן דנטלי) ברזולוציה גבוהה**, ניקוי יסודי ועקירות כירורגיות. סימנים לבעיות שיניים: ריח פה לא נעים, אדמומיות, דימום, אכילה חד-צדדית, הפלת כופתיות. המרכז מקבל הפניות ממרפאות אחרות. **כן, יש צילום דנטלי במרכז.**

   **🔍 אנדוסקופיה והדמיה מתקדמת:**
   ציוד PENTAX לגסטרוסקופיה, ברונכוסקופיה ורינוסקופיה. כולל: אבחון תולעת הפארק בוושט, הוצאת גופים זרים מהקיבה, אבחון תהליכים בדרכי הנשימה ובחלל האף. בנוסף: רנטגן דיגיטלי (DR) ואולטרסונוגרפיה עם אקו-דופלר (Mindray Vetus E7).

   **🩺 כירורגיה ואורתופדיה:**
   ד"ר ארז כהן מבצע ניתוחים מאז 2004 עם ניטור מלא (לחץ דם, חמצן, טמפרטורה, הרדמה בגז). כולל: תיקון סיבוב קיבה (GDV חירום), הסרת תעלת אוזן (TECA), P/U בחתולים, כריתת טחול, הסרת גידולי לסת, תיקון הרניה פרינאלית, תיקון שברים, קרע רצועה צולבת, אנטרופיון, Cherry Eye, כיב בוקסר, עיקורים וסירוסים, הסרת גידולים עוריים (לאחר ציטולוגיה/היסטולוגיה).

   **🧪 בדיקות מעבדה:**
   מעבדה מתקדמת במקום — תשובות תוך 15 דקות. כולל: ספירת דם (CBC), ביוכימיה + תפקודי כבד וכליה, בדיקות הורמונליות (T4 לבלוטת תריס), בדיקות שתן וצואה, ציטולוגיה (שאיבה מגושים, קשרי לימפה, נוזלים) — בשילוב אולטרסאונד בזמן אמת.

   **🌿 דרמטולוגיה ועור:**
   אבחון ציטולוגי במקום. מטפלים ב: אלרגיה אטופית, אלרגיה לפרעושים (FAD), אלרגיה למזון, בעיות עור הורמונליות. כלי אבחון: מגרד עורי, ציטולוגיה, מנורת Wood, ביופסיות עור, בדיקות הורמונליות.

   **🛡️ חיסונים וטיפולים מונעים:** חיסונים שגרתיים, טיפול נגד פרעושים/קרציות/תולעים.
15. **אונקולוגיה ואלקטרוכמותרפיה (ECT) — מומחיות מרכזית של השחר:**
   אלקטרו-ווט היא מחלקה ייחודית במרכז וטרינרי השחר, בניהול **ד"ר ארז כהן, מומחה ABVP אמריקאי-ישראלי ברפואת כלבים וחתולים ומוסמך באונקולוגיה וטרינרית**.
   
   **מהי אלקטרוכמותרפיה (ECT)?** טיפול חדשני המשלב כימותרפיה עם פולסים חשמליים — מגביר חדירת התרופה לתאי הגידול בצורה ממוקדת, עם פגיעה מינימלית ברקמה בריאה.
   
   **מתי ECT מתאימה?**
   - SCC (קרצינומה של תאי קשקש) באף או אוזניים של חתולים
   - גידולי רקמה רכה (STS)
   - קרצינומות נזליות (בחלל האף)
   - גידולים בחלל הפה
   - גידולי תאי מאסט באזורים מורכבים (פי הטבעת, גפיים תחתונות)
   - גידולים שאינם נתיחים או שהסרתם תפגע בתפקוד/מראה
   
   **עיקרון חשוב:** ככל שהגידול קטן יותר (פחות מ-3 ס"מ) — סיכויי ההצלחה גבוהים יותר. לכן **זיהוי מוקדם הוא קריטי**.
   ניתן לשלב ECT עם ניתוח — במהלכו או מיד אחריו — להפחתת סיכון לחזרת הגידול.
   
   המרכז מציע גם **פרוטוקולי כימותרפיה מותאמים אישית** במגוון סוגי סרטן, במטרה לספק איכות חיים, שליטה במחלה והארכת חיים ללא סבל מיותר.
   
   **סרטן זה לא סוף פסוק** — אם בעלים שואל על גידול, נפיחות חשודה, סרטן, כימותרפיה, ECT או אלקטרוכמותרפיה — הסבר בחום על האפשרויות והפנה בדחיפות לייעוץ במרכז (referralType: "urgent").
16. **גיל עיקור/סירוס בכלבים — על פי מחקר Hart et al. 2020 (UC Davis, 35 גזעים):**
   - **כלבים קטנים** (יורקשייר, צ'יוואווה, מלטז, פומרניאן, פאג, דאקשונד, קורגי וכד'): אין סיכון מוגבר למחלות מפרקים עם עיקור בכל גיל — ניתן לעקר לפי שיקול הבעלים.
   - **גולדן רטריבר זכר**: מומלץ להמתין מעבר לשנה. **גולדן רטריבר נקבה**: מומלץ להשאיר שלמה או לעקר בגיל שנה ולעקוב אחר סרטן.
   - **לברדור זכר**: מומלץ להמתין מעבר ל-6 חודשים. **לברדור נקבה**: מומלץ להמתין מעבר לשנה.
   - **רועה גרמני (זכר ונקבה)**: מומלץ להמתין מעבר לשנתיים.
   - **רוטוויילר זכר**: מומלץ מעבר לשנה. **רוטוויילר נקבה**: מומלץ מעבר ל-6 חודשים.
   - **גזעים גדולים אחרים** (בוקסר, ברנז מאונטן דוג, בורדר קולי): מומלץ להמתין לפחות שנה ולהתייעץ עם ווטרינר.
   - **עיקור מוקדם מדי** (לפני 6 חודשים) בגזעים בינוניים-גדולים עלול להגביר סיכון לדיספלזיה, קרע ברצועת הצלב, ובחלק מהגזעים גם סרטן.
   - תמיד המלץ להתייעץ עם הווטרינר לגבי הגזע הספציפי, המין והמצב הבריאותי של הכלב.`;

function parseMeta(text) {
  const m = text.match(/<!--VETBOT_META:(.*?)-->/);
  if (m) { try { return JSON.parse(m[1]); } catch {} }
  return null;
}
function cleanText(t) { return t.replace(/<!--VETBOT_META:.*?-->/g, "").trim(); }
function nowTime() { return new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }); }

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"13px 16px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:8, height:8, borderRadius:"50%", background: C.bark,
          animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s`
        }}/>
      ))}
    </div>
  );
}

function ReferralCard({ type }) {
  if (!type || type === "none") return null;
  const r = REFERRAL[type];
  if (!r) return null;
  const waNumber = "972" + CLINIC.whatsapp.replace(/^0/, "");
  return (
    <div style={{ marginTop:10, background:r.bg, border:`2px solid ${r.color}`, borderRadius:14, padding:"13px 15px" }}>
      <div style={{ fontWeight:800, color:r.color, fontSize:14, marginBottom:4 }}>⚕️ {r.title}</div>
      <div style={{ fontSize:13, color:C.charcoal, lineHeight:1.55, marginBottom:6 }}>{r.desc}</div>
      <div style={{ fontSize:12, color:C.bark, marginBottom:6 }}>
        📍 {CLINIC.address} &nbsp;|&nbsp; 📞 {CLINIC.phone} &nbsp;|&nbsp; 💬 {CLINIC.whatsappDisplay}
      </div>
      <div style={{ background:"rgba(0,0,0,0.04)", borderRadius:8, padding:"7px 10px", marginBottom:10, fontSize:12, color:C.charcoal, lineHeight:1.8 }}>
        🕐 <strong>שעות פתיחה:</strong><br/>
        {CLINIC.hours.map((h,i) => (
          <span key={i} style={{ display:"block", paddingRight:16 }}>
            <strong>{h.days}:</strong> {h.times}
          </span>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button onClick={() => window.open(`tel:${CLINIC.phone}`)} style={{ background:r.color, color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>📞 התקשר</button>
        <button onClick={() => window.open(`https://wa.me/${waNumber}`, "_blank")} style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>💬 וואטסאפ</button>
        <button onClick={() => window.open(CLINIC.waze, "_blank")} style={{ background:"#05C8F7", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>🚗 Waze</button>
        <button onClick={() => window.open(CLINIC.maps, "_blank")} style={{ background:"transparent", color:r.color, border:`1.5px solid ${r.color}`, borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>🗺️ מפות</button>
        <button onClick={() => window.open("https://karmielvetcenter.com/service/", "_blank")} style={{ background:"transparent", color:"#555", border:"1.5px solid #ccc", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>🏥 כל השירותים</button>
      </div>
    </div>
  );
}

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  const text = msg.display || msg.content;
  const parts = text.split(/(\*\*[^*]+\*\*)/g).map((p,i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2,-2)}</strong> : p
  );
  return (
    <div style={{ display:"flex", flexDirection: isUser ? "row" : "row-reverse", gap:9, marginBottom:18, alignItems:"flex-start" }}>
      <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0, background: isUser ? C.bark : C.forest, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
        {isUser ? "🧑" : "🐾"}
      </div>
      <div style={{ maxWidth:"78%" }}>
        <div style={{ background: isUser ? C.bark : C.white, color: isUser ? "#fff" : C.charcoal, borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding:"12px 15px", fontSize:14.5, lineHeight:1.7, boxShadow:"0 2px 12px rgba(0,0,0,0.07)", border: isUser ? "none" : `1px solid ${C.sand}`, whiteSpace:"pre-wrap", textAlign:"right", direction:"rtl" }}>
          {parts}
        </div>
        {!isUser && msg.meta && msg.meta.referralType !== "none" && (
          <div style={{ textAlign:"right" }}>
            <ReferralCard type={msg.meta.referralType} />
          </div>
        )}
        <div style={{ fontSize:11, color:C.bark, marginTop:4, opacity:0.65, textAlign: isUser ? "left" : "right" }}>{msg.time}</div>
      </div>
    </div>
  );
}

export default function VetBot() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [pet, setPet]             = useState("כלב");
  const [otherPet, setOtherPet]   = useState("");
  const [petName, setPetName]     = useState("");
  const [started, setStarted]     = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const sessionId    = useRef(null);
  const sessionData  = useRef({ pet:"", petName:"", messages:[], maxUrgency:"none", referralType:"none" });
  const timeoutRef   = useRef(null);

  // צור session ID ייחודי
  function getSessionId() {
    if (!sessionId.current) {
      sessionId.current = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }
    return sessionId.current;
  }

  // שמור שיחה ב-Google Sheets
  async function saveSession(reason) {
    const sd = sessionData.current;
    if (sd.messages.length === 0) return;
    if (sd.saved) return; // כבר נשמר — אל תשמור שוב
    sd.saved = true;
    const transcript = sd.messages.map(m =>
      `[${m.role === "user" ? "בעלים" : "VetBot"}]: ${m.display || m.content}`
    ).join("\n");
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          date: new Date().toLocaleDateString("he-IL"),
          time: new Date().toLocaleTimeString("he-IL", { hour:"2-digit", minute:"2-digit" }),
          pet: sd.pet,
          petName: sd.petName,
          transcript: transcript.substring(0, 3000),
          maxUrgency: sd.maxUrgency,
          referralType: sd.referralType,
          closeReason: reason,
          messageCount: sd.messages.filter(m => m.role === "user").length,
        }),
      });
    } catch (e) { console.error("Log error:", e); }
  }

  // Reset timeout בכל פעולה
  function resetTimeout() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => saveSession("timeout"), 10 * 60 * 1000); // 10 דקות
  }

  // שמור בסגירת דפדפן
  useEffect(() => {
    const handleUnload = () => saveSession("closed");
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  function startChat() {
    const petLabel = pet === "אחר" ? (otherPet.trim() || "חיית המחמד שלך") : pet;
    const name = petName.trim() || petLabel;
    // אתחל session
    getSessionId();
    sessionData.current = { pet: petLabel, petName: petName.trim(), messages:[], maxUrgency:"none", referralType:"none", saved: false };
    resetTimeout();
    const greeting = `שלום! אני VetBot 🐾 — העוזר הווטרינרי החכם שלך.\n\nאני כאן לעזור לך עם ${name} ולהנחות אותך בצעדים הבאים.\n\nמה הסימפטומים או הדאגות שאתה/את מבחין/ה ב${name} היום?`;
    const greetMsg = { role:"assistant", content:greeting, display:greeting, time:nowTime(), meta:null };
    sessionData.current.messages.push(greetMsg);
    setMessages([greetMsg]);
    setStarted(true);
  }

  async function sendMsg(override) {
    const text = override || input.trim();
    if (!text || loading) return;
    setInput("");
    setShowChips(false);

    const userMsg = { role:"user", content:text, display:text, time:nowTime(), meta:null };
    const updated = [...messages, userMsg];
    setMessages(updated);
    sessionData.current.messages.push(userMsg);
    resetTimeout();
    setLoading(true);

    const petLabel = pet === "אחר" ? (otherPet.trim() || "חיית מחמד") : pet;
    const apiMsgs = updated.map((m,i) => ({
      role: m.role,
      content: i === 0 ? `לבעלים יש ${petLabel}${petName ? ` בשם ${petName}` : ""}. ` + m.content : m.content,
    }));

    try {
      // ← קורא ל-API route הפנימי — המפתח נשאר בשרת בלבד
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "מצטער, לא הצלחתי לעבד את הבקשה. נסה שוב.";
      const meta = parseMeta(raw);
      const botMsg = { role:"assistant", content:raw, display:cleanText(raw), time:nowTime(), meta };
      setMessages(prev => [...prev, botMsg]);
      // עדכן session data
      sessionData.current.messages.push(botMsg);

      // אם הבוט שאל על פרטי המרפאה — הצג כרטיס אוטומטי אחרי 45 שניות ללא תגובה
      if (meta && meta.referralType === "none" && cleanText(raw).includes("פרטי המרפאה")) {
        setTimeout(() => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            // הוסף כרטיס רק אם המשתמש לא ענה עדיין
            if (last && last.role === "assistant") {
              const reminderMsg = {
                role: "assistant",
                content: "נראה שלא קיבלנו תגובה — הנה פרטי המרפאה לנוחיותך:",
                display: "נראה שלא קיבלנו תגובה — הנה פרטי המרפאה לנוחיותך:",
                time: nowTime(),
                meta: { urgency: meta.urgency || "low", referral: true, referralType: "routine" }
              };
              return [...prev, reminderMsg];
            }
            return prev;
          });
        }, 45000);
      }
      if (meta) {
        const urgencyOrder = ["none","low","medium","high","emergency"];
        if (urgencyOrder.indexOf(meta.urgency) > urgencyOrder.indexOf(sessionData.current.maxUrgency)) {
          sessionData.current.maxUrgency = meta.urgency;
        }
        if (meta.referralType && meta.referralType !== "none") {
          sessionData.current.referralType = meta.referralType;
          // שמור מיד כשיש referral
          saveSession("referral");
          // התחל session חדש להמשך השיחה
          sessionId.current = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
          sessionData.current = {
            pet: sessionData.current.pet,
            petName: sessionData.current.petName,
            messages: [],
            maxUrgency: "none",
            referralType: "none",
            saved: false,
          };
          resetTimeout();
        }
      }
      resetTimeout();
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"בעיית חיבור. בדוק את האינטרנט ונסה שוב.", display:"בעיית חיבור. בדוק את האינטרנט ונסה שוב.", time:nowTime(), meta:null }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  const PetBtn = ({ value, emoji }) => (
    <button onClick={() => setPet(value)} style={{ flex:1, padding:"11px 8px", borderRadius:30, border:`2px solid ${pet===value ? C.forest : C.sand}`, background: pet===value ? C.forest : C.white, color: pet===value ? C.mint : C.charcoal, fontSize:15, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
      {emoji} {value}
    </button>
  );

  return (
    <div dir="rtl" style={{ minHeight:"100dvh", background:C.cream, fontFamily:"'Segoe UI', Tahoma, sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; }
        textarea:focus,input:focus { outline:none; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:${C.sand}; }
        ::-webkit-scrollbar-thumb { background:${C.bark}; border-radius:3px; }
      `}</style>

      {/* כותרת */}
      <div style={{ background:C.forest, padding:"10px 20px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 4px 20px rgba(0,0,0,0.18)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.mint, animation:"pulse 2s infinite" }}/>
          <span style={{ fontSize:12, color:C.mint }}>מחובר</span>
        </div>
        <div style={{ textAlign:"center", flex:1 }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:19, fontWeight:900, color:"#fff" }}>VetBot 🐾</div>
          <div style={{ fontSize:11, color:"rgba(200,220,255,0.75)" }}>יועץ AI וטרינרי</div>
        </div>
        <img
          src="https://karmielvetcenter.com/wp-content/uploads/2025/07/Untitled-8-2-1024x243.png"
          alt="מרכז וטרינרי השחר"
          style={{ height:38, objectFit:"contain", borderRadius:6 }}
        />
      </div>

      {/* מסך פתיחה */}
      {!started && (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:22 }}>
          <div style={{ background:C.white, borderRadius:24, padding:"36px 26px", maxWidth:440, width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:`1px solid ${C.sand}`, animation:"fadeUp 0.5s ease", textAlign:"center", direction:"rtl" }}>
            <div style={{ fontSize:52, marginBottom:10 }}>🐶🐱</div>
            <div style={{ fontFamily:"Georgia, serif", color:C.forest, fontSize:26, fontWeight:900, marginBottom:8 }}>ברוכים הבאים ל-VetBot</div>
            <div style={{
              display:"inline-block",
              background:`linear-gradient(135deg, ${C.forest}, ${C.sage})`,
              color:"#fff",
              fontSize:13, fontWeight:600,
              borderRadius:20, padding:"5px 16px",
              marginBottom:16, letterSpacing:0.3,
            }}>
              יועץ AI וטרינרי של מרכז וטרינרי השחר, כרמיאל
            </div>
            <div style={{ color:C.bark, fontSize:14, lineHeight:1.7, marginBottom:26 }}>
              תאר את הסימפטומים של חיית המחמד שלך וקבל הנחיות מהירות.<br/>
              נגיד לך מתי צריך ווטרינר — ומתי אפשר להמתין.
            </div>

            <div style={{ fontWeight:700, color:C.charcoal, fontSize:14, marginBottom:10, textAlign:"right" }}>איזה חיית מחמד יש לך?</div>
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              <PetBtn value="חתול" emoji="🐱" />
              <PetBtn value="כלב"  emoji="🐶" />
            </div>
            <div style={{ display:"flex", gap:10, marginBottom: pet === "אחר" ? 10 : 22 }}>
              <PetBtn value="אחר" emoji="🐹" />
            </div>
            {pet === "אחר" && (
              <input value={otherPet} onChange={e => setOtherPet(e.target.value)} placeholder="למשל: אוגר, ארנב, חמוס, ציפור..."
                style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`2px solid ${C.sand}`, background:C.cream, fontSize:15, color:C.charcoal, marginBottom:22, textAlign:"right", direction:"rtl", fontFamily:"'Segoe UI', Tahoma, sans-serif", transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor=C.forest} onBlur={e=>e.target.style.borderColor=C.sand}
              />
            )}

            <div style={{ fontWeight:700, color:C.charcoal, fontSize:14, marginBottom:8, textAlign:"right" }}>שם חיית המחמד (אופציונלי)</div>
            <input value={petName} onChange={e => setPetName(e.target.value)} onKeyDown={e => e.key==="Enter" && startChat()}
              placeholder={pet==="כלב" ? "למשל: בודי, מקס, רקס..." : "למשל: לונה, מיטי, נמר..."}
              style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`2px solid ${C.sand}`, background:C.cream, fontSize:15, color:C.charcoal, marginBottom:22, textAlign:"right", direction:"rtl", fontFamily:"'Segoe UI', Tahoma, sans-serif", transition:"border-color 0.2s" }}
              onFocus={e=>e.target.style.borderColor=C.forest} onBlur={e=>e.target.style.borderColor=C.sand}
            />

            <button onClick={startChat} style={{ width:"100%", padding:15, background:C.forest, color:C.mint, border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", fontFamily:"Georgia, serif", letterSpacing:0.3, boxShadow:`0 4px 18px ${C.forest}40` }}>
              התחל ייעוץ ←
            </button>
            <div style={{ marginTop:14, fontSize:11.5, color:C.bark, opacity:0.7, lineHeight:1.6 }}>
              ⚕️ VetBot מספק הנחיות כלליות בלבד. לכל החלטה רפואית — פנה לווטרינר מוסמך.
            </div>
          </div>
        </div>
      )}

      {/* מסך צ'אט */}
      {started && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:700, width:"100%", margin:"0 auto", padding:"0 14px", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto", padding:"18px 0 8px" }}>
            {messages.map((m,i) => (
              <div key={i} style={{ animation:"fadeUp 0.3s ease" }}>
                <Bubble msg={m} />
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", flexDirection:"row-reverse", gap:9, alignItems:"flex-start", marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:C.forest, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🐾</div>
                <div style={{ background:C.white, borderRadius:"4px 16px 16px 16px", border:`1px solid ${C.sand}`, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {showChips && messages.length <= 2 && (
            <div style={{ paddingBottom:8 }}>
              <div style={{ fontSize:12, color:C.bark, fontWeight:700, marginBottom:7, textAlign:"right" }}>תסמינים נפוצים:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"flex-end" }}>
                {QUICK.map(s => (
                  <button key={s} onClick={() => sendMsg(s)} disabled={loading}
                    style={{ padding:"6px 12px", borderRadius:20, border:`1.5px solid ${C.bark}`, background:C.white, color:C.bark, fontSize:13, cursor:"pointer", fontFamily:"'Segoe UI', Tahoma, sans-serif", transition:"all 0.15s" }}
                    onMouseEnter={e=>{ e.target.style.background=C.bark; e.target.style.color="#fff"; }}
                    onMouseLeave={e=>{ e.target.style.background=C.white; e.target.style.color=C.bark; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ background:C.white, borderTop:`2px solid ${C.sand}`, padding:"12px 0 18px", display:"flex", gap:9, alignItems:"flex-end" }}>
            <button onClick={() => sendMsg()} disabled={loading || !input.trim()}
              style={{ width:46, height:46, borderRadius:"50%", border:"none", background: loading || !input.trim() ? C.sand : C.forest, cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize:19, flexShrink:0, boxShadow:`0 3px 12px ${C.forest}30`, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              🐾
            </button>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMsg(); } }}
              placeholder={`תאר את הסימפטומים של ${petName || (pet === "אחר" ? (otherPet.trim() || "חיית המחמד") : pet === "כלב" ? "הכלב" : "החתול")}...`}
              rows={2}
              style={{ flex:1, padding:"11px 14px", borderRadius:16, border:`2px solid ${C.sand}`, background:C.cream, fontSize:14.5, color:C.charcoal, resize:"none", lineHeight:1.55, textAlign:"right", direction:"rtl", fontFamily:"'Segoe UI', Tahoma, sans-serif", transition:"border-color 0.2s" }}
              onFocus={e=>e.target.style.borderColor=C.forest} onBlur={e=>e.target.style.borderColor=C.sand}
            />
          </div>
        </div>
      )}
    </div>
  );
}
