# 🍣 LINE Bot – Sushi

A sample **LINE Official Account bot** demonstrating how to build a real-world LINE system using:

- Messaging API (Webhook bot)
- Rich Menu navigation
- Card-based (Flex) messages
- LIFF (LINE Front-end Framework) web apps
- Supabase as a backend database

This project is designed for **learning, testing, and extending** LINE Bot + LIFF workflows.

---

## ✨ Features

- 🤖 Auto-reply bot using LINE Messaging API
- 📋 Rich Menu with navigation buttons
- 🧩 Card-based (Flex) messages
- 🌐 LIFF web apps (Menu & Dashboard)
- 👤 Member system with Supabase
- 🛒 Order flow via LIFF → Chat → Bot
- ☁️ Hosted on Render (backend)

---

## 🏗 Architecture Overview

```
LINE App (User)
│
├─ Rich Menu
│   ├─ Menu        → LIFF (Menu App)
│   ├─ Dashboard   → LIFF (Dashboard App)
│   └─ Promotions  → LIFF (Promotions App)
│
├─ Card-based / Flex Messages
│   └─ Buttons → Open LIFF URLs
│
├─ LINE Bot (Webhook)
│   ├─ index.js              (message handling)
│   ├─ flexMessages.js       (Flex message builders)
│   └─ Supabase Client       (member / points data)
│
└─ LIFF Web Apps (Hosted on Render)
    ├─ liff-app.html         (Menu)
    ├─ dashboard.html        (Member Dashboard)
    ├─ promotions.html       (Promotions)
    └─ liff-app.css
```

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express
- @line/bot-sdk
- Supabase JS
- Render

**Frontend (LIFF)**
- HTML / CSS / JS
- LIFF SDK v2

---

## 🚀 Getting Started

### Clone
```bash
git clone https://github.com/your-username/line-bot-sushi.git
cd line-bot-sushi
```

### Install
```bash
npm install
```

### Environment Variables
```env
CHANNEL_SECRET=YOUR_SECRET
CHANNEL_ACCESS_TOKEN=YOUR_TOKEN
SUPABASE_URL=YOUR_URL
SUPABASE_ANON_KEY=YOUR_KEY
```

### Run
```bash
npm start
```

---

## 🔗 LINE Developers Setup

### Messaging API
Webhook URL:
```
https://your-domain.com/webhook
```

### LIFF Apps
Create separate LIFF apps:
- Menu → liff-app.html
- Dashboard → dashboard.html
- Promotion → promotions.html

Use:
```
https://liff.line.me/{LIFF_ID}
```

---

## 📜 License
Sai Hae Naing Lay
https://github.com/AnitaMaxWynn901
