# Static initial data for seeding MongoDB
EXCHANGE_LIST_INITIAL = []

def create_item(name, portion, group, subgroup, category, carbs, pro, fat, cals):
    return {
        "name": name,
        "portion": portion,
        "group": group,
        "subgroup": subgroup,
        "category": category,
        "carbohydrates": carbs,
        "protein": pro,
        "fat": fat,
        "calories": cals
    }

# --- STARCHES ---
starch_breads = [
    ("Bagel", "1/4 (1 oz)"), ("Biscuit", "1 (2 1/2 in)"), ("Bread", "1 slice"), 
    ("Chapatti", "1 (6 in)"), ("Cornbread", "1 cube"), ("Pita bread", "1/2 pocket")
]
for n, p in starch_breads:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Starches", "Breads", "carb", 15, 3, 1, 80))

starch_cereals = [
    ("Barley", "1/3 cup"), ("Oats", "1/2 cup"), ("Rice (white/brown)", "1/3 cup"), 
    ("Pasta", "1/3 cup"), ("Quinoa", "1/3 cup")
]
for n, p in starch_cereals:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Starches", "Cereals & Grains", "carb", 15, 3, 1, 80))

# --- FRUITS ---
fruits = [
    ("Apple", "1 small"), ("Banana", "1/2 large"), ("Blueberries", "3/4 cup"), 
    ("Grapes", "17 small"), ("Orange", "1 small"), ("Strawberries", "1 1/4 cup")
]
for n, p in fruits:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Fruits", "Fruits", "carb", 15, 0, 0, 60))

# --- MILK ---
milks = [
    ("Skim Milk", "1 cup", "Fat-free", 15, 8, 1, 100),
    ("2% Milk", "1 cup", "Reduced-Fat", 15, 8, 5, 120),
    ("Whole Milk", "1 cup", "Whole", 15, 8, 8, 160)
]
for n, p, s, c, pro, f, cal in milks:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Milk", s, "mixed", c, pro, f, cal))

# --- MEATS ---
meats = [
    ("Chicken breast", "1 oz", "Lean", 0, 7, 2, 45),
    ("Ground beef (85%)", "1 oz", "Medium Fat", 0, 7, 5, 75),
    ("Egg (whole)", "1", "Medium Fat", 0, 7, 5, 75),
    ("Cheddar Cheese", "1 oz", "High Fat", 0, 7, 8, 100)
]
for n, p, s, c, pro, f, cal in meats:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Meat", s, "protein", c, pro, f, cal))

# (Added a few more for variety, but abbreviated version for the seeding file)
    
fats = [
    ("Avocado", "2 Tbsp", "Fats", 0, 0, 5, 45),
    ("Olive oil", "1 tsp", "Fats", 0, 0, 5, 45)
]
for n, p, s, c, pro, f, cal in fats:
    EXCHANGE_LIST_INITIAL.append(create_item(n, p, "Fats", s, "fat", c, pro, f, cal))
