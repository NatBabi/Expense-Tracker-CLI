# Expense-Tracker-CLI
This is a simple expense tracker application that allows you to manage your expenses, set budgets, and export expenses to a CSV file.

## Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd Expense-Tracker
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

### Commands

- **Add a new expense:**
    ```sh
    node Expense-tracker.js add <description> <amount> [category]
    ```
    Example:
    ```sh
    node Expense-tracker.js add "Lunch" 15 "Food"
    ```

- **Delete an expense by ID:**
    ```sh
    node Expense-tracker.js delete --id <id>
    ```
    Example:
    ```sh
    node Expense-tracker.js delete --id 1
    ```

- **List all expenses or filter by category:**
    ```sh
    node Expense-tracker.js list [category]
    ```
    Example:
    ```sh
    node Expense-tracker.js list "Food"
    ```

- **Show total expenses or filter by month:**
    ```sh
    node Expense-tracker.js summary [--month <monthIndex>]
    ```
    Example:
    ```sh
    node Expense-tracker.js summary --month 3
    ```

- **Set a budget for a specific month:**
    ```sh
    node Expense-tracker.js set-budget --month <monthIndex> --amount <amount>
    ```
    Example:
    ```sh
    node Expense-tracker.js set-budget --month 3 --amount 500
    ```

- **Edit the budget for a specific month:**
    ```sh
    node Expense-tracker.js edit-budget --month <monthIndex> --amount <amount>
    ```
    Example:
    ```sh
    node Expense-tracker.js edit-budget --month 3 --amount 600
    ```

- **Export all expenses to a CSV file:**
    ```sh
    node Expense-tracker.js export-csv
    ```

## Project Roadmap

For more details on the project roadmap, visit [Expense Tracker Roadmap](https://roadmap.sh/projects/expense-tracker).

## License

This project is licensed under the MIT License.
