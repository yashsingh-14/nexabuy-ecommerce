const API_BASE = 'https://nexabuy-ecommerce.onrender.com/api';

async function seed() {
  console.log('🔐 Logging in as Admin...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecommerce.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) { console.error('❌ Login failed:', loginData); return; }
  const token = loginData.token;
  console.log('✅ Logged in successfully!\n');

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  // ── Step 1: Create Categories ──
  const categories = [
    { category_name: 'Electronics', description: 'Gadgets, devices, and tech accessories' },
    { category_name: 'Clothing', description: 'Men and women fashion wear' },
    { category_name: 'Accessories', description: 'Watches, bags, sunglasses and more' },
    { category_name: 'Home & Kitchen', description: 'Essentials for your home' },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    try {
      const res = await fetch(`${API_BASE}/categories`, { method: 'POST', headers, body: JSON.stringify(cat) });
      const data = await res.json();
      if (res.ok) {
        categoryIds[cat.category_name] = data.categoryId || data.category_id || data.id;
        console.log(`📁 Category created: ${cat.category_name} (ID: ${categoryIds[cat.category_name]})`);
      } else {
        console.log(`⚠️  Category "${cat.category_name}" may already exist: ${data.message}`);
      }
    } catch (err) {
      console.error(`Error creating category ${cat.category_name}:`, err.message);
    }
  }

  // If categories already exist, fetch their IDs
  try {
    const catRes = await fetch(`${API_BASE}/categories/all`, { headers });
    const allCats = await catRes.json();
    for (const c of allCats) {
      categoryIds[c.category_name] = c.category_id;
    }
    console.log('\n📋 Category IDs:', categoryIds, '\n');
  } catch (err) {
    console.error('Error fetching categories:', err.message);
  }

  // ── Step 2: Create Products ──
  const products = [
    {
      product_name: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life and deep bass.',
      price: 1499.00,
      inventory_count: 45,
      SKU: 'ELEC-HEAD-001',
      category_id: categoryIds['Electronics'],
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
    },
    {
      product_name: 'Smart Fitness Watch',
      description: 'Water-resistant smartwatch with heart rate monitor, step counter, and sleep tracking.',
      price: 2999.00,
      inventory_count: 30,
      SKU: 'ELEC-WTCH-002',
      category_id: categoryIds['Electronics'],
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
    },
    {
      product_name: 'Portable Bluetooth Speaker',
      description: 'Compact waterproof speaker with 360° surround sound and 12-hour playtime.',
      price: 1199.00,
      inventory_count: 60,
      SKU: 'ELEC-SPKR-003',
      category_id: categoryIds['Electronics'],
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80'
    },
    {
      product_name: 'Classic White Cotton T-Shirt',
      description: 'Premium 100% cotton crew neck t-shirt. Soft, breathable, and perfect for everyday wear.',
      price: 599.00,
      inventory_count: 100,
      SKU: 'CLOT-TSHRT-004',
      category_id: categoryIds['Clothing'],
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'
    },
    {
      product_name: 'Slim Fit Denim Jeans',
      description: 'Dark wash stretch denim jeans with modern slim fit. Comfortable all-day wear.',
      price: 1299.00,
      inventory_count: 75,
      SKU: 'CLOT-JEAN-005',
      category_id: categoryIds['Clothing'],
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'
    },
    {
      product_name: 'Aviator Sunglasses',
      description: 'Classic UV400 polarized aviator sunglasses with gold metal frame.',
      price: 899.00,
      inventory_count: 50,
      SKU: 'ACCS-SUNG-006',
      category_id: categoryIds['Accessories'],
      image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80'
    },
    {
      product_name: 'Leather Crossbody Bag',
      description: 'Genuine leather compact crossbody bag with adjustable strap. Perfect for travel.',
      price: 1799.00,
      inventory_count: 35,
      SKU: 'ACCS-BAG-007',
      category_id: categoryIds['Accessories'],
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80'
    },
    {
      product_name: 'Stainless Steel Water Bottle',
      description: 'Double-wall vacuum insulated 750ml bottle. Keeps drinks cold for 24 hours.',
      price: 499.00,
      inventory_count: 120,
      SKU: 'HOME-BOTL-008',
      category_id: categoryIds['Home & Kitchen'],
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80'
    },
    {
      product_name: 'Ceramic Coffee Mug Set',
      description: 'Set of 4 handcrafted ceramic mugs in pastel shades. Microwave and dishwasher safe.',
      price: 799.00,
      inventory_count: 40,
      SKU: 'HOME-MUGS-009',
      category_id: categoryIds['Home & Kitchen'],
      image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80'
    },
    {
      product_name: 'Running Sports Shoes',
      description: 'Lightweight mesh running shoes with cushioned sole. Available in multiple sizes.',
      price: 1999.00,
      inventory_count: 55,
      SKU: 'CLOT-SHOE-010',
      category_id: categoryIds['Clothing'],
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
    },
  ];

  let successCount = 0;
  for (const product of products) {
    try {
      const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers, body: JSON.stringify(product) });
      const data = await res.json();
      if (res.ok) {
        successCount++;
        console.log(`✅ Product added: ${product.product_name} — ₹${product.price}`);
      } else {
        console.log(`⚠️  Failed to add "${product.product_name}": ${data.message}`);
      }
    } catch (err) {
      console.error(`Error adding ${product.product_name}:`, err.message);
    }
  }

  console.log(`\n🎉 Done! ${successCount}/${products.length} products added successfully!`);
  console.log('🌐 Refresh your Products page to see them live.');
}

seed();
