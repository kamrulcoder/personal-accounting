## 📒 Personal Accounting Project – Database Models Documentation
## 1. User Model

ব্যবহারকারীর বেসিক ইনফরমেশন, অথেনটিকেশন ও ভেরিফিকেশন সম্পর্কিত সব ডাটা এখানে রাখা হয়।

- Fields:
  - name → ইউজারের নাম
  - email → ইউনিক, লগইনের জন্য ব্যবহার হবে
  - passwordHash → হ্যাশড পাসওয়ার্ড
  - isActive → ইউজার সক্রিয় কিনা
  - isVerified → ইমেইল ভেরিফাইড কিনা
  - role → user | admin
  - avatarUrl → প্রোফাইল ইমেজ
  - resetPasswordToken, emailVerificationTokenইত্যাদি → সিকিউরিটি টোকেন

- Relations:
  - একটি User–এর অনেকগুলো AccountType, Transaction, Note থাকতে পারে।
  - userId অন্যান্য মডেলে foreign key হিসাবে ব্যবহৃত হবে।

## 2. AccountType Model

প্রতিটি ইউজারের জন্য ব্যাংক একাউন্ট, ওয়ালেট, ক্যাশ ইত্যাদি রাখার জন্য এই মডেল।

- Fields:
  - userId → কোন ইউজারের একাউন্ট সেটা বোঝাতে
  - name, description → একাউন্টের নাম ও বর্ণনা
  - initialBalance, currentBalance → প্রাথমিক ও বর্তমান ব্যালেন্স

- Relations:
  - একটি User–এর একাধিক AccountType থাকতে পারে।
  - একটি AccountType অনেকগুলো Transaction এর সাথে সম্পর্কিত হতে পারে।

## 3. Transactor Model

টাকা লেনদেন যাদের সাথে হয় (যেমন: Vendor, Customer, Friend ইত্যাদি), তাদের ইনফরমেশন।

- Fields:
  - userId → কোন ইউজারের ট্রান্স্যাক্টর
  - name, phone, email, address, notes

- Relations:
  - User–এর একাধিক Transactor থাকতে পারে।
  - প্রতিটি Transactor–এর সাথে একাধিক Transaction থাকতে পারে।
  - Balance মডেল User ও Transactor এর মধ্যে সম্পর্ক রাখে।

## 4. Transaction Model

আয়-ব্যয় ট্র্যাক করার জন্য মূল মডেল।

- Fields:
  - userId → কোন ইউজার
  - accountId → কোন একাউন্টে টাকা জমা/খরচ হলো
  - transactorId → কার সাথে ট্রান্সেকশন হলো
  - amount, type (income/expense/transfer), category, description
  - date, isSettled

- Relations:
  - প্রতিটি Transaction একটি User, একটি AccountType, এবং একটি Transactor এর সাথে সম্পর্কিত।
  - relatedTransaction → ট্রান্সফারের ক্ষেত্রে দুটি ট্রান্সেকশন একে অপরের সাথে যুক্ত থাকবে।

## 5. Balance Model

কোন ইউজারের সাথে কোন ট্রান্সেক্টরের কত টাকা বাকী আছে বা পাবে সেটা ট্র্যাক করতে ব্যবহৃত।

- Fields:
  - userId
  - transactorId
  - balance

- Relations:
  - User + Transactor এর জন্য ইউনিক কম্বিনেশন।
  - প্রতিটি Transaction যোগ বা কমালে এই মডেলে পরিবর্তন আসবে।

## 6. Note Model

ইউজার তার ব্যক্তিগত নোট, রিমাইন্ডার রাখতে পারবে।

- Fields:
  - userId → কোন ইউজারের নোট
  - title, description, reminderDate, isCompleted

- Relations:
  - User–এর একাধিক Note থাকতে পারে।

### 🔗 Entity Relationship Flow (ERD Style)
```mermaid 
erDiagram
erDiagram
    USER ||--o{ ACCOUNTTYPE : has
    USER ||--o{ TRANSACTOR : has
    USER ||--o{ TRANSACTION : makes
    USER ||--o{ BALANCE : maintains
    USER ||--o{ NOTE : writes

    ACCOUNTTYPE ||--o{ TRANSACTION : used_in
    TRANSACTOR ||--o{ TRANSACTION : involved_in
    TRANSACTOR ||--o{ BALANCE : tracked_in
    TRANSACTION ||--o{ TRANSACTION : related_to

```
📌 Workflow Example

1. User Register/Login → নতুন ইউজার তৈরি হয়।
1. AccountType Create → সে নিজের ব্যাংক বা ওয়ালেট একাউন্ট অ্যাড করে।
1. Transactor Add → সে তার Vendor / Customer / Friend অ্যাড করে।
1. Transaction Add → যখন আয়/ব্যয় হবে তখন Transaction তৈরি হবে।
1. Transaction এ userId, accountId, transactorId থাকবে।
1. যদি খরচ হয় → Balance আপডেট হবে।
1. Balance Update → প্রতিটি ট্রান্সেকশনের ভিত্তিতে Balance মডেল এডজাস্ট হবে।
1. Note Add → ইউজার তার কাজের নোট বা Reminder যোগ করবে।