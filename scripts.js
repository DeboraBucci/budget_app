const expensesList = document.getElementById("expensesAndLoans");
const budgetEl = document.getElementById("budget");
const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");
const greetingEl = document.getElementById("greeting");

const expensesAndLoans = [
  {
    type: "expense",
    name: "Car insurance",
    amount: 250,
    date: new Date("2022-11-07T03:24:00"),
  },
  {
    type: "expense",
    name: "Rent",
    amount: 1250,
    date: new Date("2022-11-11T12:04:00"),
  },
  {
    type: "expense",
    name: "Health insurance",
    amount: 300,
    date: new Date("2022-11-05T08:00:00"),
  },
  {
    type: "loan",
    name: "Personal Loan",
    amount: 500,
    date: new Date("2022-11-07T02:10:00"),
  },
  {
    type: "loan",
    name: "Student Loan",
    amount: 100,
    date: new Date("2022-01-17T14:00:00"),
  },
];

const getName = () => {
  let response = prompt("Welcome! What's your name?");

  // loop runs while response is a number
  while (!isNaN(+response) || response.length > 15) {
    response = prompt("That's not a valid name, try again!");
  }

  return response;
};

const getBudget = () => {
  let response = prompt(`${username}, what's your budget?`);

  // loop runs while response is not a number
  while (isNaN(+response) || response <= 0) {
    response = prompt("That's not a valid budget, try again!");
  }

  return response;
};

const username = getName();
const budget = getBudget();

if (username && budget) {
  alert(`Welcome, ${username}! You have a budget of $${budget}`);
}

greetingEl.textContent += ` ${username}!`;

expensesAndLoans
  .sort((objA, objB) => Number(objB.date) - Number(objA.date))
  .forEach(({ type }, i) => {
    expensesList.innerHTML += `<li class="${
      type === "expense" ? "expense" : "loan"
    }">
        <div class="expense-value">
          <span>${expensesAndLoans[i].name}</span><span>$${
      expensesAndLoans[i].amount
    }</span>
        </div>
        <div>
          <p>${expensesAndLoans[i].date.toLocaleDateString("es-ES")}</p>
          <i class="fa-solid fa-pen-to-square"></i
          ><i class="fa-solid fa-trash"></i>
        </div>
      </li>`;
  });

budgetEl.textContent = `$${budget}`;

const expensesAmount = expensesAndLoans
  .map((obj) => {
    return obj.type === "loan" ? -obj.amount : obj.amount;
  })
  .reduce((prev, curr) => prev + curr, 0);

const innerTextHandler = (amount) => {
  return `${amount < 0 ? "- " : ""}$${Math.abs(amount)}`;
};

expensesEl.innerText = innerTextHandler(expensesAmount);
balanceEl.innerText = innerTextHandler(budget - expensesAmount);
