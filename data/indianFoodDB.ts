export interface FoodItemDB {
    name: string;
    calories: number;
    protein: number;
    servingSize: string;
    keywords: string[];
}

export const indianFoodDB: FoodItemDB[] = [
    // Breads
    { name: "Roti / Chapati", calories: 104, protein: 3, servingSize: "1 medium", keywords: ["roti", "chapati", "phulka", "bread"] },
    { name: "Naan", calories: 260, protein: 9, servingSize: "1 medium", keywords: ["naan", "butter naan"] },
    { name: "Paratha (Plain)", calories: 180, protein: 5, servingSize: "1 medium", keywords: ["paratha", "plain paratha"] },
    { name: "Aloo Paratha", calories: 290, protein: 6, servingSize: "1 medium", keywords: ["aloo paratha", "potato paratha"] },
    { name: "Puri", calories: 101, protein: 1, servingSize: "1 medium", keywords: ["puri", "poori"] },

    // Rice
    { name: "White Rice", calories: 130, protein: 2.7, servingSize: "1 cup (cooked)", keywords: ["rice", "white rice", "chawal"] },
    { name: "Jeera Rice", calories: 180, protein: 3, servingSize: "1 cup", keywords: ["jeera rice", "cumin rice"] },
    { name: "Chicken Biryani", calories: 290, protein: 15, servingSize: "1 cup", keywords: ["chicken biryani", "biryani"] },
    { name: "Veg Biryani", calories: 200, protein: 5, servingSize: "1 cup", keywords: ["veg biryani", "vegetable biryani"] },
    { name: "Curd Rice", calories: 210, protein: 6, servingSize: "1 cup", keywords: ["curd rice", "thayir sadam"] },

    // Lentils (Dal)
    { name: "Dal Tadka", calories: 180, protein: 10, servingSize: "1 cup", keywords: ["dal", "dal tadka", "yellow dal"] },
    { name: "Dal Makhani", calories: 280, protein: 12, servingSize: "1 cup", keywords: ["dal makhani", "black dal"] },
    { name: "Sambar", calories: 130, protein: 6, servingSize: "1 cup", keywords: ["sambar"] },
    { name: "Rajma", calories: 240, protein: 14, servingSize: "1 cup", keywords: ["rajma", "kidney beans"] },
    { name: "Chana Masala", calories: 260, protein: 15, servingSize: "1 cup", keywords: ["chana", "chole", "chana masala"] },

    // Veg Curries
    { name: "Paneer Butter Masala", calories: 350, protein: 12, servingSize: "1 cup", keywords: ["paneer", "paneer butter masala", "butter paneer"] },
    { name: "Palak Paneer", calories: 280, protein: 16, servingSize: "1 cup", keywords: ["palak paneer"] },
    { name: "Aloo Gobi", calories: 160, protein: 4, servingSize: "1 cup", keywords: ["aloo gobi", "potato cauliflower"] },
    { name: "Bhindi Masala", calories: 140, protein: 3, servingSize: "1 cup", keywords: ["bhindi", "okra"] },
    { name: "Mix Veg", calories: 160, protein: 4, servingSize: "1 cup", keywords: ["mix veg", "mixed vegetable"] },

    // Non-Veg
    { name: "Butter Chicken", calories: 400, protein: 25, servingSize: "1 cup", keywords: ["butter chicken", "murgh makhani"] },
    { name: "Chicken Curry", calories: 280, protein: 22, servingSize: "1 cup", keywords: ["chicken curry"] },
    { name: "Egg Curry", calories: 220, protein: 14, servingSize: "2 eggs + gravy", keywords: ["egg curry", "anda curry"] },
    { name: "Fish Curry", calories: 250, protein: 20, servingSize: "1 cup", keywords: ["fish curry"] },

    // Breakfast / Snacks
    { name: "Idli", calories: 39, protein: 2, servingSize: "1 piece", keywords: ["idli"] },
    { name: "Dosa (Plain)", calories: 133, protein: 4, servingSize: "1 medium", keywords: ["dosa", "plain dosa"] },
    { name: "Masala Dosa", calories: 350, protein: 8, servingSize: "1 medium", keywords: ["masala dosa"] },
    { name: "Poha", calories: 250, protein: 5, servingSize: "1 cup", keywords: ["poha"] },
    { name: "Upma", calories: 220, protein: 6, servingSize: "1 cup", keywords: ["upma"] },
    { name: "Samosa", calories: 260, protein: 4, servingSize: "1 piece", keywords: ["samosa"] },
    { name: "Vada Pav", calories: 300, protein: 6, servingSize: "1 piece", keywords: ["vada pav"] },
    { name: "Boiled Egg", calories: 78, protein: 6, servingSize: "1 large", keywords: ["egg", "boiled egg"] },
    { name: "Omelette", calories: 154, protein: 12, servingSize: "2 eggs", keywords: ["omelette", "omlet"] },

    // Drinks
    { name: "Masala Chai", calories: 100, protein: 3, servingSize: "1 cup", keywords: ["chai", "tea", "masala chai"] },
    { name: "Lassi (Sweet)", calories: 200, protein: 6, servingSize: "1 glass", keywords: ["lassi"] },
    { name: "Buttermilk (Chaas)", calories: 40, protein: 2, servingSize: "1 glass", keywords: ["chaas", "buttermilk"] },
];
