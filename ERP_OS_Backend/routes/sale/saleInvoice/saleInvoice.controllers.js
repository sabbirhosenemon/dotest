const { getPagination } = require("../../../utils/query");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSingleSaleInvoice = async (req, res) => {
  try {
    // calculate total sale price
    let totalSalePrice = 0;
    req.body.saleInvoiceProduct.forEach((item) => {
      totalSalePrice +=
        parseFloat(item.product_sale_price) * parseFloat(item.product_quantity);
    });
    // get all product asynchronously
    const allProduct = await Promise.all(
      req.body.saleInvoiceProduct.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: item.product_id,
          },
        });
        return product;
      })
    );
    // iterate over all product and calculate total purchase price
    totalPurchasePrice = 0;
    req.body.saleInvoiceProduct.forEach((item, index) => {
      totalPurchasePrice +=
        allProduct[index].purchase_price * item.product_quantity;
    });
    // convert all incoming date to a specific format.
    const date = new Date(req.body.date).toISOString().split("T")[0];
    // create sale invoice
    const createdInvoice = await prisma.saleInvoice.create({
      data: {
        date: new Date(date),
        total_amount: totalSalePrice,
        discount: parseFloat(req.body.discount),
        paid_amount: parseFloat(req.body.paid_amount),
        profit:
          totalSalePrice - parseFloat(req.body.discount) - totalPurchasePrice,
        due_amount:
          totalSalePrice -
          parseFloat(req.body.discount) -
          parseFloat(req.body.paid_amount),
        customer: {
          connect: {
            id: Number(req.body.customer_id),
          },
        },
        note: req.body.note,
        // map and save all products from request body array of products
        saleInvoiceProduct: {
          create: req.body.saleInvoiceProduct.map((product) => ({
            product: {
              connect: {
                id: Number(product.product_id),
              },
            },
            product_quantity: Number(product.product_quantity),
            product_sale_price: parseFloat(product.product_sale_price),
          })),
        },
      },
    });
    // new transactions will be created as journal entry
    if (req.body.paid_amount > 0) {
      await prisma.transaction.create({
        data: {
          date: new Date(date),
          debit_id: 1,
          credit_id: 8,
          amount: parseFloat(req.body.paid_amount),
          particulars: `Cash receive on Sale Invoice #${createdInvoice.id}`,
          type: "sale",
          related_id: createdInvoice.id,
        },
      });
    }
    // if sale on due another transactions will be created as journal entry
    const due_amount =
      totalSalePrice -
      parseFloat(req.body.discount) -
      parseFloat(req.body.paid_amount);
    console.log(due_amount);
    if (due_amount > 0) {
      await prisma.transaction.create({
        data: {
          date: new Date(date),
          debit_id: 4,
          credit_id: 8,
          amount: due_amount,
          particulars: `Due on Sale Invoice #${createdInvoice.id}`,
        },
      });
    }
    // cost of sales will be created as journal entry
    await prisma.transaction.create({
      data: {
        date: new Date(date),
        debit_id: 9,
        credit_id: 3,
        amount: totalPurchasePrice,
        particulars: `Cost of sales on Sale Invoice #${createdInvoice.id}`,
      },
    });
    // iterate through all products of this sale invoice and decrease product quantity
    req.body.saleInvoiceProduct.forEach(async (item) => {
      await prisma.product.update({
        where: {
          id: Number(item.product_id),
        },
        data: {
          quantity: {
            decrement: Number(item.product_quantity),
          },
        },
      });
    }),
      res.json({
        createdInvoice,
      });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const getAllSaleInvoice = async (req, res) => {
  if (req.query.query === "info") {
    const aggregations = await prisma.saleInvoice.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        total_amount: true,
        due_amount: true,
        paid_amount: true,
        profit: true,
      },
    });
    res.json(aggregations);
  } else if (req.query.query === "all") {
    try {
      // get all sale invoice
      const allSaleInvoice = await prisma.saleInvoice.findMany({
        include: {
          customer: true,
        },
      });
      res.json(allSaleInvoice);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  } else if (req.query.query === "group") {
    try {
      // get all sale invoice
      const allSaleInvoice = await prisma.saleInvoice.groupBy({
        orderBy: {
          date: "asc",
        },
        by: ["date"],
        _sum: {
          total_amount: true,
          paid_amount: true,
          due_amount: true,
          profit: true,
        },
        _count: {
          id: true,
        },
      });
      res.json(allSaleInvoice);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  } else {
    const { skip, limit } = getPagination(req.query);
    try {
      const [aggregations, saleInvoices] = await prisma.$transaction([
        // get info of selected parameter data
        prisma.saleInvoice.aggregate({
          _count: {
            id: true,
          },
          _sum: {
            total_amount: true,
            due_amount: true,
            paid_amount: true,
            profit: true,
          },
          where: {
            date: {
              gte: new Date(req.query.startdate),
              lte: new Date(req.query.enddate),
            },
          },
        }),
        // get saleInvoice paginated and by start and end date
        prisma.saleInvoice.findMany({
          orderBy: [
            {
              id: "desc",
            },
          ],
          skip: Number(skip),
          take: Number(limit),
          include: {
            customer: {
              select: {
                name: true,
              },
            },
          },
          where: {
            date: {
              gte: new Date(req.query.startdate),
              lte: new Date(req.query.enddate),
            },
          },
        }),
      ]);
      // modify data to actual data of sale invoice's current value
      const transactions = await prisma.transaction.findMany({
        where: {
          type: "sale",
          related_id: {
            in: saleInvoices.map((item) => item.id),
          },
        },
      });
      const returnSaleInvoice = await prisma.returnSaleInvoice.findMany({
        where: {
          saleInvoice_id: {
            in: saleInvoices.map((item) => item.id),
          },
        },
      });
      // calculate paid amount and due amount of individual sale invoice from transactions and returnSaleInvoice and attach it to saleInvoices
      const allSaleInvoice = saleInvoices.map((item) => {
        const paidAmount = transactions
          .filter((transaction) => transaction.related_id === item.id)
          .reduce((acc, curr) => acc + curr.amount, 0);
        const returnAmount = returnSaleInvoice
          .filter(
            (returnSaleInvoice) => returnSaleInvoice.saleInvoice_id === item.id
          )
          .reduce((acc, curr) => acc + curr.total_amount, 0);
        return {
          ...item,
          paid_amount: paidAmount,
          due_amount:
            item.total_amount - item.discount - paidAmount - returnAmount,
        };
      });
      // calculate total paid_amount and due_amount from allSaleInvoice and attach it to aggregations
      const totalPaidAmount = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.paid_amount,
        0
      );
      const totalDueAmount = allSaleInvoice.reduce(
        (acc, curr) => acc + curr.due_amount,
        0
      );
      aggregations._sum.paid_amount = totalPaidAmount;
      aggregations._sum.due_amount = totalDueAmount;
      res.json({
        aggregations,
        allSaleInvoice,
      });
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  }
};

const getSingleSaleInvoice = async (req, res) => {
  try {
    const singleSaleInvoice = await prisma.saleInvoice.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        saleInvoiceProduct: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    const transactions = await prisma.transaction.findMany({
      where: {
        type: "sale",
        related_id: Number(req.params.id),
      },
      include: {
        debit: {
          select: {
            name: true,
          },
        },
        credit: {
          select: {
            name: true,
          },
        },
      },
    });
    const returnSaleInvoice = await prisma.returnSaleInvoice.findMany({
      where: {
        saleInvoice_id: Number(req.params.id),
      },
      include: {
        returnSaleInvoiceProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    let status = "UNPAID";
    // sum total amount of all transactions
    const totalPaidAmount = transactions.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    // check if total transaction amount is equal to total_amount - discount - return invoice amount
    const totalReturnAmount = returnSaleInvoice.reduce(
      (acc, item) => acc + item.total_amount,
      0
    );
    const dueAmount =
      singleSaleInvoice.total_amount -
      singleSaleInvoice.discount -
      totalReturnAmount -
      totalPaidAmount;
    if (
      totalPaidAmount ===
      singleSaleInvoice.total_amount -
        singleSaleInvoice.discount -
        totalReturnAmount
    ) {
      status = "PAID";
    }
    res.json({
      status,
      totalPaidAmount,
      totalReturnAmount,
      dueAmount,
      singleSaleInvoice,
      returnSaleInvoice,
      transactions,
    });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

// TODO: update sale invoice: NO UPDATE ALLOWED FOR NOW
const updateSingleSaleInvoice = async (req, res) => {
  try {
    res.json({ message: "update sale invoice not implemented" });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

// on delete sale invoice, increase product quantity, customer due amount decrease, transaction create
const deleteSingleSaleInvoice = async (req, res) => {
  try {
    // get sale invoice details
    const saleInvoice = await prisma.saleInvoice.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        saleInvoiceProduct: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    if (saleInvoice.status === true) {
      // product quantity increase
      saleInvoice.saleInvoiceProduct.forEach(async (item) => {
        await prisma.product.update({
          where: {
            id: Number(item.product_id),
          },
          data: {
            quantity: {
              increment: Number(item.product_quantity),
            },
          },
        });
      });
      // all operations in one transaction
      const [deleteSaleInvoice, transaction] = await prisma.$transaction([
        // sale invoice delete
        prisma.saleInvoice.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            status: req.body.status,
          },
        }),
        // new transaction will be created
        prisma.transaction.create({
          data: {
            date: new Date(),
            debit_id: 3,
            credit_id: 1,
            amount: parseFloat(saleInvoice.paid_amount),
            particulars: `refund the paid amount of sale invoice no. ${req.params.id}`,
            type: "sale_deleted",
            related_id: Number(req.params.id),
          },
        }),
      ]);
      res.json({
        deleteSaleInvoice,
        transaction,
      });
    } else {
      res.json({ message: "sale invoice already deleted" });
    }
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createSingleSaleInvoice,
  getAllSaleInvoice,
  getSingleSaleInvoice,
  updateSingleSaleInvoice,
  deleteSingleSaleInvoice,
};
