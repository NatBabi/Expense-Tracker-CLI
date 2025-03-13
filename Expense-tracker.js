const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'Expense.json');
const BUDGET_FILE_PATH = path.join(__dirname, 'Budget.json');
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

function initializeFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }
}

function initializeBudgetFile() {
  if (!fs.existsSync(BUDGET_FILE_PATH)) {
    fs.writeFileSync(BUDGET_FILE_PATH, JSON.stringify({}));
  }
}

function readExpense() {
  initializeFile();
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function readBudget() {
  initializeBudgetFile();
  return JSON.parse(fs.readFileSync(BUDGET_FILE_PATH, 'utf8'));
}

// Write tasks to file
function writeExpense(expenses) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(expenses, null, 2));
}

function writeBudget(budget) {
  fs.writeFileSync(BUDGET_FILE_PATH, JSON.stringify(budget, null, 2));
}

function addExpense(description, amount, category = 'General') {
  if (!description || isNaN(amount) || parseFloat(amount) <= 0) {
    console.log(
      'Invalid input. Please provide a valid description and a positive amount.'
    );
    return;
  }
  let expenses = readExpense();
  const newExpense = {
    id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
    description,
    amount: parseFloat(amount),
    category,
    Date: new Date().toISOString().slice(0, 10),
  };
  expenses.push(newExpense);
  writeExpense(expenses);
  console.log(`Expense added successfully (ID: ${newExpense.id})`);
}

function deleteExpense(id) {
  if (isNaN(id) || parseInt(id, 10) <= 0) {
    console.log('Invalid ID. Please provide a valid expense ID.');
    return;
  }
  let expenses = readExpense();
  let filteredExpense = expenses.filter((t) => t.id != id);

  if (expenses.length === filteredExpense.length) {
    console.log(`Expense not found (ID: ${id})`);
    return;
  }
  writeExpense(filteredExpense);
  console.log(`Expense deleted successfully (ID: ${id})`);
}

function listExpense(category = null) {
  let expenses = readExpense();

  // Filter by category if provided
  if (category) {
    expenses = expenses.filter(
      (expense) => expense.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Display result
  if (expenses.length === 0) {
    console.log('No Expense Found.');
  } else {
    //Table Header
    console.log(
      `# ${'ID'.padEnd(3)} ${'Date'.padEnd(12)} ${'Description'.padEnd(
        15
      )} ${'Amount'.padEnd(7)} ${'Category'.padEnd(10)}`
    );

    //Table Rows
    expenses.forEach((expense) => {
      console.log(
        `# ${String(expense.id).padEnd(3)} ${expense.Date.padEnd(
          12
        )} ${expense.description.padEnd(15)} $${String(expense.amount).padEnd(
          7
        )} ${expense.category.padEnd(10)}`
      );
    });
  }
}

// Summary of specific month(August, may, march...)
function totalExpense(monthIndex = null) {
  let expenses = readExpense();
  let total = 0;

  if (monthIndex !== null) {
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.Date);
      const expenseMonth = expenseDate.getMonth();

      if (expenseMonth === parseInt(monthIndex, 10) - 1) {
        // Adjusted to match month index
        total += expense.amount;
      }
    });

    if (total === 0) {
      console.log('No expenses found for this month.');
    } else {
      console.log(
        `# Total expenses for ${
          months[parseInt(monthIndex, 10) - 1]
        }: $${total.toFixed(2)}` // Adjusted to match month index
      );
      checkBudget(monthIndex, total); // Check budget after calculating total
    }
  } else if (expenses.length === 0) {
    console.log('No Expense Found.');
  } else {
    expenses.forEach((expense) => {
      total += expense.amount;
    });
    console.log(`# Total expenses: $${total.toFixed(2)}`);
  }
}

function setBudget(monthIndex, amount) {
  if (
    isNaN(monthIndex) ||
    parseInt(monthIndex, 10) < 1 ||
    parseInt(monthIndex, 10) > 12 ||
    isNaN(amount) ||
    parseFloat(amount) <= 0
  ) {
    console.log(
      'Invalid input. Please provide a valid month index (1-12) and a positive amount.'
    );
    return;
  }
  let budget = readBudget();
  budget[monthIndex] = parseFloat(amount);
  writeBudget(budget);
  console.log(
    `Budget set for month ${months[parseInt(monthIndex, 10) - 1]}: $${amount}`
  );
}

