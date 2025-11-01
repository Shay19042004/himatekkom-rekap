# 📊 Sistem Rekap Penjualan Minuman

Aplikasi web untuk manajemen penjualan minuman dengan fitur lengkap: inventory tracking, laporan keuangan, dan sistem FIFO (First In, First Out).

🔥 **Powered by Firebase** - Cloud-based, real-time sync, multi-user support

---

## ✨ Fitur Utama

### 📦 **Inventory Management**
- ✅ Master data produk dengan harga jual
- ✅ Pencatatan restok barang dengan batch tracking
- ✅ Real-time stock monitoring
- ✅ Sistem FIFO untuk perhitungan modal

### 💰 **Penjualan & Profit**
- ✅ Transaksi penjualan dengan auto-calculate profit
- ✅ Dashboard dengan statistik real-time
- ✅ Grafik penjualan per produk
- ✅ Perhitungan akurat berdasarkan FIFO

### 📈 **Laporan & Analytics**
- ✅ Laporan penjualan by date range
- ✅ Export to CSV
- ✅ Summary: revenue, profit, margin percentage
- ✅ Detail per produk

### 🔐 **Multi-User & Security**
- ✅ Firebase Authentication (Email/Password)
- ✅ Multi-tenant architecture (data terpisah per user)
- ✅ Auto-create user on first login
- ✅ Change password feature

### ☁️ **Cloud & Real-time**
- ✅ Firebase Firestore cloud database
- ✅ Real-time data sync across devices
- ✅ Persistent storage (data tidak hilang)
- ✅ Auto backup to cloud

---

## 🚀 Quick Start

### Deploy to Vercel (One-Click)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Local Development

```bash
# Run with any static server
npx serve

# Or Python
python3 -m http.server 8000
```

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Analytics:** Firebase Analytics
- **Charts:** Chart.js
- **Icons:** Font Awesome 6
- **Hosting:** Vercel

---

## 📋 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the wizard

### 2. Enable Authentication
1. Click **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Save

### 3. Create Firestore Database
1. Click **Firestore Database**
2. Create database (start in test mode)
3. Choose location: asia-southeast2 (Jakarta)

### 4. Get Firebase Config
1. Project Settings → Your apps → Web app
2. Copy Firebase config
3. Replace in `index.html` (~line 385)

### 5. Update Firestore Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📖 User Guide

### First Login
- Enter any email and password (min 6 chars)
- User auto-creates if doesn't exist

### Add Product
Master Produk → + Tambah Produk → Enter name & price → Save

### Restock
Restok Barang → + Tambah Restok → Select product, quantity, total price → Save

### Record Sale
Penjualan → + Tambah Penjualan → Select product, quantity → Profit auto-calculated → Save

### View Reports
Laporan → Select date range → View/Export CSV

---

## 🎯 FIFO Explained

**Example:**
```
Restock 1 (Nov 1): 24 pcs @ Rp 1,500 = Rp 36,000
Sell 14 pcs → Remaining: 10 pcs

Restock 2 (Nov 2): 24 pcs @ Rp 1,700 = Rp 40,800
Total Stock: 34 pcs

Sell 15 pcs:
  - 10 pcs from Restock 1 @ Rp 1,500 = Rp 15,000
  - 5 pcs from Restock 2 @ Rp 1,700 = Rp 8,500
  Total Cost: Rp 23,500

If selling @ Rp 3,000/pcs:
  Revenue: 15 × 3,000 = Rp 45,000
  Profit: 45,000 - 23,500 = Rp 21,500
```

---

## 📁 Project Structure

```
KWU/
├── index.html      # Main app
├── app.js          # Business logic
├── styles.css      # Styling
├── biglogo.svg     # Logo
├── package.json    # Metadata
├── vercel.json     # Vercel config
└── README.md       # This file
```

---

## 🔒 Data Structure

```
users/{userId}/
  ├── products/{productId}
  ├── restocks/{restockId}
  └── sales/{saleId}
```

---

## 📄 License

MIT License

---

## 👨‍💻 Developer

**HIMATEKKOM** - Showcase Project

Built with ❤️ using Firebase & Vanilla JS

---

**Happy coding! 🚀**
