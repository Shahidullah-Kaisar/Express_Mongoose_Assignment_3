import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";


const bookSchema = new Schema<IBooks>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  copies: {
    type: Number,
    required: true,
    min: [0, "Copies must be a positive number"], 
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

bookSchema.method("deductCopies", async function (quantity: number): Promise<void> {
  if (this.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  this.copies -= quantity;

  if (this.copies === 0) {
    this.available = false;
  }

  await this.save();
});

bookSchema.pre("save", async function (next) {
    console.log(`Your book is about to be saved: ${this.title}`);
    next(); 
});

bookSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    console.log(`Deleted book: ${doc.title}`);
    const { Borrow } = await import("../models/borrow.model");
    await Borrow.deleteMany({ book: doc._id });
    console.log(`Deleted all borrow records related to book: ${doc.title}`);
  }
  next();
});


export const Books = model<IBooks>('Books', bookSchema);


