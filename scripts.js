const greetingEl = document.getElementById("greeting");
const transactionBody = document.getElementById("transactions-body");

const dateFormat = document.getElementById("date-format");
const sorting = document.getElementById("sorting");
const showTransactions = document.getElementById("show-transactions");

const apiKey = "duS1L1sMSy5I1OuLJyp5MyGY1gNHhAv4";

const btnDeleteAllTransactions = document.getElementById(
  "btn__delete-all-transactions"
);

const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");
const budgetEl = document.getElementById("curr-budget");

// BUDGET FORM
const budgetForm = document.getElementById("budget-form");
const budgetBtn = document.getElementById("budget-btn");
const budgetErr = document.getElementById("budget-err");

// TRANSACTION FORM
const transactionForm = document.getElementById("transaction-form");
const transactionValue = document.getElementById("transaction-value");
const transactionBtn = document.getElementById("transaction-btn");
const transactionErr = document.getElementById("transaction-err");
const transactionNameErr = document.getElementById("transaction-name-err");
const transactionDateErr = document.getElementById("transaction-date-err");

// FUNCTIONS
const dateFormatHandler = (type, date) => {
  if (type === "default" || type === "short") {
    return new Date(date).toISOString().slice(0, 10);
  }

  if (type === "long") {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const updateElementsDisplay = () => {
  if (localStorage.getItem("username")) {
    document.querySelector(".login__content").style.display = "none";
    document.querySelector(".main").style.display = "block";
    document.querySelector(".navbar__cta").style.display = "block";
    document.querySelector(".navbar__greeting").style.display = "block";
  } else {
    document.querySelector(".login__content").style.display = "block";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".navbar__cta").style.display = "none";
    document.querySelector(".navbar__greeting").style.display = "none";
  }
};

const deleteBtnEvent = () => {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: "swal-custom-class",
      }).then((result) => {
        if (result.isConfirmed) {
          const transactionBody = JSON.parse(
            localStorage.getItem("transactions")
          );
          const filteredTransactionList = transactionBody.filter(
            (currTransaction) => currTransaction.id !== e.target.dataset.id
          );

          localStorage.setItem(
            "transactions",
            JSON.stringify(filteredTransactionList)
          );

          updateState();
          Swal.fire({
            title: "Deleted!",
            text: "Your transaction has been deleted.",
            icon: "success",
            customClass: "swal-custom-class",
          });
        }
      });
    });
  });
};

const formatInnerTextHandler = (amount) =>
  `${amount < 0 ? "- " : ""}$${Math.abs(amount).toFixed(2)}`;

const updatBudgetHandler = (budget) => {
  localStorage.setItem("budget", budget);
  updateState();
};

const updateExpensesAmount = () => {
  const transactionBody = JSON.parse(localStorage.getItem("transactions"));

  const expensesAmount = transactionBody
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

const valueErrorsInForm = (value, el, err) => {
  if (isNaN(+value) || value.trim().length === 0) {
    errorMessageHandler(el, err, "Invalid value! Please, select a number.");
    return false;
  }

  if (typeof +value === "number" && +value < 0) {
    errorMessageHandler(
      el,
      err,
      "Invalid value! Please, select a number higher than 0 (e.g. 100)."
    );
    return false;
  }

  errorMessageHandler(budgetEl, budgetErr, null, "invisible");
  return true;
};

const updateTransactionList = (transactionsArr) => {
  transactionBody.innerHTML = "";
  const currency = localStorage.getItem("currency");
  const currSymbol = currency === "USD" || currency === "ARS" ? "$" : "€";

  transactionsArr.forEach((curr) => {
    transactionBody.innerHTML += `
    <tr class="${curr.type === "expense" ? "expense" : "loan"}">
      <td>${curr.name}</td>
      <td class="transaction-amt">${
        curr.type === "expense" ? "-" : ""
      } ${currSymbol}${curr.amount}</td>
      <td class='transactions-date'>${curr.date}</td>
      <td><i class="fa-solid fa-trash delete-btn" data-id=${curr.id}></i></td>
    </tr>
    `;
  });

  deleteBtnEvent();
};

// INFORMATION UPDATER FUNCTION
const updateState = () => {
  updateElementsDisplay();

  if (!localStorage.getItem("transactions"))
    localStorage.setItem("transactions", JSON.stringify([]));

  if (!localStorage.getItem("datetype"))
    localStorage.setItem("datetype", "short");

  if (!localStorage.getItem("currency"))
    localStorage.setItem("currency", "USD");

  const transactionsArr = JSON.parse(localStorage.getItem("transactions"));
  const currency = localStorage.getItem("currency");

  updateTransactionList(transactionsArr);

  greetingEl.innerText = `Welcome, ${localStorage.getItem("username")}!`;

  const budget = localStorage.getItem("budget");
  const expensesAmount = updateExpensesAmount();

  budgetEl.innerText = formatInnerTextHandler(budget);
  expensesEl.innerText = formatInnerTextHandler(expensesAmount);
  balanceEl.innerText = formatInnerTextHandler(+budget - expensesAmount);
};
updateState(); // to keep information after reloading page

// EVENTS
// BUDGET FORM EVENT
budgetBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const budgetEl = budgetForm.elements["budget"];
  const budget = budgetEl.value;

  const noErrorsInForm = valueErrorsInForm(budget, budgetEl, budgetErr);
  if (!noErrorsInForm) return;

  errorMessageHandler(budgetEl, budgetErr, null, "invisible");
  updatBudgetHandler(budget);

  // CLEAR INPUTS
  budgetEl.value = "";
});

