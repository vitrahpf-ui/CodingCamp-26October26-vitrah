
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const totalBalanceEl = document.getElementById('totalBalance');
const transactionList = document.getElementById('transactionList');

let chart;

// update tampilan
function init() {
    transactionList.innerHTML = '';
    let total = 0;

    if (transactions.length === 0) {
        transactionList.innerHTML = '<p style="text-align:center; color:#888;">Belum ada transaksi.</p>';
    }

    transactions.forEach((item, index) => {
        total += Number(item.amount);

        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>$${Number(item.amount).toFixed(2)} (${item.category})</small>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(div);
    });

    totalBalanceEl.innerText = `$${total.toFixed(2)}`;
    updateChart();
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Tambah Transaksi
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTransaction = {
        name: nameInput.value,
        amount: parseFloat(amountInput.value),
        category: categorySelect.value
    };

    transactions.push(newTransaction);
    nameInput.value = '';
    amountInput.value = '';
    init();
});

// Hapus Transaksi
function deleteTransaction(index) {
    transactions.splice(index, 1);
    init();
}

// Grafik Chart.js
function updateChart() {
    const categories = { Food: 0, Transport: 0, Fun: 0 };

    transactions.forEach(item => {
        if (categories[item.category] !== undefined) {
            categories[item.category] += Number(item.amount);
        }
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: [categories.Food, categories.Transport, categories.Fun],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b']
            }]
        }
    });
}

// Jalankan saat pertama buka
init();