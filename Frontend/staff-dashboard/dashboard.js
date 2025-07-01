document.addEventListener('DOMContentLoaded', () => {
  const jwt = localStorage.getItem('jwt');
  const fetchBtn = document.getElementById('fetchBtn');
  const exportBtn = document.getElementById('exportBtn');
  const scheduleBody = document.getElementById('scheduleBody');
  const errorMsg = document.getElementById('errorMsg');
  const statTotal = document.getElementById('statTotal');
  const statCompleted = document.getElementById('statCompleted');
  const statPending = document.getElementById('statPending');
  const statCancelled = document.getElementById('statCancelled');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const paginationInfo = document.getElementById('paginationInfo');
  const filterDateInput = document.getElementById('filterDate');

  const sanitize = (str) => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let allData = [];
  let filteredData = [];
  let currentPage = 1;
  const pageSize = 5;
  let chartInstance = null;

  function getJwt() {
    return localStorage.getItem('jwt');
  }

  function paginate(data, page, size) {
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  }

  function updateStats(data) {
    const total = data.length;
    const completed = data.filter(d => d.status === 'Completed').length;
    const pending = data.filter(d => d.status === 'Pending').length;
    const cancelled = data.filter(d => d.status === 'Cancelled').length;
    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;
    statCancelled.textContent = cancelled;
  }

  function renderSchedule(data) {
    scheduleBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2 border">${item.studentId}</td>
        <td class="px-4 py-2 border">${item.name}</td>
        <td class="px-4 py-2 border">${new Date(item.slot).toLocaleString()}</td>
        <td class="px-4 py-2 border">${item.status}</td>
      `;
      scheduleBody.appendChild(row);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  function goToPage(page) {
    currentPage = page;
    renderSchedule(paginate(filteredData, currentPage, pageSize));
    updatePagination();
  }

  function filterByDate(dateStr) {
    filteredData = allData.filter(item => {
      const itemDate = new Date(item.slot).toISOString().slice(0, 10);
      return itemDate === dateStr;
    });
    updateStats(filteredData);
    goToPage(1);
    drawChart(filteredData);
  }

async function fetchSchedule() {
  showSpinner();
  try {
    const res = await fetch('https://clinic-slot-scheduler.onrender.com/api/schedule', {
      headers: { Authorization: `Bearer ${getJwt()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch schedule');
    let result = await res.json();
    let data = Array.isArray(result.data) ? result.data : [];
    allData = data.map(item => ({
  studentId: item.Student?.student_id || '',
  name: item.Student?.name || '',
  slot: item.slot_date && item.slot_time ? `${item.slot_date}T${item.slot_time}` : '',
  status: slot.is_booked
   ? 'Pending'
  : (slot.student_id === null ? 'Cancelled' : 'Completed'),
  id: item.id
}));
    filterByDate(filterDateInput.value);
  } catch (err) {
    errorMsg.textContent = 'Error fetching schedule: ' + err.message;
    allData = [];
    filteredData = [];
    renderSchedule([]);
    updatePagination();
  }
  hideSpinner();
}

  function drawChart(data) {
    const ctx = document.getElementById('summaryChart').getContext('2d');
    const statusCount = {
      Completed: 0,
      Cancelled: 0,
      Pending: 0
    };

    data.forEach(({ status }) => {
      const key = status || 'Pending';
      statusCount[key] = (statusCount[key] || 0) + 1;
    });

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCount),
        datasets: [{
          data: Object.values(statusCount),
          backgroundColor: ['#16a34a', '#dc2626', '#3b82f6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  function exportCSV() {
    showSpinner();
    fetch('https://clinic-slot-scheduler.onrender.com/api/schedule/export', {
      headers: { Authorization: `Bearer ${getJwt()}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to export CSV');
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'clinic_schedule.csv';
        link.click();
      })
      .catch(() => {
        showToast('Error exporting CSV', 'red');
      })
      .finally(() => {
        hideSpinner();
      });
  }

  fetchBtn.addEventListener('click', fetchSchedule);
  exportBtn.addEventListener('click', exportCSV);

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  });
  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    if (currentPage < totalPages) goToPage(currentPage + 1);
  });

  filterDateInput.addEventListener('change', () => {
    filterByDate(filterDateInput.value);
  });

  // Auto-fetch today on load
  filterDateInput.valueAsDate = new Date();
  fetchSchedule();
});


//toast
function showToast(message, color = 'green') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = message;
  toast.className = `fixed bottom-4 right-4 bg-${color}-600 text-white px-4 py-2 rounded shadow-lg z-50`;
  toast.style.opacity = '1';
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.add('hidden'), 500);
  }, 3000);
}


//loader
function showSpinner() {
  document.getElementById('spinner').classList.remove('hidden');
}

function hideSpinner() {
  document.getElementById('spinner').classList.add('hidden');
}

showSpinner();

  async function fetchCurrentStaff() {
  const token = localStorage.getItem('jwt');
  const response = await fetch('https://clinic-slot-scheduler.onrender.com/api/staff/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.ok) {
    const staff = await response.json();
    // Use staff info as needed
  }
}