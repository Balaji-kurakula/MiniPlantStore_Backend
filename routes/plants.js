const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// @route   GET /api/plants
// @desc    Get all plants with optional search and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, inStock, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.categories = { $in: [category] };
    }
    
    // Stock filter
    if (inStock === 'true') {
      query.isAvailable = true;
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const plants = await Plant.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
      
    const total = await Plant.countDocuments(query);
    
    res.json({
      success: true,
      data: plants,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: plants.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/plants/:id
// @desc    Get single plant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/plants
// @desc    Add new plant (Admin)
// @access  Public (should be protected in production)
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      price, 
      categories, 
      isAvailable, 
      description, 
      scientificName,
      image, 
      lightRequirement,
      wateringFrequency,
      potSize,
      careInstructions,
      popularity 
    } = req.body;
    
    // Validation
    if (!name || !price || !categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and at least one category are required'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }
    
    const plant = new Plant({
      name: name.trim(),
      price: parseFloat(price),
      categories,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      description: description?.trim(),
      scientificName: scientificName?.trim(),
      image,
      lightRequirement,
      wateringFrequency,
      potSize,
      careInstructions,
      popularity: popularity || 0
    });
    
    const savedPlant = await plant.save();
    
    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      data: savedPlant
    });
  } catch (error) {
    console.error('Add plant error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding plant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/plants/:id
// @desc    Update plant
// @access  Public (should be protected in production)
router.put('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Plant updated successfully',
      data: plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating plant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/plants/:id
// @desc    Delete plant
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting plant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/plants/categories/list
// @desc    Get all unique categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Plant.distinct('categories');
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
