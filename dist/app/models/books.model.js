"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
bookSchema.method("deductCopies", function (quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.copies < quantity) {
            throw new Error("Not enough copies available");
        }
        this.copies -= quantity;
        if (this.copies === 0) {
            this.available = false;
        }
        yield this.save();
    });
});
bookSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Your book is about to be saved: ${this.title}`);
        next();
    });
});
bookSchema.post("findOneAndDelete", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            console.log(`Deleted book: ${doc.title}`);
            const { Borrow } = yield Promise.resolve().then(() => __importStar(require("../models/borrow.model")));
            yield Borrow.deleteMany({ book: doc._id });
            console.log(`Deleted all borrow records related to book: ${doc.title}`);
        }
        next();
    });
});
exports.Books = (0, mongoose_1.model)('Books', bookSchema);
