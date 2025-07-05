import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Books } from "../models/books.model";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Books.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      
    } else {
      await book.deductCopies(quantity);

      const borrow = await Borrow.create({
        book: book._id,
        quantity,
        dueDate,
      });

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    }

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});


borrowRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo"
        }
      },
      {
        $unwind: "$bookInfo"
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookInfo.title",
            isbn: "$bookInfo.isbn"
          },
          totalQuantity: 1
        }
      },
      {
        $sort: { totalQuantity: -1 }
      }
    ]);

    const formatted = summary.map(item => ({
      book: item.book,
      totalQuantity: item.totalQuantity
    }));

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: formatted
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
});

