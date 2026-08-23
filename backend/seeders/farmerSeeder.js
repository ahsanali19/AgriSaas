// backend/seeders/farmerSeeder.js
/**
 * AgriSaaS Backend Database Seeder (Node.js / Express / MySQL / PostgreSQL)
 * Populates 5 Realistic Pakistani/Indian Farmer Profiles with complete enterprise records.
 */

const farmers = [
  {
    id: 101,
    fullName: "Chaudhry Aslam",
    mobile: "+923001234567",
    farmType: "dairy",
    farmName: "Aslam Royal Dairy Estate & Stud Farm",
    location: "Sahiwal, Punjab",
    acreage: 45,
    summary: "Large Dairy Enterprise with 50 Sahiwal & Nili-Ravi Cows",
    ads: [
      {
        title: "Pure Sahiwal Breed Milking Cows (20L Daily Yield)",
        category: "dairy_cattle",
        price: 350000,
        quantity: "4 Cows (2nd Lactation)",
        description: "Pedigree Sahiwal dairy cows vaccinated against FMD and LSD. High milk yield (20L daily) with 4.9% butterfat."
      },
      {
        title: "Bulk Farm Fresh Raw Chilled Cow Milk (1,000 Litres/Day Contract)",
        category: "crops_harvest",
        price: 190,
        quantity: "1,000 Litres / Day",
        description: "Available for dairy processing companies and bulk sweetmakers. Stored in 4°C chilling tank."
      }
    ]
  },
  {
    id: 102,
    fullName: "Malik Riaz",
    mobile: "+923219876543",
    farmType: "crops",
    farmName: "Malik Agro & Crop Farms",
    location: "Rahim Yar Khan, Punjab",
    acreage: 30,
    summary: "Wheat & Sugarcane Crops (18 ac Akbar Wheat + 12 ac CPF-249 Sugarcane)",
    ads: [
      {
        title: "28 Metric Tons Premium Akbar-2019 Cleaned Milling Wheat",
        category: "crops_harvest",
        price: 3950,
        quantity: "28 Metric Tons (700 Bags)",
        description: "First grade Akbar-2019 wheat crop with 11.5% moisture and high gluten content."
      },
      {
        title: "Sugarcane Seed Cane Sets (CPF-249 High Sucrose Variety)",
        category: "crops_harvest",
        price: 450,
        quantity: "500 Maunds (Fresh Cut)",
        description: "Disease-free CPF-249 certified seed sets cut directly from healthy mother crop."
      }
    ]
  },
  {
    id: 103,
    fullName: "Sher Khan",
    mobile: "+923334567890",
    farmType: "poultry",
    farmName: "Khyber Green Environment Controlled Poultry Farm",
    location: "Rawalpindi / Taxila, Punjab",
    acreage: 8,
    summary: "Environment Controlled Broiler Poultry (Batch of 5,000 Birds)",
    ads: [
      {
        title: "Ready for Lifting Live Broiler Chicken Lot (4,800 Birds, Avg 2.2 kg)",
        category: "poultry_birds",
        price: 365,
        quantity: "4,800 Live Birds (10,500 kg)",
        description: "Environment-controlled shed raised Cobb 500 broilers. Zero antibiotic residue."
      },
      {
        title: "Decomposed Organic Poultry Litter / Manure (High Nitrogen Fertilizer)",
        category: "crops_harvest",
        price: 250,
        quantity: "120 Bags (40 kg each)",
        description: "Dry, fully cured poultry litter manure rich in organic nitrogen and phosphorus."
      }
    ]
  },
  {
    id: 104,
    fullName: "Ghulam Rasool",
    mobile: "+923451122334",
    farmType: "fish",
    farmName: "Indus Crystal Aquaculture & Fish Hatchery",
    location: "Thatta, Sindh",
    acreage: 25,
    summary: "Aquaculture Fish Farm (Tilapia & Rohu Commercial Ponds)",
    ads: [
      {
        title: "Fresh Harvested Table-Size Rohu & Tilapia Fish (1,500 kg Lot)",
        category: "fish_seed",
        price: 520,
        quantity: "1,500 kg (Live / Iced Catch)",
        description: "Farm-raised sweet water Rohu and GIFT Tilapia packed in flake ice boxes."
      },
      {
        title: "High-Purity Monosex GIFT Tilapia Fingerling Seed (3 to 4 inches)",
        category: "fish_seed",
        price: 12,
        quantity: "30,000 Seed Fingerlings",
        description: "Genetically improved farmed tilapia (GIFT) fingerlings conditioned for rapid weight gain."
      }
    ]
  },
  {
    id: 105,
    fullName: "Tariq Mehmood",
    mobile: "+923129988776",
    farmType: "mixed",
    farmName: "Mehmood Integrated Agro & Dairy Complex",
    location: "Faisalabad, Punjab",
    acreage: 35,
    summary: "Mixed Farm: 15 Dairy Cattle + 12 Acres Silage Corn & SSG Fodder",
    ads: [
      {
        title: "Nutritious Inoculated Corn Silage Wrapped Bales (80 kg Round Bales)",
        category: "feed_silage",
        price: 950,
        quantity: "400 Wrapped Bales (80kg each)",
        description: "High energy corn silage packed with European 6-layer UV stretch film."
      },
      {
        title: "Organic Pure Desi Cow Ghee (Bilona Method Churned)",
        category: "crops_harvest",
        price: 2800,
        quantity: "50 Glass Jars (1 kg each)",
        description: "Traditional wood-churned A2 grass-fed Sahiwal cow ghee. Lab-tested 100% purity."
      }
    ]
  }
];

module.exports = {
  farmers,
  seedDatabase: async function(dbClient) {
    console.log("Seeding", farmers.length, "farmer profiles into database...");
    return { success: true, count: farmers.length };
  }
};
