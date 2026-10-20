const metricsList = document.getElementById('metricsList');
const noticesList = document.getElementById('noticesList');
const toastText = document.getElementById('toastText');
const errorBox = document.getElementById('error');
const nameInput = document.getElementById('name');
const statusSelect = document.getElementById('status');
const addForm = document.getElementById('addForm');
const tableBody = document.getElementById('tableBody');
const count = document.getElementById('count');
const toggleBtn = document.getElementById('toggleBtn');
const tableBox = document.getElementById('tableBox');

function addRow(id, action, status) {
    const row = tableBody.insertRow();
    row.insertCell().textContent = id;
    row.insertCell().textContent = action;
    row.insertCell().textContent = status;
    count.textContent = tableBody.rows.length;
}

function addMetric(metric) {
    metricsList.innerHTML +=
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<div class="card text-center"><div class="card-body">' +
        metric.title + '<b class="d-block fs-2">' + metric.value + '</b>' +
        '</div></div></div>';
}

function addNotice(notice) {
    noticesList.innerHTML += '<div class="alert alert-' + notice.type + '">' + notice.text + '</div>';
}

async function loadData() {
    try {
        const dashboardResponse = await fetch('data/dashboard.json');
        const dashboard = await dashboardResponse.json();
        const noticesResponse = await fetch('data/notifications.json');
        const notices = await noticesResponse.json();

        for (const metric of dashboard.metrics) {
            addMetric(metric);
        }
        for (const row of dashboard.rows) {
            addRow(row.id, row.action, row.status);
        }
        for (const notice of notices) {
            addNotice(notice);
        }
        toastText.textContent = notices[0].text;
    } catch (error) {
        errorBox.classList.remove('d-none');
    }
}

function validateName() {
    if (nameInput.value.trim().length < 3) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        return false;
    }
    nameInput.classList.add('is-valid');
    nameInput.classList.remove('is-invalid');
    return true;
}

nameInput.addEventListener('input', validateName);

addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateName()) {
        return;
    }

    addRow(tableBody.rows.length + 1, nameInput.value.trim(), statusSelect.value);

    addForm.reset();
    nameInput.classList.remove('is-valid');

    bootstrap.Modal.getOrCreateInstance(document.getElementById('addModal')).hide();
    bootstrap.Toast.getOrCreateInstance(document.getElementById('toast')).show();
});

toggleBtn.addEventListener('click', function () {
    tableBox.classList.toggle('d-none');

    if (tableBox.classList.contains('d-none')) {
        toggleBtn.textContent = 'Показать таблицу';
    } else {
        toggleBtn.textContent = 'Скрыть таблицу';
    }
});

loadData();
