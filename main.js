const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultP = document.getElementById('result');
const historyList = document.getElementById('historyList');

const HISTORY_KEY = 'conversionHistory';

function loadHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  historyList.innerHTML = '';

  history.forEach(record => {
    const li = document.createElement('li');
    li.textContent = `${record.amount} ${record.from} = ${record.converted} ${record.to} (${new Date(record.date).toLocaleString()})`;
    historyList.appendChild(li);
  });
}

function saveToHistory(record) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

  // Προσθήκη νέας εγγραφής στην αρχή
  history.unshift(record);

  // Κρατάμε μόνο 10 εγγραφές
  if (history.length > 10) history.pop();

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  loadHistory();
}

convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultP.textContent = 'Πρέπει να εισάγεις θετικό αριθμό.';
    return;
  }

  if (from === to) {
    resultP.textContent = `${amount.toFixed(2)} ${from} = ${amount.toFixed(2)} ${to}`;
    return;
  }

  // Στατικές ισοτιμίες (για απλή δοκιμή)
  const rates = {
    EUR: { USD: 1.1, GBP: 0.85 },
    USD: { EUR: 0.91, GBP: 0.77 },
    GBP: { EUR: 1.18, USD: 1.3 }
  };

  const rate = rates[from][to];
  if (!rate) {
    resultP.textContent = 'Δεν υπάρχει διαθέσιμη ισοτιμία για αυτήν τη μετατροπή.';
    return;
  }

  const converted = (amount * rate).toFixed(2);
  resultP.textContent = `${amount.toFixed(2)} ${from} = ${converted} ${to}`;

  // Αποθήκευση στο ιστορικό
  saveToHistory({
    amount: amount.toFixed(2),
    from,
    to,
    converted,
    date: new Date().toISOString()
  });
});

// Φόρτωσε το ιστορικό όταν φορτώνει η σελίδα
window.addEventListener('load', loadHistory);
