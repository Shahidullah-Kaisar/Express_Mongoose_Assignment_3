import express, { Request, Response } from "express";
import { Books } from "../models/books.model";
import { BookQuery } from "../interfaces/books.interface";
import { z } from "zod";

export const booksRoutes = express.Router();

 const createBookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: z.string().min(1, "ISBN is required"),
    description: z.string().optional(),
    copies: z.number().int().nonnegative("Copies must be 0 or greater"),
    available: z.boolean().optional(),
});

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {

    const zodBody = await createBookSchema.parseAsync(req.body);
    
    const book = await Books.create(zodBody);
    
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });

  } catch (error: any) {
    console.error(error);

    if (error.name === "ValidationError") {
      const formattedErrors: Record<string, any> = {};

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
});


booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    await Books.findByIdAndDelete(bookId);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updatedBook = req.body;
    const book = await Books.findByIdAndUpdate(bookId, updatedBook, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const singleBook = await Books.findById(bookId);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: singleBook,
    });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

booksRoutes.get("/", async (req: Request<{}, {}, {}, BookQuery>, res: Response) => { //Request<Params, ResBody, ReqBody, ReqQuery>
    try {
      const {
        filter,
        sortBy = "createdAt",
        sort = "asc",
        limit = "10",
      } = req.query;

      const dataFilter: any = {};

      if (filter) {
        dataFilter.genre = filter.toUpperCase(); //যদি genreFilter থাকে, তাহলে সেটাকে mongoFilter অবজেক্টের genre প্রপার্টি হিসেবে অ্যাসাইন করা হলো uppercase kore.
      }

      const sortOrder = sort === "desc" ? -1 : 1;
      const limitNum = parseInt(limit);

      const books = await Books.find(dataFilter)
        .sort({ [sortBy]: sortOrder })
        .limit(limitNum);

      res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);
