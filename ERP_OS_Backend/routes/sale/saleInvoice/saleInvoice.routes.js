const express = require("express");
const {
  createSingleSaleInvoice,
  getAllSaleInvoice,
  getSingleSaleInvoice,
  updateSingleSaleInvoice,
  deleteSingleSaleInvoice,
} = require("./saleInvoice.controllers");
const authorize = require("../../../utils/authorize"); // authentication middleware

const saleInvoiceRoutes = express.Router();

saleInvoiceRoutes.post(
  "/",
  authorize("createSaleInvoice"),
  createSingleSaleInvoice
);
saleInvoiceRoutes.get("/", authorize("viewSaleInvoice"), getAllSaleInvoice);
saleInvoiceRoutes.get(
  "/:id",
  authorize("viewSaleInvoice"),
  getSingleSaleInvoice
);
saleInvoiceRoutes.put(
  "/:id",
  authorize("updateSaleInvoice"),
  updateSingleSaleInvoice
);
saleInvoiceRoutes.patch(
  "/:id",
  authorize("deleteSaleInvoice"),
  deleteSingleSaleInvoice
);

module.exports = saleInvoiceRoutes;
