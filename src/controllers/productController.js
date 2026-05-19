const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 999999;

    const sort = req.query.sort || "newest";

    const query = {
      title: {
        $regex: search,
        $options: "i",
      },

      price: {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      },
    };

    if (category) {
      query.category = category;
    }

    let sortOption = {};

    if (sort === "low-high") {
      sortOption.price = 1;
    } else if (sort === "high-low") {
      sortOption.price = -1;
    } else if (sort === "oldest") {
      sortOption.createdAt = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOption);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPage: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
