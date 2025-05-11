const express = require('express');
const router = express.Router();
const { Content } = require('../models');
const auth = require('../middleware/auth');

// Get all published content
router.get('/', async (req, res) => {
  try {
    const { ageGroup, classLevel, category, area } = req.query;
    const where = { status: 'published' };

    if (ageGroup) where.ageGroup = ageGroup;
    if (classLevel) where.classLevel = classLevel;
    if (category) where.category = category;
    if (area) where.area = area;

    const contents = await Content.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(contents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Create new content
router.post('/', auth, async (req, res) => {
  try {
    const content = await Content.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating content' });
  }
});

// Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if user is the owner or an admin
    if (content.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this content' });
    }

    await content.update(req.body);
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating content' });
  }
});

// Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if user is the owner or an admin
    if (content.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this content' });
    }

    await content.destroy();
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting content' });
  }
});

module.exports = router; 