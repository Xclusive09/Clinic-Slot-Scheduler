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

  // Use localStorage to sync slot data between pages
  let today = new Date();
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  // Generate 30 students, mixing yesterday, today, and tomorrow for slot dates
  let mockSlots = JSON.parse(localStorage.getItem('clinicSlots')) || (() => {
    const names = [
      "Alice Johnson", "Bob Smith", "Carla Nwosu", "David Lee", "Eve Adams", "Frank Obi", "Grace Kim", "Henry Ford",
      "Ivy Okafor", "Jack Ma", "Kemi Bello", "Liam Ojo", "Mia Zhang", "Noah Musa", "Olivia James", "Paul Okeke",
      "Queen Eze", "Ryan Yusuf", "Sophia Bello", "Tomiwa Ade", "Uche Obi", "Victoria Danjuma", "William Chukwu",
      "Xavier Bello", "Yemi Lawal", "Zara Musa", "Abdul Bello", "Bola Okon", "Chidi Nwafor", "Doris Udo"
    ];
    const slots = [];
    for (let i = 0; i < 30; i++) {
      let dayOffset = i % 3 === 0 ? -1 : (i % 3 === 1 ? 0 : 1); // -1: yesterday, 0: today, 1: tomorrow
      let slotDate = addDays(today, dayOffset);
      slots.push({
        id: `slot${i + 1}`,
        studentId: `FUD/CSC/23/${(i + 1).toString().padStart(3, '0')}`,
        name: names[i % names.length],
        slot: slotDate.toISOString(),
        status: i % 7 === 0 ? "Completed" : (i % 5 === 0 ? "Cancelled" : "Pending")
      });
    }
    return slots;
  })();

  function saveSlotsToStorage() {
    localStorage.setItem('clinicSlots', JSON.stringify(mockSlots));
  }

  function paginate(data, page, size) {
    const start = (page - 1) * size;
    return data.slice(start, start + size);
  }

  function renderSlots(data) {
    slotsBody.innerHTML = '';
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2 border">${item.studentId}</td>
        <td class="px-4 py-2 border">${item.name}</td>
        <td class="px-4 py-2 border">${new Date(item.slot).toLocaleString()}</td>
        <td class="px-4 py-2 border">${item.status}</td>
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

  // Show all slots if no filter date is selected
  function filterByDate(dateStr) {
    if (!dateStr) {
      filteredSlots = allSlots;
    } else {
      filteredSlots = allSlots.filter(item => {
        const itemDate = new Date(item.slot).toISOString().slice(0, 10);
        return itemDate === dateStr;
      });
    }
    goToPage(1);
  }

  function fetchSlots() {
    showSpinner();
    setTimeout(() => {
      hideSpinner();
      // Always reload from storage in case another tab/page updated it
      mockSlots = JSON.parse(localStorage.getItem('clinicSlots')) || mockSlots;
      allSlots = mockSlots;
      filterByDate(filterDateInput.value);
    }, 800);
  }

  function updateSlot(id, status) {
    allSlots = allSlots.map(slot =>
      slot.id === id ? { ...slot, status } : slot
    );
    mockSlots = allSlots;
    saveSlotsToStorage();
    filterByDate(filterDateInput.value);
    showToast(`Marked as ${status}`);
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
fetch('/api/some-endpoint')
  .then(response => response.json())
  .then(data => {
    // handle data if needed
  })
  .catch(error => {
    // handle error if needed
  })
  .finally(() => {
    hideSpinner();
  });