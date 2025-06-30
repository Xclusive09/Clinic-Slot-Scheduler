document.addEventListener('DOMContentLoaded', async () => {
  const slotCard = document.getElementById('slotCard');
  const notification = document.getElementById('notification');
  const studentName = document.getElementById('studentName');
  const studentDept = document.getElementById('studentDept');
  const studentFaculty = document.getElementById('studentFaculty');
  const slotDate = document.getElementById('slotDate');
  const slotTime = document.getElementById('slotTime');
  const downloadBtn = document.getElementById('downloadBtn');
  const qrCodeCanvas = document.getElementById('qrCode');

  const sanitize = (str) => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let data;

  try {
    const response = await fetch('https://clinic-slot-scheduler.onrender.com/api/student-slot');
    if (!response.ok) throw new Error('Unable to retrieve slot.');
    data = await response.json();
    if (!data || !data.slot) throw new Error('No slot assigned');
  } catch (error) {
    console.warn("Using fallback test data:", error);
    data = {
      name: "John Doe",
      department: "Computer Science",
      faculty: "Engineering",
      slot: new Date("2025-07-01T11:00:00")
    };
  }

  studentName.textContent = sanitize(data.name);
  studentDept.textContent = sanitize(data.department);
  studentFaculty.textContent = sanitize(data.faculty);
  slotDate.textContent = new Date(data.slot).toLocaleDateString();
  slotTime.textContent = new Date(data.slot).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  slotCard.classList.remove('hidden');
  notification.textContent = '';

  // QR Code with student slot info
  const qrText = `Student: ${data.name}, Dept: ${data.department}, Slot: ${new Date(data.slot).toLocaleString()}`;
  const qr = new QRious({
    element: qrCodeCanvas,
    value: qrText,
    size: 64
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const element = document.getElementById('pdfContent');
      const opt = {
        margin: 0.5,
        filename: `screening-slot-${data.name.replace(/\\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    });
  }
});
