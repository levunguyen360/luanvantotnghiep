const Order = require("../models/order");
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchEAsyncErrors = require('../middlewares/catchAsyncErrors');

//------------------------------------------------------------------

//create a new order => /api/v1/order/new
exports.newOrder = catchEAsyncErrors( async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;
    
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(200).json({
        success: true,
        order
    })
})

//get single order => /api/v1/order/:id
exports.getSingleOrder =  catchEAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(!order) {
        return next( new ErrorHandler('not found order by id', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})

//get logged in user orders => /api/v1/orders/me
exports.myOrders =  catchEAsyncErrors( async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    res.status(200).json({
        success: true,
        orders
    })
})

//---admin---

//get all orders => /api/v1/admin/orders
exports.allOrders =  catchEAsyncErrors( async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach( order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//update/ process order => /api/v1/admin/orders/:id
exports.updateOrder =  catchEAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(order.orderStatus === 'Thành công') {
        return next(new ErrorHandler('Đơn hàng đã xử lí thành công', 400))
    }
    order.orderItems.forEach( async item => {
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json({
        success: true
    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    console.log(product.stock);
    product.stock = product.stock - quantity;
    await product.save({
        validateBeforeSave: false
    });
}
//detele  order => /api/v1/order/:id
exports.deleteOrder =  catchEAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order) {
        return next( new ErrorHandler('not found order by id', 404))
    }
    await order.remove()
    res.status(200).json({
        success: true,
    })
})