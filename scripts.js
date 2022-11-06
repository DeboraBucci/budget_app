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
