## 📘 User Management (Route & Controller) – Professional Notes
🔹 User Routes (src/routes/user.routes.js)

এই ফাইলে আমরা সব user-related API endpoints ডিফাইন করেছি। প্রতিটি রুটে আমরা protectRoute middleware ব্যবহার করেছি, যেটি ইউজারের authentication & authorization নিশ্চিত করে।

✨ রুটসমূহ:

### 1.Change Password
```js 
router.post("/change-password", protectRoute(), changePasswordController);
```
- শুধু authenticated user তার নিজের password change করতে পারবে।

### 2. Get Authenticated User (/me)
```js
router.get("/me", protectRoute(), authSelfController);
```
- লগ-ইন করা ইউজারের নিজের তথ্য দেখাবে।

### 3.Change Username
```js
router.patch("/change-username", protectRoute(), updateUserNameController);
```
- authenticated user নিজের username আপডেট করতে পারবে।

### 4. Get All Users
```js 
router.get("/users", protectRoute({requireVerified:true, allowedRoles:['admin','superAdmin']}), getAllUsersController);
```
- শুধু admin ও superAdmin অন্য সকল ইউজারদের তালিকা দেখতে পারবে।
- নিজের তথ্য বাদ দিয়ে বাকি ইউজারদের দেখানো হবে।

### 5. Change User Role
```js 
router.patch("/role/:id", protectRoute({ allowedRoles: ["superAdmin"], requireVerified: true }), changeUserRoleController);
```
- শুধুমাত্র superAdmin অন্য ইউজারের role পরিবর্তন করতে পারবে।

### 6. Get Single User

```js 
router.get("/:id", protectRoute({requireVerified:true, allowedRoles:['admin', 'superAdmin']}), singleUserController);
```
- নির্দিষ্ট ইউজারের তথ্য দেখতে পারবে শুধু admin বা superAdmin।

## 📘 User Controllers – Detailed Professional Notes

1️⃣ Change Password Controller

```js 
export const changePasswordController = async (req, res) => { ... }
```

Purpose:
- Logged-in user তার current password যাচাই করে নতুন password সেট করতে পারবে।
- Flow / Logic:
    - req.user._id থেকে logged-in user কে চিহ্নিত করা হয়।
    - Request body থেকে currentPassword, newPassword, confirmPassword নেয়া হয়।

- Validation:
    - সব field আছে কি না।
    - New password এবং confirm password মিলছে কি না।

- User কে database থেকে fetch করে current password যাচাই করা হয়।
- যদি সব ঠিক থাকে, passwordHash update করা হয়।
- Success message return হয়।

Error Handling:
- Field missing → 400 Bad Request
- Password mismatch → 400 Bad Request
- Current password invalid → 401 Unauthorized
- User not found → 404 Not Found
- Server Error → 500 Internal Server Error

2️⃣ Auth Self Controller
```js
export const authSelfController = async (req, res) => { ... }
```

Purpose:
- Logged-in user নিজের profile info দেখতে পারবে।

Flow:
- req.user._id থেকে user খোঁজা হয় DB থেকে।
- Password বা sensitive data exclude করা হয়।
- Response হিসেবে user object return করা হয়।

Use Case:
- Dashboard, Profile Page, Account Settings page।

3️⃣ Update Username Controller
```js 
export const updateUserNameController = async (req, res) => { ... }
```

Purpose:
- User তার username পরিবর্তন করতে পারবে।

Flow:
- req.user._id থেকে user identify করা হয়।
- req.body.username validate করা হয়।
- DB তে update করে নতুন user data return করা হয়।

Error Handling:
- Username missing → 400
- User not found → 404
- Server error → 500

4️⃣ Change User Role Controller
```js
export const changeUserRoleController = async (req, res) => { ... }
```

Purpose:
- SuperAdmin অন্য user এর role পরিবর্তন করতে পারে।

Flow:
- req.params.id থেকে target user fetch করা হয়।
- req.body.role দ্বারা নতুন role set করা হয়।
- Save করে updated user return করা হয়।

Roles:
- Allowed Roles: user, admin, superAdmin- Error 

Handling:
- User not found → 404
- Server error → 500

5️⃣ Single User Controller
```js 
export const singleUserController = async (req, res) => { ... }
```

Purpose:
- Admin বা SuperAdmin নির্দিষ্ট user এর profile/details দেখতে পারবে।

Flow:
- req.params.id থেকে DB থেকে user fetch করা হয়।
- User found হলে return করা হয়।

Error Handling:
- User not found → 404
- Server error → 500

6️⃣ Get All Users Controller
```js 
export const getAllUsersController = async (req, res) => { ... }
```

Purpose:
- Admin এবং SuperAdmin সকল users except self দেখতে পারবে।

Flow:
- req.user._id exclude করা হয়।
- Database থেকে বাকি সব users fetch করা হয়।
- Response return করা হয়।

Error Handling:
- Server error → 500

🔑 Notes for Professional Understanding
- RBAC (Role-Based Access Control) implemented for each route.
- Sensitive data always excluded (passwordHash) in responses.
- Proper validation & error handling ensures security and user-friendly feedback.
- Controllers follow single responsibility principle – প্রতিটি controller শুধু তার নিজস্ব কাজ করবে।


🔹 Key Points / Best Practices

✅ protectRoute() middleware ব্যবহার করা হয়েছে authentication + authorization নিশ্চিত করার জন্য।

✅ Sensitive data (passwordHash) সব জায়গায় exclude করা হয়েছে।

✅ try/catch ব্যবহার করে সব controller এ proper error handling করা হয়েছে।

✅ Role-based access control (RBAC) ইমপ্লিমেন্ট করা হয়েছে (admin, superAdmin)।

✅ Security জন্য current password verify না করলে নতুন password update করা হচ্ছে না।

📌 Simplified Flow Diagram
User → Request → Middleware (protectRoute) → Controller → MongoDB → Response