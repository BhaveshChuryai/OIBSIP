/**
 * Seed Script
 * Populates the database with initial admin user, inventory items, and preset pizzas.
 * Run: npm run seed (or node seed.js)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Pizza = require('./models/Pizza');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pizza-delivery';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // ─── Clear existing data ───
    await User.deleteMany({});
    await Inventory.deleteMany({});
    await Pizza.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── Seed Admin User ───
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@pizza.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    console.log(`👨‍💼 Admin created: ${admin.email} / ${adminPassword}`);

    // ─── Seed Inventory ───
    const inventoryItems = [
      // Pizza Bases
      { category: 'base', name: 'Thin Crust', quantity: 100, threshold: 20, unit: 'units', price: 120 },
      { category: 'base', name: 'Thick Crust', quantity: 100, threshold: 20, unit: 'units', price: 140 },
      { category: 'base', name: 'Whole Wheat', quantity: 100, threshold: 20, unit: 'units', price: 150 },
      { category: 'base', name: 'Gluten-Free', quantity: 100, threshold: 20, unit: 'units', price: 180 },
      { category: 'base', name: 'Cheese Burst', quantity: 100, threshold: 20, unit: 'units', price: 200 },

      // Sauces
      { category: 'sauce', name: 'Tomato', quantity: 100, threshold: 20, unit: 'units', price: 30 },
      { category: 'sauce', name: 'BBQ', quantity: 100, threshold: 20, unit: 'units', price: 40 },
      { category: 'sauce', name: 'Pesto', quantity: 100, threshold: 20, unit: 'units', price: 50 },
      { category: 'sauce', name: 'Alfredo', quantity: 100, threshold: 20, unit: 'units', price: 45 },
      { category: 'sauce', name: 'Spicy Marinara', quantity: 100, threshold: 20, unit: 'units', price: 35 },

      // Cheeses
      { category: 'cheese', name: 'Mozzarella', quantity: 100, threshold: 20, unit: 'units', price: 60 },
      { category: 'cheese', name: 'Cheddar', quantity: 100, threshold: 20, unit: 'units', price: 55 },
      { category: 'cheese', name: 'Parmesan', quantity: 100, threshold: 20, unit: 'units', price: 70 },
      { category: 'cheese', name: 'Vegan', quantity: 100, threshold: 20, unit: 'units', price: 80 },
      { category: 'cheese', name: 'No Cheese', quantity: 999, threshold: 0, unit: 'units', price: 0 },

      // Veggies
      { category: 'veggie', name: 'Onion', quantity: 100, threshold: 20, unit: 'units', price: 20 },
      { category: 'veggie', name: 'Capsicum', quantity: 100, threshold: 20, unit: 'units', price: 25 },
      { category: 'veggie', name: 'Mushroom', quantity: 100, threshold: 20, unit: 'units', price: 35 },
      { category: 'veggie', name: 'Olives', quantity: 100, threshold: 20, unit: 'units', price: 40 },
      { category: 'veggie', name: 'Jalapeños', quantity: 100, threshold: 20, unit: 'units', price: 30 },
      { category: 'veggie', name: 'Corn', quantity: 100, threshold: 20, unit: 'units', price: 20 },
      { category: 'veggie', name: 'Tomato', quantity: 100, threshold: 20, unit: 'units', price: 15 },
      { category: 'veggie', name: 'Spinach', quantity: 100, threshold: 20, unit: 'units', price: 25 }
    ];

    await Inventory.insertMany(inventoryItems);
    console.log(`🧀 Seeded ${inventoryItems.length} inventory items`);

    // ─── Seed Preset Pizzas ───
    const presetPizzas = [
      {
        name: 'Margherita Classic',
        description: 'The timeless classic with fresh mozzarella, tomato sauce, and basil on a thin crust.',
        basePrice: 249,
        image: '🍕',
        defaultConfig: { base: 'Thin Crust', sauce: 'Tomato', cheese: 'Mozzarella', veggies: ['Tomato'] }
      },
      {
        name: 'BBQ Veggie Supreme',
        description: 'Loaded with capsicum, onion, mushroom, and corn drizzled in smoky BBQ sauce.',
        basePrice: 349,
        image: '🍕',
        defaultConfig: { base: 'Thick Crust', sauce: 'BBQ', cheese: 'Cheddar', veggies: ['Capsicum', 'Onion', 'Mushroom', 'Corn'] }
      },
      {
        name: 'Pesto Garden',
        description: 'Fresh pesto base with spinach, olives, and parmesan on whole wheat crust.',
        basePrice: 399,
        image: '🌿',
        defaultConfig: { base: 'Whole Wheat', sauce: 'Pesto', cheese: 'Parmesan', veggies: ['Spinach', 'Olives'] }
      },
      {
        name: 'Spicy Jalapeño Burst',
        description: 'Cheese burst crust loaded with jalapeños, onion, and spicy marinara sauce.',
        basePrice: 449,
        image: '🌶️',
        defaultConfig: { base: 'Cheese Burst', sauce: 'Spicy Marinara', cheese: 'Mozzarella', veggies: ['Jalapeños', 'Onion', 'Capsicum'] }
      },
      {
        name: 'Alfredo Mushroom Bliss',
        description: 'Creamy alfredo sauce with mushrooms, spinach, and a thick crust base.',
        basePrice: 379,
        image: '🍄',
        defaultConfig: { base: 'Thick Crust', sauce: 'Alfredo', cheese: 'Mozzarella', veggies: ['Mushroom', 'Spinach'] }
      },
      {
        name: 'Vegan Delight',
        description: 'Plant-based cheese with fresh veggies on a gluten-free crust. 100% vegan!',
        basePrice: 429,
        image: '🥗',
        defaultConfig: { base: 'Gluten-Free', sauce: 'Tomato', cheese: 'Vegan', veggies: ['Capsicum', 'Mushroom', 'Olives', 'Spinach', 'Corn'] }
      }
    ];

    await Pizza.insertMany(presetPizzas);
    console.log(`🍕 Seeded ${presetPizzas.length} preset pizzas`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Admin Email:    ${admin.email}`);
    console.log(`  Admin Password: ${adminPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
