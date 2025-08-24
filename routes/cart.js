const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');

// @route   GET /api/cart/:userId
// @desc    Get user's cart
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.plantId',
        select: 'name price categories isAvailable image scientificName lightRequirement'
      })
      .lean();

    if (!cart) {
      return res.json({ 
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0
        }
      });
    }

    // Filter out items where plant doesn't exist (deleted plants)
    const validItems = cart.items
      .filter(item => item.plantId)
      .map(item => ({
        ...item.plantId,
        quantity: item.quantity,
        cartItemId: item._id,
        addedAt: item.addedAt
      }));

    res.json({
      success: true,
      data: {
        items: validItems,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        updatedAt: cart.updatedAt
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/cart/:userId
// @desc    Add item to cart
// @access  Public
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { plantId, quantity = 1 } = req.body;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID is required'
      });
    }

    // Check if plant exists and get its price
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ 
        success: false,
        message: 'Plant not found' 
      });
    }

    if (!plant.isAvailable) {
      return res.status(400).json({ 
        success: false,
        message: 'Plant is not available' 
      });
    }

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{
          plantId,
          quantity: parseInt(quantity),
          price: plant.price
        }]
      });
    } else {
      // Check if item already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.plantId.toString() === plantId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // Add new item
        cart.items.push({
          plantId,
          quantity: parseInt(quantity),
          price: plant.price
        });
      }
    }

    await cart.save();

    // Return the updated cart with populated data
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.plantId', 'name price categories image')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        totalItems: populatedCart.totalItems,
        totalAmount: populatedCart.totalAmount,
        addedItem: plant.name
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/cart/:userId/:plantId
// @desc    Update item quantity in cart
// @access  Public
router.put('/:userId/:plantId', async (req, res) => {
  try {
    const { userId, plantId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.plantId.toString() === plantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    cart.items[itemIndex].quantity = parseInt(quantity);
    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/cart/:userId/:plantId
// @desc    Remove item from cart
// @access  Public
router.delete('/:userId/:plantId', async (req, res) => {
  try {
    const { userId, plantId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.plantId.toString() !== plantId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount
      }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove item from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/cart/:userId
// @desc    Clear entire cart
// @access  Public
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        totalItems: 0,
        totalAmount: 0
      }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to clear cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
