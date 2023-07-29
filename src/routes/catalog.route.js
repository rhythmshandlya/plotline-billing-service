const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');

const router = express.Router();

// Read all catalog items
router.get('/', catalogController.getAllCatalogItems);

// Read a single catalog item by ID
router.get('/:id', catalogController.getCatalogItem);

// Create a new catalog item
router.post(
  '/',
  protect,
  restrictTo('admin'),
  catalogController.createCatalogItem
);

// Update a catalog item by ID
router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  catalogController.updateCatalogItem
);

// Delete a catalog item by ID
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  catalogController.deleteCatalogItem
);

module.exports = router;
