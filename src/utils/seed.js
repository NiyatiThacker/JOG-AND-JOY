import { Db } from '../api/db';
import { nanoid } from 'nanoid';

const SEEDED_KEY = 'jogjoy_admin_db_v1:seeded';

export function seedIfEmpty() {
  if (localStorage.getItem(SEEDED_KEY)) {
    return;
  }

  const now = new Date().toISOString();
  
  // Settings
  const settings = [{
    id: "global",
    storeName: "Jog & Joy",
    currency: "INR",
    timezone: "Asia/Kolkata",
    contactEmail: "admin@jogandjoy.com",
    autoApproveProducts: true,
    autoApproveReviews: false,
    defaultLowStockThreshold: 5,
    taxRatePercent: 18,
    flatShippingRate: 50,
    freeShippingThreshold: 500,
    currencyPosition: 'before',
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    taxMode: 'exclusive',
    digitalGoodsTaxable: false,
    guestCheckoutAllowed: true,
    orderEditWindowHours: 24,
    minOrderValue: 0,
    abandonedCartThresholdHours: 4,
    defaultLocationId: "loc-1",
    locationPriorityStrategy: 'primary_warehouse_first',
    payoutSchedule: { frequency: 'weekly', weekday: 1, dayOfMonth: 1, minimumBalance: 1000 },
    returnWindowDays: 30,
    returnAutoApprovalThreshold: 1000,
    restockingFeePercent: 0,
    finalSaleCategoryIds: []
  }];
  Db.writeTable('settings', settings);

  // Locations
  const locations = [
    {
      id: "loc-1",
      name: "Main Warehouse (Delhi)",
      type: "warehouse",
      address: { line1: "Plot 1", city: "New Delhi", state: "DL", postalCode: "110001", country: "IN" },
      isDefault: true,
      isFulfillmentEnabled: true
    }
  ];
  Db.writeTable('locations', locations);

  // Products & Inventory Levels
  const p1Id = nanoid();
  const p1v1Id = nanoid();
  const p1v2Id = nanoid();

  const products = [
    {
      id: p1Id,
      title: "Kids Cotton T-Shirt",
      slug: "kids-cotton-tshirt",
      description: "Comfortable daily wear t-shirt.",
      images: [],
      categoryId: "cat-1",
      tags: ["summer", "casual"],
      basePrice: 299,
      compareAtPrice: 399,
      status: "live",
      variants: [
        { id: p1v1Id, size: "2-3Y", color: "Red", sku: "TS-RED-2", stock: 15 },
        { id: p1v2Id, size: "4-5Y", color: "Red", sku: "TS-RED-4", stock: 3 },
      ],
      lowStockThreshold: 5,
      createdAt: now,
      updatedAt: now,
      vendor: "Jog & Joy",
      productType: "Apparel",
      seoTitle: "Kids Cotton T-Shirt",
      seoDescription: "Comfortable daily wear t-shirt for kids.",
      collections: [],
      shippingProfileId: null,
      weight: 0.1,
      dimensions: { length: 20, width: 20, height: 2 },
      taxStatus: "taxable",
      costPerItem: 150,
      trackQuantity: true,
      allowBackorder: false,
      channels: ["online_store"],
      rejectionReason: null,
      submittedBy: "admin-1",
      approvedBy: "admin-1"
    }
  ];
  Db.writeTable('products', products);

  const inventoryLevels = [
    { id: nanoid(), variantId: p1v1Id, locationId: "loc-1", onHand: 15, reserved: 0, incoming: 0 },
    { id: nanoid(), variantId: p1v2Id, locationId: "loc-1", onHand: 3, reserved: 0, incoming: 0 },
  ];
  Db.writeTable('inventoryLevels', inventoryLevels);

  // Customers
  const custId = "cust-1";
  const customers = [
    {
      id: custId,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      defaultAddress: {
        line1: "123 Main St",
        city: "Mumbai",
        state: "MH",
        postalCode: "400001",
        country: "IN"
      },
      createdAt: now,
      lifetimeValue: 899,
      ordersCount: 1
    }
  ];
  Db.writeTable('customers', customers);

  // Orders
  const orders = [
    {
      id: "ORD-001",
      orderNumber: "JJ-10001",
      customerId: custId,
      items: [
        {
          productId: p1Id,
          variantId: p1v1Id,
          titleSnapshot: "Kids Cotton T-Shirt - 2-3Y (Red)",
          unitPrice: 299,
          quantity: 2,
          fulfillmentStatus: "unfulfilled",
          returnEligible: true,
          locationId: "loc-1"
        }
      ],
      shippingAddress: customers[0].defaultAddress,
      status: "PROCESSING",
      statusHistory: [
        { status: "PROCESSING", timestamp: now, note: "Order placed" }
      ],
      trackingId: "",
      carrier: "",
      subtotal: 598,
      shippingCost: 50,
      discountAmount: 0,
      promotionCodeApplied: null,
      tax: 107.64,
      paymentStatus: "paid",
      createdAt: now,
      updatedAt: now,
      isDraft: false,
      tags: [],
      internalNotes: [],
      customerNotes: [],
      riskLevel: "low",
      channel: "online_store",
      fulfillmentStatus: "unfulfilled"
    }
  ];
  orders.forEach(o => { o.total = o.subtotal - o.discountAmount + o.shippingCost + o.tax; });
  Db.writeTable('orders', orders);

  localStorage.setItem(SEEDED_KEY, 'true');
}
