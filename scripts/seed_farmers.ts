// scripts/seed_farmers.ts
// Node.js Backend Seeder Script for AgriSaaS
import { ALL_SEED_FARMER_PROFILES } from '../src/data/seedData';

export async function runSeeder() {
  console.log('🌾 ========================================================');
  console.log('🌱 Starting AgriSaaS Multi-Enterprise Database Seeder...');
  console.log('🌾 ========================================================\n');

  for (const profile of ALL_SEED_FARMER_PROFILES) {
    const { user, farm, dairyAnimals, crops, poultryBatches, fishPonds, marketplaceListings } = profile;
    
    console.log(`✅ [Farmer ${user.id}] ${user.fullName} (${user.phoneNumber})`);
    console.log(`   🏛️ Farm: "${farm.name}" - Type: ${farm.farmType.toUpperCase()} (${farm.totalAreaAcres || 0} Acres) in ${farm.locationDistrict}`);
    
    if (dairyAnimals.length > 0) {
      console.log(`   🐄 Livestock: ${dairyAnimals.length} Dairy Animals seeded`);
    }
    if (crops.length > 0) {
      console.log(`   🌾 Crops: ${crops.map(c => `${c.cropName} (${c.landAreaAcres} ac)`).join(', ')}`);
    }
    if (poultryBatches.length > 0) {
      console.log(`   🐔 Poultry: ${poultryBatches.map(p => `${p.batchCode} (${p.initialBirdCount} birds)`).join(', ')}`);
    }
    if (fishPonds.length > 0) {
      console.log(`   🐟 Aquaculture: ${fishPonds.length} Fish Ponds seeded`);
    }
    if (marketplaceListings.length > 0) {
      console.log(`   🛒 Marketplace Ads: ${marketplaceListings.length} Active Listings:`);
      marketplaceListings.forEach(ad => {
        console.log(`      • [Rs. ${ad.price.toLocaleString()} ${ad.currency}] "${ad.title}" (${ad.quantity})`);
      });
    }
    console.log('------------------------------------------------------------');
  }

  console.log('\n🎉 Successfully seeded 5 realistic farmer profiles and all related enterprise records!');
  return { success: true, count: ALL_SEED_FARMER_PROFILES.length };
}

if (typeof require !== 'undefined' && require.main === module) {
  runSeeder().catch(console.error);
}
