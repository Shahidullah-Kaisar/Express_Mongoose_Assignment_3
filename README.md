
# 📚 Library Management System

A RESTful Library Management System built using **Express.js**, **TypeScript**, and **MongoDB** (Mongoose).  
This application allows you to manage books, handle borrow operations, and track book availability.

---

## 🚀 Features

- ✅ Add, update, delete, and retrieve books
- 📦 Borrow books with quantity control and due date
- 🧠 Business logic to update availability automatically
- 📊 Aggregation pipeline to view borrowed book summary
- 📘 Input validation using Mongoose
- 🧩 Custom instance method for deducting book copies
- 🧪 Middleware support (post)

---

## 📁 Folder Structure

```
├── node_modules/
├── src/
│   ├── app/                     # ✅ Application-specific logic
│   │   ├── controllers          # ✅ Route handlers (books.controller.ts, borrow.controller.ts)
│   │   ├── interfaces           # ✅ TypeScript interfaces (books.interface.ts, borrow.interface.ts)
│   │   └── models               # ✅ Mongoose models (books.model.ts, borrow.model.ts)
│   ├── app.ts                   # ✅ Express app configuration (import routes, middlewares)
│   └── server.ts                # ✅ Entry point to start the server (calls app.listen)
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
├── .gitignore
└── README.md


```
---

## ⚙️ Tech Stack

- **Backend:** Express.js + TypeScript
- **Database:** MongoDB (via Mongoose)
- **Validation:** Mongoose Schema Validation, Zod
- **Aggregation:** MongoDB aggregation pipeline
- **Dev Tools:** ts-node-dev

---

## 🛠️ Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/library-management.git

# 2. Go to the project directory
cd library-management

# 3. Install dependencies
npm install

# 4. Create a `.env` file (if needed)
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/library_management

# 5. Run the project
npm run dev
```

> App runs at: `http://localhost:5000`

---

## 📬 API Documentation

### 1️⃣ Create Book  
**POST** `/api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology.",
  "copies": 5,
  "available": true
}
```

---

### 2️⃣ Get All Books  
**GET** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

Query Params:
- `filter`: Genre (optional)
- `sortBy`: Field name (default: createdAt)
- `sort`: asc / desc
- `limit`: Number of results (default: 10)

---

### 3️⃣ Get Single Book  
**GET** `/api/books/:bookId`

---

### 4️⃣ Update Book  
**PUT** `/api/books/:bookId`

```json
{
  "copies": 10
}
```

---

### 5️⃣ Delete Book  
**DELETE** `/api/books/:bookId`

---

### 6️⃣ Borrow a Book  
**POST** `/api/borrow`

```json
{
  "book": "BOOK_OBJECT_ID",
  "quantity": 2,
  "dueDate": "2025-07-01"
}
```

🔒 Logic:
- Automatically deducts from book copies
- Marks as unavailable when copies = 0

---

### 7️⃣ Borrow Summary (Aggregation)  
**GET** `/api/borrow`

Returns:
```json
{
  "success": true,
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```

---

## ⚙️ NPM Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start in dev mode with live reload (ts-node-dev) |
| `npm run build` | Compile TypeScript to JavaScript (dist/ folder) |
| `npm start`     | Start compiled app |

---

## 🧠 Business Logic Highlights

- 📌 Instance Method: `book.deductCopies(quantity)`
- 📦 Aggregation pipeline: `Borrow.aggregate(...)`
- 🔄 Pre-save middleware: Log when a book is about to be saved

---

## 🧪 Validation Examples

### Mongoose Error Format:
```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number"
      }
    }
  }
}
```
