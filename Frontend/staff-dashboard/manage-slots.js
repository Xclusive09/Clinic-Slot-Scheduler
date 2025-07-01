document.addEventListener('DOMContentLoaded', () => {
  const jwt = localStorage.getItem('jwt');
  const fetchBtn = document.getElementById('fetchBtn');
  const slotsBody = document.getElementById('slotsBody');
  const errorMsg = document.getElementById('errorMsg');
  const filterDateInput = document.getElementById('filterDate');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const paginationInfo = document.getElementById('paginationInfo');

  let allSlots = [];
  let filteredSlots = [];
  let currentPage = 1;
  const pageSize = 20;

  function paginate(data, page, size) {
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  }

  function renderSlots(data) {
    slotsBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2 border">${item.studentId || ''}</td>
        <td class="px-4 py-2 border">${item.name || ''}</td>
        <td class="px-4 py-2 border">${item.slot ? new Date(item.slot).toLocaleString() : ''}</td>
        <td class="px-4 py-2 border">${item.status || ''}</td>
        <td class="px-4 py-2 border">
          <div class="flex gap-2 flex-wrap">
            <button data-id="${item.id}" data-action="completed" class="markBtn bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Mark Completed</button>
            <button data-id="${item.id}" data-action="cancel" class="markBtn bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Cancel</button>
          </div>
        </td>
      `;
      slotsBody.appendChild(row);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredSlots.length / pageSize) || 1;
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  function goToPage(page) {
    currentPage = page;
    renderSlots(paginate(filteredSlots, currentPage, pageSize));
    updatePagination();
  }

  function filterByDate(dateStr) {
    if (!dateStr) {
      filteredSlots = allSlots;
    } else {
      filteredSlots = allSlots.filter(item => {
        const itemDate = item.slot ? new Date(item.slot).toISOString().slice(0, 10) : '';
        return itemDate === dateStr;
      });
    }
    goToPage(1);
  }
async function fetchSlots() {
  showSpinner();
  errorMsg.textContent = '';
  try {
    const res = await fetch('https://clinic-slot-scheduler.onrender.com/api/slots', {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    if (!res.ok) throw new Error('Failed to fetch slots');
    const slots = await res.json();

    // Only include slots assigned to a student
    const assignedSlots = slots.filter(slot => slot.student_id !== null);

    allSlots = assignedSlots.map(slot => ({
      studentId: slot.student_id || '',
      name: slot.Student ? slot.Student.name : '',
      slot: slot.slot_date && slot.slot_time ? `${slot.slot_date}T${slot.slot_time}` : '',
      status: slot.student_id === null
      ? 'Cancelled'
      : (slot.is_booked ? 'Completed' : 'Pending'),
      id: slot.id
    }));

    filterByDate(filterDateInput.value);
  } catch (err) {
    errorMsg.textContent = 'Error fetching slots: ' + err.message;
    allSlots = [];
    filteredSlots = [];
    renderSlots([]);
    updatePagination();
  }
  hideSpinner();
}

async function updateSlot(id, status) {
  showSpinner();
  try {
    let body = {};
    if (status === 'Completed') {
      body.is_booked = true;
    } else if (status === 'Cancelled') {
      body.is_booked = false;
      body.student_id = null;
    }
    const res = await fetch(`https://clinic-slot-scheduler.onrender.com/api/slots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to update slot');
    showToast(`Marked as ${status}`);
    await fetchSlots();
  } catch (err) {
    showToast('Error updating slot', 'red');
  }
  hideSpinner();
}

  fetchBtn.addEventListener('click', fetchSlots);

  slotsBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('markBtn')) {
      const id = e.target.getAttribute('data-id');
      const action = e.target.getAttribute('data-action');
      const status = action === 'completed' ? 'Completed' : 'Cancelled';
      updateSlot(id, status);
    }
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  });
  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSlots.length / pageSize) || 1;
    if (currentPage < totalPages) goToPage(currentPage + 1);
  });

  filterDateInput.addEventListener('change', () => {
    filterByDate(filterDateInput.value);
  });

  // Default: show all slots if no date filter
  filterDateInput.value = '';
  fetchSlots();
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