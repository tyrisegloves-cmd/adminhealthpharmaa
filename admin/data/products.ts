export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  dosage?: string;
  manufacturer?: string;
  uses: string[];
  sideEffects: string[];
}

export const categories = [
  { id: 'all', name: 'All Products', icon: '🏥' },
  { id: 'medicines', name: 'Medicines', icon: '💊' },
  { id: 'vitamins', name: 'Vitamins & Supplements', icon: '🧬' },
  { id: 'first-aid', name: 'First Aid', icon: '🩹' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴' },
  { id: 'baby-care', name: 'Baby Care', icon: '👶' },
  { id: 'devices', name: 'Health Devices', icon: '🩺' },
];

export const defaultProducts: Product[] = [
  {
    id: 'paracetamol-500', name: 'Paracetamol 500mg', category: 'medicines',
    price: 35, originalPrice: 50, description: 'Effective pain relief and fever reducer tablets.',
    longDescription: 'Paracetamol 500mg is a widely used over-the-counter analgesic and antipyretic.',
    image: 'https://images.pexels.com/photos/51929/medications-cure-tablets-pharmacy-51929.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.5, reviews: 1284, inStock: true, badge: 'Bestseller',
    dosage: '1-2 tablets every 4-6 hours', manufacturer: 'Heart Pharma Labs',
    uses: ['Headache relief', 'Fever reduction', 'Body pain'], sideEffects: ['Nausea (rare)'],
  },
  {
    id: 'vitamin-c-1000', name: 'Vitamin C 1000mg', category: 'vitamins',
    price: 299, originalPrice: 450, description: 'Immune-boosting effervescent vitamin C tablets.',
    longDescription: 'High-potency Vitamin C 1000mg effervescent tablets to support your immune system.',
    image: 'https://images.pexels.com/photos/13013778/pexels-photo-13013778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.7, reviews: 892, inStock: true, badge: 'Popular',
    dosage: '1 tablet daily dissolved in water', manufacturer: 'Heart Pharma Nutrition',
    uses: ['Immune support', 'Antioxidant protection'], sideEffects: ['Stomach upset at high doses'],
  },
  {
    id: 'first-aid-kit', name: 'Complete First Aid Kit', category: 'first-aid',
    price: 599, originalPrice: 899, description: 'Professional 120-piece first aid kit for home & office.',
    longDescription: 'A comprehensive 120-piece first aid kit for emergency care.',
    image: 'https://images.pexels.com/photos/31852747/pexels-photo-31852747.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.8, reviews: 567, inStock: true, badge: 'Best Value', manufacturer: 'Heart Pharma Safety',
    uses: ['Minor cuts', 'Burns treatment', 'Emergency preparedness'], sideEffects: [],
  },
  {
    id: 'omega-3-capsules', name: 'Omega-3 Fish Oil Capsules', category: 'vitamins',
    price: 449, originalPrice: 599, description: 'Pure fish oil with EPA & DHA for heart health.',
    longDescription: 'Premium Omega-3 Fish Oil capsules with concentrated EPA and DHA.',
    image: 'https://images.pexels.com/photos/7615415/pexels-photo-7615415.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.6, reviews: 723, inStock: true, dosage: '2 capsules daily with meals',
    manufacturer: 'Heart Pharma Nutrition', uses: ['Heart health', 'Brain function'], sideEffects: ['Fishy aftertaste'],
  },
  {
    id: 'blood-pressure-monitor', name: 'Automatic BP Monitor', category: 'devices',
    price: 1299, originalPrice: 1899, description: 'Clinically validated automatic blood pressure monitor.',
    longDescription: 'Clinically validated upper arm blood pressure monitor.',
    image: 'https://images.pexels.com/photos/5673523/pexels-photo-5673523.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.7, reviews: 892, inStock: true, badge: 'Top Rated', manufacturer: 'Heart Pharma Devices',
    uses: ['Blood pressure monitoring', 'Heart rate tracking'], sideEffects: [],
  },
  {
    id: 'multivitamin-daily', name: 'Daily Multivitamin Complex', category: 'vitamins',
    price: 349, originalPrice: 499, description: 'Complete A-Z multivitamin for daily nutrition support.',
    longDescription: 'A comprehensive daily multivitamin formula containing 23 essential vitamins and minerals.',
    image: 'https://images.pexels.com/photos/11348080/pexels-photo-11348080.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.5, reviews: 651, inStock: true, badge: 'Recommended',
    dosage: '1 tablet daily with breakfast', manufacturer: 'Heart Pharma Nutrition',
    uses: ['Nutritional support', 'Energy boost', 'Immune health'], sideEffects: ['Nausea if taken on empty stomach'],
  },
  {
    id: 'baby-rash-cream', name: 'Baby Diaper Rash Cream', category: 'baby-care',
    price: 175, originalPrice: 250, description: 'Gentle zinc oxide cream for baby diaper rash relief.',
    longDescription: 'A gentle, pediatrician-recommended diaper rash cream.',
    image: 'https://images.pexels.com/photos/9742853/pexels-photo-9742853.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.6, reviews: 478, inStock: true, manufacturer: 'Heart Pharma Baby',
    uses: ['Diaper rash relief', 'Skin protection'], sideEffects: ['Very rare skin sensitivity'],
  },
  {
    id: 'hand-sanitizer', name: 'Hand Sanitizer 500ml', category: 'personal-care',
    price: 149, originalPrice: 199, description: 'Hospital-grade 70% isopropyl alcohol hand sanitizer.',
    longDescription: 'Hospital-grade hand sanitizer with 70% isopropyl alcohol.',
    image: 'https://images.pexels.com/photos/9742893/pexels-photo-9742893.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.2, reviews: 1102, inStock: true, manufacturer: 'Heart Pharma Hygiene',
    uses: ['Hand hygiene', 'Germ protection'], sideEffects: ['Skin dryness with overuse'],
  },
  {
    id: 'cough-syrup', name: 'Herbal Cough Syrup', category: 'medicines',
    price: 125, originalPrice: 175, description: 'Natural herbal cough syrup with honey and tulsi.',
    longDescription: 'An Ayurvedic cough syrup formulated with a blend of natural herbs.',
    image: 'https://images.pexels.com/photos/29110700/pexels-photo-29110700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.4, reviews: 567, inStock: true, dosage: '10ml three times daily',
    manufacturer: 'Heart Pharma Ayurveda', uses: ['Dry cough relief', 'Sore throat'], sideEffects: ['Drowsiness (rare)'],
  },
  {
    id: 'digital-thermometer', name: 'Digital Thermometer', category: 'devices',
    price: 199, originalPrice: 350, description: 'Fast, accurate digital thermometer with LCD display.',
    longDescription: 'Advanced digital thermometer with ultra-fast 10-second reading.',
    image: 'https://images.pexels.com/photos/3683049/pexels-photo-3683049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    rating: 4.4, reviews: 445, inStock: true, badge: 'Sale', manufacturer: 'Heart Pharma Devices',
    uses: ['Temperature measurement', 'Fever detection'], sideEffects: [],
  },
];
