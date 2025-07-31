# 🛒 Order Management API

Sebuah RESTful API untuk sistem manajemen pemesanan produk. Dibangun menggunakan **Express.js**, **TypeScript**, dan **TypeORM**, serta menggunakan **JWT** untuk autentikasi dan role-based access control.

---

## 🚀 Features

- 🔐 Login & Autentikasi JWT
- 👤 Role: Admin & Customer
- 📦 CRUD Produk (Admin only)
- 🧾 Pemesanan produk (Customer only)
- 📉 Otomatis mengurangi stok produk setelah pemesanan
- 📚 Riwayat transaksi per customer
- ✅ Validasi input menggunakan Joi
- 🧪 Dokumentasi endpoint via REST Client (`.rest` file)

---

## 🧱 Tech Stack

- **Node.js**, **Express.js**, **TypeScript**
- **MySQL** (via TypeORM)
- **JWT Authentication**
- **Joi** untuk validasi input
- **REST Client (VS Code Extension)** untuk dokumentasi dan testing

---

## 📦 Installation

```bash
git clone https://github.com/JahfalRzq/OrderManagementAPI.git
cd OrderManagementAPI
npm install
```

Jalankan server:

```
npm run start
```


