const Product = require('../models/product.model');
const Service = require('../models/service.model');
const Catalog = require('../models/catalog.model');

const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');
const { filterData } = require('../util/filterData');
const useQuery = require('../util/useQuery');

exports.getAllCatalogItems = async (req, res, next) => {
  const catalogData = await useQuery(Catalog, req.query);
  res.status(200).json({
    status: true,
    ...catalogData
  });
};

exports.getCatalogItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the catalog item and populate the 'itemId' field dynamically based on the 'itemType'
  const catalogItem = await Catalog.findOne({
    $or: [{ _id: id }, { itemId: id }]
  }).populate('itemId');

  if (!catalogItem) {
    return next(new AppError(404, 'Catalog item not found'));
  }

  res.status(200).json({
    status: true,
    data: {
      [catalogItem.itemType.toLowerCase()]: catalogItem.itemId,
      name: catalogItem.name,
      price: catalogItem.price,
      category: catalogItem.description,
      description: catalogItem.description,
      _id: catalogItem._id
    }
  });
});

exports.createCatalogItem = catchAsync(async (req, res, next) => {
  const { itemType, name, price, description, category } = req.body;

  if (req.body.product && req.body.service) {
    return next(
      new AppError('Invalid request body. Must be "Product" or "Service".')
    );
  }

  let newItem;
  if (itemType === 'Product') {
    newItem = await Product.create(req.body.product);
  } else if (itemType === 'Service') {
    newItem = await Service.create(req.body.service);
  } else {
    return next(
      new AppError('Invalid itemType. Must be "Product" or "Service".')
    );
  }
  const newCatalogItem = await Catalog.create({
    itemId: newItem._id,
    itemType,
    name,
    price,
    description,
    category
  });

  res.status(201).json({
    status: true,
    catalogItem: newCatalogItem
  });
});

exports.updateCatalogItem = catchAsync(async (req, res, next) => {});

exports.deleteCatalogItem = catchAsync(async (req, res, next) => {});