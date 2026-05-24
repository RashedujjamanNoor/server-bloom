const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// GET DASHBOARD STATS
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// MONTHLY SALES ANALYTICS
const getMonthlyAnalytics = async (req, res) => {
  try {
    // MONTHLY REVENUE
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },

          revenue: {
            $sum: "$totalPrice",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenue = salesData.map((item) => ({
      month: months[item._id.month - 1],

      revenue: item.revenue,

      orders: item.orders,
    }));

    // CATEGORY ANALYTICS
    const products = await Product.find();

    const categoryMap = {};

    products.forEach((product) => {
      if (categoryMap[product.category]) {
        categoryMap[product.category] += 1;
      } else {
        categoryMap[product.category] = 1;
      }
    });

    const categoryAnalytics = Object.keys(categoryMap).map((key) => ({
      name: key,

      value: categoryMap[key],
    }));

    // ORDER STATUS ANALYTICS
    const orders = await Order.find();

    const statusMap = {};

    orders.forEach((order) => {
      if (statusMap[order.orderStatus]) {
        statusMap[order.orderStatus] += 1;
      } else {
        statusMap[order.orderStatus] = 1;
      }
    });

    const orderStatusAnalytics = Object.keys(statusMap).map((key) => ({
      status: key,

      count: statusMap[key],
    }));

    // USER GROWTH
    const users = await User.find();

    const userMap = {};

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();

      const monthName = months[month];

      if (userMap[monthName]) {
        userMap[monthName] += 1;
      } else {
        userMap[monthName] = 1;
      }
    });

    const userGrowthAnalytics = Object.keys(userMap).map((key) => ({
      month: key,

      users: userMap[key],
    }));

    res.status(200).json({
      success: true,

      analytics: {
        monthlyRevenue,
        categoryAnalytics,
        orderStatusAnalytics,
        userGrowthAnalytics,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getMonthlyAnalytics,
};
