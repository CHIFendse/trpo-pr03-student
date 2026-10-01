const metricsList = document.getElementById('metricsList');
const operationsTable = document.getElementById('operationsTable');
const operationsCounter = document.getElementById('operationsCounter');
const notificationsList = document.getElementById('notificationsList');
const errorMessage = document.getElementById('errorMessage');
const filterButton = document.getElementById('filterButton');
const addForm = document.getElementById('addForm');
const operationName = document.getElementById('operationName');
const operationStatus = document.getElementById('operationStatus');
const resultToast = document.getElementById('resultToast');
const toastText = document.getElementById('toastText');

let operations = [];
let notifications = [];
let onlyNew = false;

function getStatusClass(status) {
    if (status === 'Готово') {
        return 'text-bg-success';
    }
    if (status === 'В работе') {
        return 'text-bg-warning';
    }
    return 'text-bg-secondary';
}

function showMetrics(metrics) {
    metricsList.innerHTML = '';

    for (const metric of metrics) {
        const column = document.createElement('div');
        column.className = 'col-12 col-sm-6 col-lg-3';
        column.innerHTML = `
            <div class="card h-100 text-center">
                <div class="card-body">
                    <p class="text-muted mb-1">${metric.title}</p>
                    <p class="fs-2 fw-bold mb-0">${metric.value}</p>
                </div>
            </div>
        `;
        metricsList.appendChild(column);
    }
}

function showOperations() {
    operationsTable.innerHTML = '';
    operationsCounter.textContent = operations.length;

    let visible = operations;
    if (onlyNew) {
        visible = operations.filter(function (operation) {
            return operation.status === 'Новая';
        });
    }

    if (visible.length === 0) {
        operationsTable.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Операций нет</td></tr>';
        return;
    }

    for (const operation of visible) {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = operation.id;

        const actionCell = document.createElement('td');
        actionCell.textContent = operation.action;

        const statusCell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge ' + getStatusClass(operation.status);
        badge.textContent = operation.status;
        statusCell.appendChild(badge);

        row.appendChild(idCell);
        row.appendChild(actionCell);
        row.appendChild(statusCell);
        operationsTable.appendChild(row);
    }
}

function showNotifications() {
    notificationsList.innerHTML = '';

    for (const notification of notifications) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-' + notification.type;
        alert.textContent = notification.text;
        notificationsList.appendChild(alert);
    }
}

function showToast(type) {
    const notification = notifications.find(function (item) {
        return item.type === type;
    });

    if (!notification) {
        return;
    }

    resultToast.classList.remove('text-bg-success', 'text-bg-warning');
    resultToast.classList.add('text-bg-' + type);
    toastText.textContent = notification.text;

    bootstrap.Toast.getOrCreateInstance(resultToast).show();
}

function validateName() {
    const value = operationName.value.trim();

    if (value.length < 3) {
        operationName.classList.add('is-invalid');
        operationName.classList.remove('is-valid');
        return false;
    }

    operationName.classList.remove('is-invalid');
    operationName.classList.add('is-valid');
    return true;
}

async function loadData() {
    try {
        const dashboardResponse = await fetch('data/dashboard.json');
        const notificationsResponse = await fetch('data/notifications.json');

        if (!dashboardResponse.ok || !notificationsResponse.ok) {
            throw new Error('Файлы данных не найдены');
        }

        const dashboard = await dashboardResponse.json();
        notifications = await notificationsResponse.json();
        operations = dashboard.rows;

        showMetrics(dashboard.metrics);
        showOperations();
        showNotifications();
    } catch (error) {
        errorMessage.classList.remove('d-none');
        console.warn('Ошибка загрузки данных:', error.message);
    }
}

operationName.addEventListener('input', validateName);

filterButton.addEventListener('click', function () {
    onlyNew = !onlyNew;
    filterButton.textContent = onlyNew ? 'Показать все' : 'Только новые';
    showOperations();
});

addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateName()) {
        showToast('warning');
        return;
    }

    operations.push({
        id: operations.length + 1,
        action: operationName.value.trim(),
        status: operationStatus.value
    });

    showOperations();
    addForm.reset();
    operationName.classList.remove('is-valid');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('addModal')).hide();
    showToast('success');
});

loadData();
