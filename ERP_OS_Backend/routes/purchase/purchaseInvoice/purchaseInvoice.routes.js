const express = require("express");
const {
  createSinglePurchaseInvoice,
  getAllPurchaseInvoice,
  getSinglePurchaseInvoice,
  updateSinglePurchaseInvoice,
  deleteSinglePurchaseInvoice,
} = require("./purchaseInvoice.controllers");
const authorize = require("../../../utils/authorize"); // authentication middleware

const purchaseInvoiceRoutes = express.Router();

purchaseInvoiceRoutes.post(
  "/",
  authorize("createPurchaseInvoice"),
  createSinglePurchaseInvoice
);
purchaseInvoiceRoutes.get(
  "/",
  authorize("viewPurchaseInvoice"),
  getAllPurchaseInvoice
);
purchaseInvoiceRoutes.get(
  "/:id",
  authorize("viewPurchaseInvoice"),
  getSinglePurchaseInvoice
);
// purchaseInvoiceRoutes.put("/:id", authorize("updatePurchaseInvoice"), updateSinglePurchaseInvoice); // purchase invoice is not updatable
purchaseInvoiceRoutes.patch(
  "/:id",
  authorize("deletePurchaseInvoice"),
  deleteSinglePurchaseInvoice
);

module.exports = purchaseInvoiceRoutes;
