# โปรเจกต์สร้างใบเสร็จ (print-receipt)

โปรเจกต์สำหรับสร้างและจัดการใบเสร็จรับเงิน ออกแบบมาให้ใช้งานง่ายและยืดหยุ่น พร้อมฟีเจอร์ที่ปรับให้เข้ากับการใช้งานในประเทศไทยโดยเฉพาะ

## ✨ คุณสมบัติหลัก (Key Features)

- **สร้างใบเสร็จ:** สร้างเอกสารใบเสร็จในรูปแบบที่สวยงามและเป็นมาตรฐาน
- **โหมดมืด/สว่าง:** สามารถสลับโหมดการแสดงผล (Light/Dark Mode) เพื่อความสบายตา
- **UI Components:** พัฒนาโดยใช้ UI Components คุณภาพสูงจาก [PrimeNG](https://primeng.org/)
- **ฟอร์มที่อยู่แบบไทย:** มีฟอร์มสำหรับกรอกที่อยู่ซึ่งออกแบบมาสำหรับประเทศไทยโดยเฉพาะ (จังหวัด, อำเภอ, ตำบล, และรหัสไปรษณีย์)
- **ตัวเลือกวันที่แบบไทย:** ใช้ Custom Datepicker ที่รองรับการเลือก วัน/เดือน/ปี เป็นปีพุทธศักราช (พ.ศ.)

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework:** Angular v19
- **Styling:** Tailwind CSS v4
- **UI Library:** PrimeNG
- **Hosting:** Firebase Hosting

## 🚀 การติดตั้งและตั้งค่า (Setup & Installation)

### 1. สิ่งที่ต้องมี (Prerequisites)

- [Node.js](https://nodejs.org/) (เวอร์ชัน 18 หรือสูงกว่า)
- [Angular CLI](https://angular.io/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### 2. การติดตั้ง (Installation)

```bash
# 1. Clone a repository
git clone <your-repository-url>

# 2. เข้าไปที่โฟลเดอร์โปรเจกต์
cd print-receipt

# 3. ติดตั้ง Dependencies
npm install
```

### 3. การตั้งค่า Firebase Hosting (Multisite)

โปรเจกต์นี้เป็นส่วนหนึ่งของการตั้งค่า Firebase Hosting แบบหลายไซต์ (Multisite) ซึ่งจำเป็นต้องมีไฟล์คอนฟิก 2 ไฟล์นี้

**ไฟล์ที่ 1: `.firebaserc`**
ไฟล์นี้ทำหน้าที่ "แมป" ชื่อเล่นของโปรเจกต์กับ Site จริงบน Firebase ไฟล์นี้จะต้องมีข้อมูลของทุกไซต์ในโปรเจกต์

```.firebaserc
{
  "projects": {
    "default": "print-receipt"
  },
  "targets": {
    "print-receipt": {
      "hosting": {
        "print-receipt": [
          "print-receipt-6fdc9"
        ],
        "member-system": [
          "member-system-app"
        ]
      }
    }
  }
}
```

**ไฟล์ที่ 2: `firebase.json`**
ไฟล์นี้เป็น "พิมพ์เขียว" สำหรับ deploy โปรเจกต์นี้โดยเฉพาะ

```json
{
  "hosting": {
    "target": "print-receipt",
    "public": "dist/print-receipt",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

> **สำคัญ:** ตรวจสอบให้แน่ใจว่าค่า `"public"` ตรงกับ path ของโฟลเดอร์ build ของคุณ (อาจเป็น `dist/ชื่อโปรเจกต์`)

### 4. การ Deploy ขึ้น Firebase Hosting

เมื่อตั้งค่าและ build โปรเจกต์เรียบร้อยแล้ว ใช้คำสั่งนี้เพื่อ deploy:

```bash
# Build โปรเจกต์ให้เป็นเวอร์ชัน production
ng build -configuration production or ng build -c production

# Deploy ไปยัง Firebase Hosting โดยระบุ target
firebase deploy --only hosting:print-receipt
```
