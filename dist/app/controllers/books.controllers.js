"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
exports.booksRoutes = express_1.default.Router();
const createBookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: zod_1.z.string().min(1, "ISBN is required"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().int().nonnegative("Copies must be 0 or greater"),
    available: zod_1.z.boolean().optional(),
});
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zodBody = yield createBookSchema.parseAsync(req.body);
        const book = yield books_model_1.Books.create(zodBody);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            const formattedErrors = {};
            for (const key in error.errors) {
                formattedErrors[key] = {
                    message: error.errors[key].message,
                    name: error.errors[key].name,
                    properties: error.errors[key].properties,
                    kind: error.errors[key].kind,
                    path: error.errors[key].path,
                    value: error.errors[key].value,
                };
            }
            res.status(400).json({
                message: "Validation failed",
                success: false,
                error: {
                    name: error.name,
                    errors: formattedErrors,
                },
            });
        }
        res.status(500).json({
            message: error.message,
            success: false,
            error
        });
    }
}));
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        yield books_model_1.Books.findByIdAndDelete(bookId);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}));
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBook = req.body;
        const book = yield books_model_1.Books.findByIdAndUpdate(bookId, updatedBook, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}));
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const singleBook = yield books_model_1.Books.findById(bookId);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: singleBook,
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}));
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10", } = req.query;
        const dataFilter = {};
        if (filter) {
            dataFilter.genre = filter.toUpperCase(); //যদি genreFilter থাকে, তাহলে সেটাকে mongoFilter অবজেক্টের genre প্রপার্টি হিসেবে অ্যাসাইন করা হলো uppercase kore.
        }
        const sortOrder = sort === "desc" ? -1 : 1;
        const limitNum = parseInt(limit);
        const books = yield books_model_1.Books.find(dataFilter)
            .sort({ [sortBy]: sortOrder })
            .limit(limitNum);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
