const budgets = { food: 0, fuel: 0, monthly: 0 };
const remaining = { food: 0, fuel: 0, monthly: 0 };
let expenses = { food: [], fuel: [], monthly: [] };
const savedFiles = [];

function setBudget(category) {
  const budgetInput = document.getElementById(`${category}-budget`);
  const remainingDisplay = document.getElementById(`remaining-${category}`);
  
  const budget = parseFloat(budgetInput.value);
  if (!isNaN(budget) && budget > 0) {
    budgets[category] = budget;
    remaining[category] = budget;
    remainingDisplay.textContent = budget;
  }
}

function addExpense(category) {
  const amountInput = document.getElementById(`${category}-amount`);
  const remainingDisplay = document.getElementById(`remaining-${category}`);
  const amount = parseFloat(amountInput.value);
  
  if (!isNaN(amount) && amount > 0 && remaining[category] >= amount) {
    remaining[category] -= amount;
    remainingDisplay.textContent = remaining[category];
    
    const listItem = document.createElement('li');
    listItem.textContent = `${category === 'food' ? 'الأكل' : category === 'fuel' ? 'البترول' : 'المصروف الشهري'}: ${amount} ريال`;
    document.getElementById('expense-list').appendChild(listItem);
    
    expenses[category].push(amount); // حفظ المصاريف في القائمة
    amountInput.value = '';
  } else {
    alert('الميزانية غير كافية أو المبلغ غير صحيح.');
  }
}

function saveExpenses() {
  const fileName = prompt("أدخل اسم الملف للمصاريف الحالية:");
  if (fileName) {
    const data = {
      budgets,
      expenses,
      date: new Date().toLocaleString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    link.click();

    savedFiles.push({ name: fileName, data });
    displaySavedFiles();

    // إعادة تعيين المصاريف لبدء صفحة جديدة
    expenses = { food: [], fuel: [], monthly: [] };
    document.getElementById('expense-list').innerHTML = '';
    for (let category in remaining) {
      remaining[category] = budgets[category];
      document.getElementById(`remaining-${category}`).textContent = budgets[category];
    }
  }
}

function displaySavedFiles() {