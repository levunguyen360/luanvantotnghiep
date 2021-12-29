const express = require('express');
const router = express.Router();
//----------------------------------------------------------------------------
const { newOrder, myOrders, getSingleOrder, allOrders, updateOrder, deleteOrder } = require('../controllers/orderController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

//-----------------------------------------------------------------------------
router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router.route('/admin/orders').get(isAuthenticatedUser, allOrders, authorizeRoles('admin'));
router.route('/admin/order/:id')
                                .put(isAuthenticatedUser, updateOrder, authorizeRoles('admin'))
                                .delete(isAuthenticatedUser, deleteOrder, authorizeRoles('admin'))

//------------------------------------------------------------------------------
module.exports = router;