function checkBudget(monthIndex, total) {
  let budget = readBudget();
  if (budget[monthIndex] && total > budget[monthIndex]) {
    console.log(
      `Warning: You have exceeded the budget for month ${
        months[parseInt(monthIndex, 10) - 1]
      } by $${(total - budget[monthIndex]).toFixed(2)}`
    );
  }
}

function editBudget(monthIndex, amount) {
  if (
    isNaN(monthIndex) ||
    parseInt(monthIndex, 10) < 1 ||
    parseInt(monthIndex, 10) > 12 ||
    isNaN(amount) ||
    parseFloat(amount) <= 0
  ) {
    console.log(
      'Invalid input. Please provide a valid month index (1-12) and a positive amount.'
    );
    return;
  }
  let budget = readBudget();
  if (budget[monthIndex] !== undefined) {
    budget[monthIndex] = parseFloat(amount);
    writeBudget(budget);
    console.log(
      `Budget updated for month ${
        months[parseInt(monthIndex, 10) - 1]
      }: $${amount}`
    );
  } else {
    console.log(
      `No budget set for month ${
        months[parseInt(monthIndex, 10) - 1]
      }. Use set-budget to set a budget first.`
    );
  }
}

function exportExpensesToCSV() {
  let expenses = readExpense();
  if (expenses.length === 0) {
    console.log('No Expense Found.');
    return;
  }

  const csvHeaders = ['ID', 'Date', 'Description', 'Amount', 'Category'];
  const csvRows = expenses.map((expense) => [
    expense.id,
    expense.Date,
    expense.description,
    expense.amount,
    expense.category,
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map((e) => e.join(','))
    .join('\n');
  // Generate the timestamp for the current date in 'YYYY-MM-DD' format
  const timestamp = new Date().toISOString().split('T')[0]; // Example: "2024-03-12"

  // Create the file path with timestamp
  const csvFilePath = path.join(__dirname, `Expenses_${timestamp}.csv`);

  // Write the CSV content to the file
  fs.writeFileSync(csvFilePath, csvContent);
  console.log(`Expenses exported to ${csvFilePath}`);
}

// Command
const [, , command, ...args] = process.argv;

function getArgValue(argName) {
  const index = args.indexOf(argName);
  if (index !== -1 && args.length > index + 1) {
    return args[index + 1];
  }
  const arg = args.find((arg) => arg.startsWith(argName));
  if (arg) {
    const [name, value] = arg.split('=');
    return value || args[args.indexOf(arg) + 1];
  }
  return null;
}

switch (command) {
  case 'add':
    addExpense(args[0], args[1], args[2]);
    break;
  case 'delete':
    const deleteId = getArgValue('--id');
    deleteExpense(deleteId);
    break;
  case 'summary':
    const monthIndex = getArgValue('--month');
    totalExpense(monthIndex);
    break;
  case 'list':
    listExpense(args[0]);
    break;
  case 'set-budget':
    const budgetMonthIndex = getArgValue('--month');
    const budgetAmount = getArgValue('--amount');
    setBudget(budgetMonthIndex, budgetAmount);
    break;
  case 'edit-budget':
    const editBudgetMonthIndex = getArgValue('--month');
    const editBudgetAmount = getArgValue('--amount');
    editBudget(editBudgetMonthIndex, editBudgetAmount);
    break;
  case 'export-csv':
    exportExpensesToCSV();
    break;
  default:
    console.log(
      'Available commands:\n' +
        '  add <description> <amount> [category] - Add a new expense\n' +
        '  delete --id <id> - Delete an expense by ID\n' +
        '  list [category] - List all expenses or filter by category\n' +
        '  summary [--month <monthIndex>] - Show total expenses or filter by month\n' +
        '  set-budget --month <monthIndex> --amount <amount> - Set a budget for a specific month\n' +
        '  edit-budget --month <monthIndex> --amount <amount> - Edit the budget for a specific month\n' +
        '  export-csv - Export all expenses to a CSV file'
    );
}