//  TRANSACTION FORM EVENT
transactionBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const transactionEl = transactionForm.elements["transaction-value"];
  const transactionValue = transactionForm.elements["transaction-value"].value;

  const transactionNameEl = transactionForm.elements["transaction-name"];
  const transactionNameValue =
    transactionForm.elements["transaction-name"].value;

  const transactionDateEl = transactionForm.elements["transaction-date"];
  const transactionDateValue =
    transactionForm.elements["transaction-date"].value;

  // CHECK FOR EMPTY NAME INPUT
  if (transactionNameValue.trim().length === 0)
    return errorMessageHandler(
      transactionNameEl,
      transactionNameErr,
      "Invalid name!",
      "visible"
    );
  errorMessageHandler(transactionNameEl, transactionNameErr, null, "invisible");

  // CHECK FOR ERRORS IN THE VALUE INPUT
  const noErrorsInForm = valueErrorsInForm(
    transactionValue,
    transactionEl,
    transactionErr
  );

  if (!noErrorsInForm) return;
  errorMessageHandler(transactionEl, transactionErr, null, "invisible");

  // CHECK FOR EMPTY DATE INPUT
  if (transactionDateValue.trim().length === 0)
    return errorMessageHandler(
      transactionDateEl,
      transactionDateErr,
      "Invalid date!",
      "visible"
    );
  errorMessageHandler(transactionDateEl, transactionDateErr, null, "invisible");

  const type = transactionForm.elements["radio-loan"].checked
    ? "loan"
    : "expense";

  const transactions = JSON.parse(localStorage.getItem("transactions"));

  transactions.unshift({
    type: type,
    name: transactionNameValue,
    amount: +transactionValue,
    date: dateFormatHandler(
      localStorage.getItem("datetype"),
      transactionDateValue
    ),
    id: transactionNameValue + Math.random() * 100,
  });

  Toastify({
    text: "Transaction added!",
    duration: 1500,
    gravity: "top",
    className: "custom-toast-class",
    style: {
      background:
        "linear-gradient(120deg, rgba(255,5,207,1) 0%, rgba(0,212,255,1) 100%)",
    },
  }).showToast();

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList(transactions);
  updateExpensesAmount();
  updateState();

  // CLEAR INPUTS
  transactionForm.elements["transaction-name"].value = "";
  transactionForm.elements["transaction-value"].value = "";
  transactionForm.elements["transaction-date"].value = "";
});

// LOGIN
const loginBtn = document.getElementById("login__btn");
const loginForm = document.getElementById("login__form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const budgetInput = document.getElementById("budget").value;
  const usernameInput = document.getElementById("username").value;

  localStorage.setItem("budget", budgetInput);
  localStorage.setItem("username", usernameInput);

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Successfully logged in :)",
    showConfirmButton: false,
    timer: 1500,
  });

  updateElementsDisplay();
  updateState();

  document.getElementById("budget").value = "";
  document.getElementById("username").value = "";
});

document.querySelector(".btn-logout").addEventListener("click", () => {
  localStorage.clear();
  updateState();
});

btnDeleteAllTransactions.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will lose all your transactions",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete them!",
    customClass: "swal-custom-class",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem("transactions", JSON.stringify([]));

      updateState();
      Swal.fire({
        title: "Deleted!",
        text: "Your transactions have been deleted.",
        icon: "success",
        customClass: "swal-custom-class",
      });
    }
  });
});

dateFormat.addEventListener("click", (e) => {
  const formatOpt = e.target.value;

  localStorage.setItem("datetype", formatOpt);

  const transactions = JSON.parse(localStorage.getItem("transactions"));
  const updatedTransactions = transactions.map((transaction) => {
    const newDateFormat = dateFormatHandler(formatOpt, transaction.date);

    return {
      type: transaction.type,
      name: transaction.name,
      amount: transaction.amount,
      date: newDateFormat,
      dateType: formatOpt,
      id: transaction.id,
    };
  });

  localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  updateState();
});

sorting.addEventListener("click", (e) => {
  const sortingOpt = e.target.value;
  const transactionList = JSON.parse(localStorage.getItem("transactions"));

  let updatedTransactionList = [];

  if (sortingOpt === "amount") {
    updatedTransactionList = transactionList.sort(function (a, b) {
      return b.amount - a.amount;
    });
  } else if (sortingOpt === "date") {
    updatedTransactionList = transactionList.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortingOpt === "name") {
    updatedTransactionList = transactionList.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else {
    return;
  }

  localStorage.setItem("transactions", JSON.stringify(updatedTransactionList));
  updateState();
});

showTransactions.addEventListener("click", (e) => {
  const showOpt = e.target.value;

  if (showOpt === "all" || showOpt === "default") {
    const transactions = JSON.parse(localStorage.getItem("transactions"));
    updateTransactionList(transactions);
  }

  if (showOpt === "expenses") {
    const transactions = JSON.parse(localStorage.getItem("transactions"));

    const filteredTransactions = transactions.filter(
      ({ type }) => type === "expense"
    );
    updateTransactionList(filteredTransactions);
  }

  if (showOpt === "loans") {
    const transactions = JSON.parse(localStorage.getItem("transactions"));

    const filteredTransactions = transactions.filter(
      ({ type }) => type === "loan"
    );

    updateTransactionList(filteredTransactions);
  }
});

const dollarUpdateFunction = () => {
  const dollarOfficial = document.getElementById("official");
  const dollarBlue = document.getElementById("blue");

  fetch("https://criptoya.com/api/dolar")
    .then((response) => response.json())
    .then(({ oficial, blue }) => {
      dollarOfficial.innerHTML += ` ${oficial} ARS`;
      dollarBlue.innerHTML += ` ${blue} ARS`;
    });
};
dollarUpdateFunction();
