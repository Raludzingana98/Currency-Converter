const apiKey = "b1d4abb0005885fc06c52c04"; // Replace with real API key (ExchangeRate-API or similar)
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const favoritesList = document.getElementById('favorites-list');
const toggleModeBtn = document.getElementById('toggle-mode');

let currencySymbols = {};

// Fetch supported currencies dynamically
fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
  .then(res => res.json())
  .then(data => {
    if (data.result === "success") {
      data.supported_codes.forEach(code => {
        currencySymbols[code[0]] = code[1]; // Store code and name
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = code[0];
        option1.text = option2.text = `${code[0]} - ${code[1]}`;
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
      });
    }
  });

// Conversion Function
convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = "Please enter a valid amount!";
    return;
  }

  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`)
    .then(response => response.json())
    .then(data => {
      if (data.result === "success") {
        const rate = data.conversion_rate;
        const converted = (amount * rate).toFixed(2);
        resultDiv.textContent = `${amount} ${from} = ${converted} ${to} (Rate: ${rate})`;
        saveHistory(`${amount} ${from} → ${converted} ${to}`);
      } else {
        resultDiv.textContent = "Error fetching rate.";
      }
    });
});

// Light/Dark Mode Toggle
toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Save & Display History
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

function saveHistory(entry) {
  history.push(entry);
  localStorage.setItem('conversionHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  favoritesList.innerHTML = "";
  history.slice(-5).forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    favoritesList.appendChild(li);
  });
}

const switchBtn = document.getElementById('switch-btn');

switchBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});


renderHistory();
