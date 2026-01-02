app/page.jsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MealPlannerApp() {
  const [meals, setMeals] = useState(() =>
    days.map(day => ({ day, breakfast: "", lunch: "", dinner: "", ingredients: "" }))
  );

  const [pantry, setPantry] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("mealPlannerData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMeals(parsed.meals || meals);
      setPantry(parsed.pantry || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mealPlannerData", JSON.stringify({ meals, pantry }));
  }, [meals, pantry]);

  const updateMeal = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const addPantryItem = () => setPantry([...pantry, { item: "", qty: "" }]);
  const updatePantry = (i, field, value) => {
    const updated = [...pantry];
    updated[i][field] = value;
    setPantry(updated);
  };

  const allIngredients = meals
    .flatMap(m => m.ingredients.split(",").map(i => i.trim().toLowerCase()))
    .filter(Boolean);

  const pantryItems = pantry.map(p => p.item.toLowerCase());
  const shoppingList = [...new Set(allIngredients)].filter(i => !pantryItems.includes(i));

  return (
    <div className="p-6 max-w-6xl mx-auto grid gap-8 bg-slate-50 print:bg-white">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Weekly Family Meal Planner</h1>
        <p className="text-muted-foreground mt-1">Plan smarter • Shop easier • Stress less</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="rounded-2xl shadow-lg border-l-8 border-blue-400">
          <CardContent className="grid gap-4">
            <h2 className="text-2xl font-semibold">🍽 Weekly Meals</h2>
            {meals.map((meal, i) => (
              <div key={meal.day} className="grid lg:grid-cols-6 gap-2 items-center">
                <div className="font-semibold">{meal.day}</div>
                <Input placeholder="Breakfast" value={meal.breakfast} onChange={e => updateMeal(i, "breakfast", e.target.value)} />
                <Input placeholder="Lunch" value={meal.lunch} onChange={e => updateMeal(i, "lunch", e.target.value)} />
                <Input placeholder="Dinner" value={meal.dinner} onChange={e => updateMeal(i, "dinner", e.target.value)} />
                <Input placeholder="Ingredients (comma separated)" value={meal.ingredients} onChange={e => updateMeal(i, "ingredients", e.target.value)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <Card className="rounded-2xl shadow-lg border-l-8 border-green-400">
          <CardContent className="grid gap-3">
            <h2 className="text-2xl font-semibold">🥫 Pantry Inventory</h2>
            {pantry.map((p, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input placeholder="Item" value={p.item} onChange={e => updatePantry(i, "item", e.target.value)} />
                <Input placeholder="Qty" value={p.qty} onChange={e => updatePantry(i, "qty", e.target.value)} />
              </div>
            ))}
            <Button variant="outline" onClick={addPantryItem}>+ Add Pantry Item</Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="print:break-before-page">
        <Card className="rounded-2xl shadow-lg border-l-8 border-orange-400">
          <CardContent className="grid gap-2">
            <h2 className="text-2xl font-semibold">🛒 Shopping List</h2>
            {shoppingList.length === 0 && <p className="text-muted-foreground">Everything is already in your pantry 🎉</p>}
            {shoppingList.map((item, i) => (
              <div key={i} className="text-base">• {item}</div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="hidden print:block text-sm text-center text-gray-500 mt-8">
        Generated with Weekly Family Meal Planner
      </div>
    </div>
  );
}
