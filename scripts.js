const greetingEl = document.getElementById("greeting");
const transactionsList = document.getElementById("transactions");

const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");
const budgetEl = document.getElementById("budget");

// BUDGET FORM
const budgetForm = document.getElementById("budget-form");
const budgetBtn = document.getElementById("budget-btn");
const budgetErr = document.getElementById("budget-err");

// TRANSACTION FORM
const transactionForm = document.getElementById("transaction-form");
const transactionValue = document.getElementById("transaction-value");
const transactionBtn = document.getElementById("transaction-btn");
const transactionErr = document.getElementById("transaction-err");

// FUNCTIONS
const formatInnerTextHandler = (amount) =>
  `${amount < 0 ? "- " : ""}$${Math.abs(amount)}`;

const getName = () => {
  let response = prompt("Welcome! What's your name?");
  // loop runs while response is a number
  while (!isNaN(+response) || response.length > 15) {
    response = prompt("That's not a valid name, try again!");
  }

  localStorage.setItem("username", response);
};

const updatBudgetHandler = (budget) => {
  localStorage.setItem("budget", budget);
  initHandler();
};

const updateExpensesAmount = () => {
  const transactionsList = JSON.parse(localStorage.getItem("transactions"));

  const expensesAmount = transactionsList
    .map((transaction) =>
      transaction.type === "loan" ? -transaction.amount : transaction.amount
    )
    .reduce((prev, curr) => prev + curr, 0);

  return expensesAmount;
};

const errorMessageHandler = (
  formElement,
  messageEl,
  msg,
  state = "visible"
) => {
  formElement.style.borderColor = msg ? "#dc143c" : "#e6e6e6";
  messageEl.innerText = msg;
  messageEl.style.display = state === "visible" ? "block" : "none";
};

const updateTransactionList = () => {
  transactionsList.innerHTML = "";

  const listElements = JSON.parse(localStorage.getItem("transactions"));

  listElements.forEach((curr) => {
    transactionsList.innerHTML += `<li class="${
      curr.type === "expense" ? "expense" : "loan"
    }">
      <div class="expense-value">
        <span>${curr.name}</span><span>$${curr.amount}</span>
      </div>
      <div>
        <p>${new Date(curr.date).toLocaleString()}</p>
        <i class="fa-solid fa-pen-to-square"></i
        ><i class="fa-solid fa-trash"></i>
      </div>
    </li>`;
  });
};

// INFORMATION UPDATER FUNCTION
const initHandler = () => {
  if (!localStorage.getItem("transactions"))
    localStorage.setItem("transactions", JSON.stringify([]));
  updateTransactionList();

  if (!localStorage.getItem("username")) getName();
  greetingEl.innerText = `Welcome, ${localStorage.getItem("username")}!`;

  const budget = localStorage.getItem("budget");
  const expensesAmount = updateExpensesAmount();

  budgetEl.innerText = `$${budget || 0}`;
  expensesEl.innerText = formatInnerTextHandler(expensesAmount);
  balanceEl.innerText = `$${+budget - expensesAmount}`;
};
initHandler(); // to keep information after reloading page

// EVENTS
// BUDGET FORM EVENT
budgetBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const budgetEl = budgetForm.elements["budget"];
  const budget = budgetEl.value;

  if (isNaN(+budget) || budget.trim().length === 0)
    return errorMessageHandler(
      budgetEl,
      budgetErr,
      "Invalid value! Please, select a number."
    );

  if (typeof +budget === "number" && +budget < 0)
    return errorMessageHandler(
      budgetEl,
      budgetErr,
      "Invalid value! Please, select a number higher than 0 (e.g. 100)."
    );

  errorMessageHandler(budgetEl, budgetErr, null, "invisible");
  updatBudgetHandler(budget);
});

//  TRANSACTION FORM EVENT
transactionBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const transactionValue = transactionForm.elements["transaction-value"].value;
  const transactionName = transactionForm.elements["transaction-name"].value;

  if (isNaN(+transactionValue) || transactionValue.trim().length === 0)
    return errorMessageHandler(
      transactionValue,
      transactionErr,
      "Invalid value! Please, select a number."
    );

  if (typeof +transactionValue === "number" && +transactionValue < 0)
    return errorMessageHandler(
      transactionValue,
      transactionErr,
      "Invalid value! Please, select a number higher than 0 (e.g. 100)."
    );

  const type = transactionForm.elements["radio-loan"].checked
    ? "loan"
    : "expense";

  const transactions = JSON.parse(localStorage.getItem("transactions"));

  transactions.unshift({
    type: type,
    name: transactionName,
    amount: +transactionValue,
    date: new Date(),
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
});
