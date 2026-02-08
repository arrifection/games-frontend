import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateDietPlanPDF({
    patientData,
    macroTargets,
    weekPlan,
    dietaryFocus = "",
    selectedDay = null
}) {
    try {
        console.log("Starting PDF generation...", { patientData, macroTargets, weekPlan });

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        if (!patientData) {
            alert("No patient data found. Please complete Step 1.");
            return;
        }

        // Helper to add section heading
        const addHeading = (text, size = 14) => {
            doc.setFontSize(size);
            doc.setFont("helvetica", "bold");
            doc.text(text, 14, y);
            y += 8;
        };

        // Helper to add label-value pair
        const addField = (label, value, col = 14) => {
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(label + ":", col, y);
            doc.setFont("helvetica", "normal");
            doc.text(String(value || "-"), col + 40, y);
            y += 6;
        };

        // ==========================================
        // SECTION 1: PATIENT INFORMATION
        // ==========================================
        addHeading("Patient Information", 14);
        y += 2;

        if (patientData) {
            addField("Patient Name", patientData.name);
            addField("Age", `${patientData.age} years`);
            addField("Gender", patientData.gender);
            addField("Height", `${patientData.height} cm`);
            addField("Weight", `${patientData.weight} kg`);
            addField("Activity Level", patientData.activity_level);
            addField("Goal", patientData.goal);
            addField("Date of Plan", new Date().toLocaleDateString());

            if (patientData.medical_notes) {
                y += 2;
                doc.setFont("helvetica", "bold");
                doc.text("Notes:", 14, y);
                y += 5;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                const notes = doc.splitTextToSize(patientData.medical_notes, pageWidth - 28);
                doc.text(notes, 14, y);
                y += notes.length * 4 + 4;
            }
        }

        y += 8;

        // ==========================================
        // SECTION 2: ENERGY & MACRONUTRIENT SUMMARY
        // ==========================================
        addHeading("Daily Energy & Macronutrient Targets", 14);
        y += 2;

        if (macroTargets) {
            const totalCals = macroTargets.calories || 2000;
            const carbsPct = Math.round((macroTargets.carbs * 4 / totalCals) * 100);
            const proteinPct = Math.round((macroTargets.protein * 4 / totalCals) * 100);
            const fatPct = Math.round((macroTargets.fat * 9 / totalCals) * 100);

            autoTable(doc, {
                startY: y,
                head: [["Nutrient", "Grams", "Percentage"]],
                body: [
                    ["Total Calories", `${totalCals} kcal`, "100%"],
                    ["Carbohydrates", `${macroTargets.carbs}g`, `${carbsPct}%`],
                    ["Protein", `${macroTargets.protein}g`, `${proteinPct}%`],
                    ["Fat", `${macroTargets.fat}g`, `${fatPct}%`],
                ],
                theme: "plain",
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fontStyle: "bold", fillColor: false, textColor: 0 },
                columnStyles: { 0: { fontStyle: "bold" } },
                tableLineColor: [0, 0, 0],
                tableLineWidth: 0.1,
            });
            y = doc.lastAutoTable.finalY + 10;
        }

        // ==========================================
        // SECTION 3: DIETARY FOCUS / APPROACH
        // ==========================================
        if (dietaryFocus && dietaryFocus.trim()) {
            addHeading("Dietary Focus / Approach", 14);
            y += 2;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const focusLines = doc.splitTextToSize(dietaryFocus, pageWidth - 28);
            doc.text(focusLines, 14, y);
            y += focusLines.length * 5 + 8;
        }

        // ==========================================
        // SECTION 4: DAILY MEAL PLAN
        // ==========================================
        const days = selectedDay ? [selectedDay] : Object.keys(weekPlan || {});

        days.forEach((day, dayIndex) => {
            const dayMeals = weekPlan?.[day] || {};

            // Check if need new page
            if (y > 220) {
                doc.addPage();
                y = 20;
            }

            addHeading(`Daily Meal Plan - ${day}`, 14);
            y += 2;

            const mealTypes = [
                { key: "breakfast", label: "Breakfast" },
                { key: "snack", label: "Mid-morning Snack" },
                { key: "lunch", label: "Lunch" },
                { key: "dinner", label: "Dinner" },
            ];

            const tableData = [];

            mealTypes.forEach(({ key, label }) => {
                const foods = dayMeals[key] || [];
                if (foods.length === 0) {
                    tableData.push([label, "-", "-", "-", "-", "-"]);
                } else {
                    const foodNames = foods.map(f => f.name).join(", ");
                    const totalCals = foods.reduce((s, f) => s + (f.calories || 0), 0);
                    const totalCarbs = foods.reduce((s, f) => s + (f.carbohydrates || 0), 0);
                    const totalProtein = foods.reduce((s, f) => s + (f.protein || 0), 0);
                    const totalFat = foods.reduce((s, f) => s + (f.fat || 0), 0);

                    tableData.push([
                        label,
                        foodNames,
                        Math.round(totalCals),
                        Math.round(totalCarbs),
                        Math.round(totalProtein),
                        Math.round(totalFat),
                    ]);
                }
            });

            // Add totals row
            const allFoods = Object.values(dayMeals).flat();
            const dayTotals = allFoods.reduce(
                (acc, f) => ({
                    cals: acc.cals + (f.calories || 0),
                    carbs: acc.carbs + (f.carbohydrates || 0),
                    protein: acc.protein + (f.protein || 0),
                    fat: acc.fat + (f.fat || 0),
                }),
                { cals: 0, carbs: 0, protein: 0, fat: 0 }
            );

            tableData.push([
                "TOTAL",
                "",
                Math.round(dayTotals.cals),
                Math.round(dayTotals.carbs),
                Math.round(dayTotals.protein),
                Math.round(dayTotals.fat),
            ]);

            autoTable(doc, {
                startY: y,
                head: [["Meal", "Foods", "Calories", "Carbs (g)", "Protein (g)", "Fat (g)"]],
                body: tableData,
                theme: "plain",
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fontStyle: "bold", fillColor: false, textColor: 0 },
                columnStyles: {
                    0: { fontStyle: "bold", cellWidth: 30 },
                    1: { cellWidth: 60 },
                },
                tableLineColor: [0, 0, 0],
                tableLineWidth: 0.1,
                didParseCell: (data) => {
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                    }
                },
            });

            y = doc.lastAutoTable.finalY + 12;
        });

        // ==========================================
        // SECTION 5: WEEKLY OVERVIEW (if showing all days)
        // ==========================================
        if (!selectedDay && weekPlan) {
            if (y > 200) {
                doc.addPage();
                y = 20;
            }

            addHeading("Weekly Summary", 14);
            y += 2;

            const summaryData = [];
            Object.keys(weekPlan).forEach((day) => {
                const dayMeals = weekPlan[day] || {};
                const allFoods = Object.values(dayMeals).flat();
                const totalCals = allFoods.reduce((s, f) => s + (f.calories || 0), 0);
                const itemCount = allFoods.length;

                summaryData.push([day, itemCount, Math.round(totalCals)]);
            });

            autoTable(doc, {
                startY: y,
                head: [["Day", "Items", "Total Calories"]],
                body: summaryData,
                theme: "plain",
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fontStyle: "bold", fillColor: false, textColor: 0 },
                columnStyles: { 0: { fontStyle: "bold" } },
                tableLineColor: [0, 0, 0],
                tableLineWidth: 0.1,
            });
        }

        // Save the PDF
        const fileName = patientData?.name
            ? `Diet_Plan_${patientData.name.replace(/\s+/g, "_")}.pdf`
            : "Diet_Plan.pdf";

        doc.save(fileName);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Could not generate PDF: " + error.message);
    }
}
