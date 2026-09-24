/**
 * JAY DWARKADHIS TRAVELS - NFC Smart Digital Card & Web App
 * Interactive Scripts & Features
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set default travel date to tomorrow
  const travelDateInput = document.getElementById('travelDate');
  if (travelDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    travelDateInput.value = `${yyyy}-${mm}-${dd}`;
    travelDateInput.min = new Date().toISOString().split('T')[0];
  }

  // Initialize QR Code
  initQRCode();

  // Setup Event Listeners
  setupEventListeners();
});

/**
 * Direct Contact Save (.vcf vCard Generator)
 */
function downloadVCard() {
  const contact = {
    firstName: "Jay Dwarkadhis",
    lastName: "Travels",
    fullName: "Jay Dwarkadhis Travels Bhuj",
    org: "Jay Dwarkadhis Travels - 24/7 Taxi & Car Rental",
    title: "Car Rental & Taxi Provider in Bhuj, Kutch",
    phonePrimary: "+919726156147",
    phoneSecondary: "+917433030330",
    street: "tri Mandir, B1/102 Syamjikrushna Varma Hights, Road, Relocation, Ravalvadi",
    city: "Bhuj",
    state: "Gujarat",
    postalCode: "370001",
    country: "India",
    url: window.location.href || "https://g.page/r/CQsknx8aVuEzEBM/review",
    note: "24/7 Car Rental & Taxi Provider in Bhuj, Kutch. Outstation Cabs, Kutch Sightseeing & Rann Utsav, Airport Pickup/Drop, Swift Dzire, Ertiga, Innova Crysta, Tempo Traveller & Luxury Buses across Gujarat & India."
  };

  const vCardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contact.lastName};${contact.firstName};;;`,
    `FN:${contact.fullName}`,
    `ORG:${contact.org}`,
    `TITLE:${contact.title}`,
    `TEL;TYPE=CELL,VOICE,PREF:${contact.phonePrimary}`,
    `TEL;TYPE=WORK,VOICE:${contact.phoneSecondary}`,
    `ADR;TYPE=WORK,POSTAL,PARCEL:;;${contact.street};${contact.city};${contact.state};${contact.postalCode};${contact.country}`,
    `URL:${contact.url}`,
    `NOTE:${contact.note}`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  
  downloadLink.href = downloadUrl;
  downloadLink.setAttribute('download', 'Jay_Dwarkadhis_Travels_Bhuj.vcf');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);

  showToast('📇 Contact Card (.vcf) downloaded! Tap to save.');
}

/**
 * Handle Booking Form Submission -> WhatsApp
 */
function handleBookingSubmit(e) {
  e.preventDefault();

  const tripType = document.getElementById('tripType').value;
  const vehicle = document.getElementById('vehicleChoice').value;
  const pickup = document.getElementById('pickupCity').value.trim();
  const drop = document.getElementById('dropCity').value.trim();
  const date = document.getElementById('travelDate').value;
  const passengers = document.getElementById('passengerCount').value;
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const notes = document.getElementById('tripNotes').value.trim();

  if (!pickup || !drop || !name || !phone) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }

  // Format WhatsApp message
  let message = `*🚕 NEW CAB BOOKING ENQUIRY*\n` +
    `--------------------------------\n` +
    `📍 *Trip Type:* ${tripType}\n` +
    `🚗 *Vehicle:* ${vehicle}\n` +
    `🚩 *Pickup:* ${pickup}\n` +
    `🏁 *Destination:* ${drop}\n` +
    `📅 *Travel Date:* ${date}\n` +
    `👥 *Passengers:* ${passengers} Person(s)\n` +
    `👤 *Customer Name:* ${name}\n` +
    `📞 *Contact Number:* ${phone}\n`;

  if (notes) {
    message += `📝 *Requirements:* ${notes}\n`;
  }

  message += `--------------------------------\n` +
    `_Sent via Jay Dwarkadhis Travels Digital Smart Card_`;

  const targetPhone = '919726156147';
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

  showToast('🚀 Redirecting to WhatsApp for instant confirmation...');
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 400);
}

/**
 * Quick Select Route from Popular Routes List
 */
function selectRoute(pickup, drop) {
  const pickupInput = document.getElementById('pickupCity');
  const dropInput = document.getElementById('dropCity');
  const bookingSection = document.getElementById('bookingSection');

  if (pickupInput && dropInput && bookingSection) {
    pickupInput.value = pickup;
    dropInput.value = drop;

    bookingSection.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight form
    const formCard = document.querySelector('.booking-form-card');
    if (formCard) {
      formCard.style.borderColor = 'var(--gold-primary)';
      formCard.style.boxShadow = '0 0 25px rgba(245, 184, 0, 0.4)';
      setTimeout(() => {
        formCard.style.borderColor = 'var(--border-glass)';
        formCard.style.boxShadow = 'none';
      }, 2000);
    }

    showToast(`📍 Selected: ${pickup} ⇄ ${drop}`);
  }
}

/**
 * Quick Select Destination from Visited Places Sightseeing List
 */
function selectDestination(destination, tripType = 'Kutch Sightseeing / Rann Utsav', defaultVehicle = '') {
  const pickupInput = document.getElementById('pickupCity');
  const dropInput = document.getElementById('dropCity');
  const tripTypeSelect = document.getElementById('tripType');
  const vehicleSelect = document.getElementById('vehicleChoice');
  const bookingSection = document.getElementById('bookingSection');

  if (pickupInput && dropInput && bookingSection) {
    if (!pickupInput.value) pickupInput.value = 'Bhuj';
    dropInput.value = destination;

    if (tripTypeSelect && tripType) {
      tripTypeSelect.value = tripType;
    }

    if (vehicleSelect && defaultVehicle) {
      for (let option of vehicleSelect.options) {
        if (option.value.includes(defaultVehicle.split(' ')[0]) || option.text.includes(defaultVehicle.split(' ')[0])) {
          vehicleSelect.value = option.value;
          break;
        }
      }
    }

    bookingSection.scrollIntoView({ behavior: 'smooth' });

    // Highlight form
    const formCard = document.querySelector('.booking-form-card');
    if (formCard) {
      formCard.style.borderColor = 'var(--gold-primary)';
      formCard.style.boxShadow = '0 0 25px rgba(245, 184, 0, 0.45)';
      setTimeout(() => {
        formCard.style.borderColor = 'var(--border-glass)';
        formCard.style.boxShadow = 'none';
      }, 2200);
    }

    showToast(`🏰 Destination Selected: ${destination}`);
  }
}

/**
 * Copy Office Address to Clipboard
 */
function copyAddress() {
  const addressText = document.getElementById('officeAddressText')?.innerText || 
    'tri Mandir, B1/102 Syamjikrushna Varma Hights, Road, Relocation, Ravalvadi, Bhuj, Gujarat 370001';

  navigator.clipboard.writeText(addressText).then(() => {
    showToast('📋 Office address copied to clipboard!');
  }).catch(() => {
    showToast('Address: Bhuj, Gujarat 370001');
  });
}

/**
 * Share & QR Modal Management
 */
let qrCodeInstance = null;

function initQRCode() {
  const qrContainer = document.getElementById('qrcode');
  if (!qrContainer || typeof QRCode === 'undefined') return;

  const currentUrl = window.location.href;
  qrContainer.innerHTML = '';
  qrCodeInstance = new QRCode(qrContainer, {
    text: currentUrl,
    width: 160,
    height: 160,
    colorDark: "#070c18",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function openShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Native Web Share API or WhatsApp Share
 */
function triggerNativeShare() {
  const shareData = {
    title: 'Jay Dwarkadhis Travels - 24/7 Car Rental Bhuj',
    text: 'Book clean & affordable cabs in Bhuj, Kutch across Gujarat. Swift Dzire, Ertiga, Innova, Tempo Traveller.',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => console.log('Share canceled', err));
  } else {
    copyProfileLink();
  }
}

function shareViaWhatsApp() {
  const shareText = `*JAY DWARKADHIS TRAVELS (Bhuj, Kutch)*\n` +
    `Leading Car Rental & 24/7 Taxi Service in Gujarat.\n` +
    `🚘 Swift Dzire | Ertiga | Innova | Tempo Traveller | Buses\n` +
    `📞 Call/WhatsApp: +91 9726156147\n\n` +
    `View Digital Profile & Book Online:\n${window.location.href}`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  window.open(waUrl, '_blank');
}

function copyProfileLink() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    const copyBtnText = document.getElementById('copyLinkText');
    if (copyBtnText) {
      const orig = copyBtnText.innerText;
      copyBtnText.innerText = 'Copied!';
      setTimeout(() => copyBtnText.innerText = orig, 2000);
    }
    showToast('🔗 Digital Card Link copied!');
  }).catch(() => {
    showToast('Link copied to clipboard!');
  });
}

/**
 * Global Toast Notification Helper
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Call Modal Management
 */
function openCallModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCallModal() {
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Fleet Category Filter Handler
 */
function initFleetFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const fleetCards = document.querySelectorAll('.fleet-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      fleetCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Sightseeing Destination Filter Handler
 */
function initDestinationFilters() {
  const filterPills = document.querySelectorAll('.dest-filter-pill');
  const destinationCards = document.querySelectorAll('.destination-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      destinationCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  // Save Contact Buttons (Hero, Footer, Dock)
  document.getElementById('btnSaveContact')?.addEventListener('click', downloadVCard);
  document.getElementById('btnSaveContactFooter')?.addEventListener('click', downloadVCard);
  document.getElementById('btnSaveContactDock')?.addEventListener('click', downloadVCard);

  // Call Button Options Modal (Hero Call Button & Dock Call Button)
  document.getElementById('btnCallNow')?.addEventListener('click', openCallModal);
  document.getElementById('btnCallDock')?.addEventListener('click', openCallModal);
  document.getElementById('closeCallModal')?.addEventListener('click', closeCallModal);
  document.getElementById('callModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'callModal') closeCallModal();
  });

  // Fleet Filter Tabs
  initFleetFilters();

  // Sightseeing Destinations Filter Tabs
  initDestinationFilters();

  // Booking Form Submit
  document.getElementById('cabBookingForm')?.addEventListener('submit', handleBookingSubmit);

  // Share Modal Open/Close
  document.getElementById('shareProfileBtn')?.addEventListener('click', openShareModal);
  document.getElementById('closeShareModal')?.addEventListener('click', closeShareModal);
  document.getElementById('shareModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') closeShareModal();
  });

  // Modal Share Actions
  document.getElementById('btnNativeShare')?.addEventListener('click', triggerNativeShare);
  document.getElementById('btnShareWhatsApp')?.addEventListener('click', shareViaWhatsApp);
  document.getElementById('btnCopyLink')?.addEventListener('click', copyProfileLink);

  // Keyboard shortcut Esc for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeShareModal();
      closeCallModal();
    }
  });
}


