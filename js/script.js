// SELECT ELEMENTS
const balanceTotalEl = document.querySelector(".balance p");
const incomeTotalEl = document.querySelector(".income p");
const expenseTotalEl = document.querySelector(".expense p");
const incomeEl = document.querySelector("#menu-income");
const expenseEl = document.querySelector("#menu-expense");
const allEl = document.querySelector("#menu-all");
const incomeList = document.querySelector("#menu-income .menu__ul");
const expenseList = document.querySelector("#menu-expense .menu__ul");
const allList = document.querySelector("#menu-all .menu__ul");
const mainMenu = document.querySelector(".menu");
const arrow = document.querySelector(".menu__arrow");

// SELECT BUTTONS
const allButton = document.querySelector(".filter__btn-all");
const incomeButton = document.querySelector(".filter__btn-income");
const expenseButton = document.querySelector(".filter__btn-expense");

// SELECT INPUTS
const categoryInput = document.querySelector(".input__category");
const costInput = document.querySelector(".input__cost");
const select = document.querySelector(".circulation__select");
const addButton = document.querySelector(".add__button");

// VARIABLES

let balance = 0,
  income = 0,
  expense = 0;
let ENTRY_LIST;

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();
expenseButton.addEventListener("click", function () {
  active(expenseButton);
  inactive([incomeButton, allButton]);
  show(expenseEl);
  hide([incomeEl, allEl]);
});

incomeButton.addEventListener("click", function () {
  active(incomeButton);
  inactive([expenseButton, allButton]);
  show(incomeEl);
  hide([expenseEl, allEl]);
});

allButton.addEventListener("click", function () {
  active(allButton);
  inactive([incomeButton, expenseButton]);
  show(allEl);
  hide([incomeEl, expenseEl]);
});

arrow.addEventListener("click", function () {
  arrow.classList.toggle("active");
  mainMenu.classList.toggle("active");
});

addButton.addEventListener("click", function () {
  if (!categoryInput.value || !costInput.value) return;

  let circulation = {
    type: select.value,
    category: categoryInput.value,
    amount: Number(costInput.value),
  };

  ENTRY_LIST.push(circulation);

  updateUI();
  clearInputs([categoryInput, costInput]);
});
incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

function deleteOrEdit(e) {
  const targetBtn = e.target;
  const buttonsGroup = targetBtn.parentNode;
  const entry = buttonsGroup.parentNode;
  if (targetBtn.classList.contains("delete")) {
    deleteEntry(entry);
  } else if (targetBtn.classList.contains("edit")) {
    editEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  expense = calculateTotal("expense", ENTRY_LIST);
  balance = calculateBalance(income, expense);

  balanceTotalEl.innerText = `Balance: ${balance}$`;
  incomeTotalEl.innerText = `Income: ${income}$`;
  expenseTotalEl.innerText = `Expense: ${expense}$`;

  clearElements([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.category, entry.amount, index);
    } else if (entry.type === "income") {
      showEntry(incomeList, entry.type, entry.category, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.category, entry.amount, index);
  });

  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, category, amount, id) {
  const entry = `<li id="${id}" class="menu__li">
  <div class="category">${category}</div>
  <div class="amountAndType">
  <div class="amount">${amount}</div>
  <div class="type">${type}</div>
  </div>
  <div class="aditional">
    <div class="edit"><i class="fas fa-edit fa-2x"></i></div>
    <div class="delete"><i class="fas fa-times fa-2x"></i></div>
  </div>
  </li>`;
  const position = "afterbegin";

  list.insertAdjacentHTML(position, entry);
}

function clearElements(elements) {
  elements.forEach((el) => {
    el.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;
  list.forEach((entry) => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  });

  return sum;
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearInputs(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function active(button) {
  button.classList.add("active");
}

function inactive(buttons) {
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function deletePosition(e) {
  const entry = e.target.parentNode;
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}
