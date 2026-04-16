const sampleAnnouncements = [
    {
        id: 1,
        title: "Libreng Bakuna Para sa Lahat",
        content: "May libreng bakuna kontra COVID-19 at Flu sa Barangay Hall sa Sabado, 8:00 AM - 4:00 PM. Magdala ng ID.",
        category: "program",
        date: "2026-04-10",
        author: "Barangay Health Center"
    },
    {
        id: 2,
        title: "Pansamantalang Pagsara ng Kalsada",
        content: "Dahil sa pagkukumpuni ng tubo ng tubig, ang Purok 2 Road ay sarado mula Abril 16-18. Humanap ng alternatibong daan.",
        category: "emergency",
        date: "2026-04-12",
        author: "Barangay Engineering"
    },
    {
        id: 3,
        title: "Barangay Fiesta 2026",
        content: "Inaanyayahan ang lahat sa pagdiriwang ng ika-50 taon ng Barangay Baruyan! May palaro, sayawan, at papremyo sa Mayo 1-3.",
        category: "event",
        date: "2026-04-05",
        author: "Fiesta Committee"
    },
    {
        id: 4,
        title: "Libreng Legal Consultation",
        content: "Magkakaroon ng libreng konsultasyon sa abogado sa Abril 25, 1:00 PM sa Session Hall. First come, first served.",
        category: "program",
        date: "2026-04-08",
        author: "Barangay Council"
    },
    {
        id: 5,
        title: "Nawawalang Power sa Purok 4",
        content: "Asahan ang power interruption sa Purok 4 mula 9:00 AM - 2:00 PM ngayong araw dahil sa maintenance ng ORMECO.",
        category: "emergency",
        date: "2026-04-15",
        author: "ORMECO"
    }
];

const sampleResidents = [
    {
        id: "BRY-2024-001",
        fullName: "Juan Dela Cruz",
        address: "Purok 3, Barangay Baruyan, Calapan City",
        contact: "09123456789",
        birthday: "Enero 1, 1990",
        gender: "Lalaki",
        email: "juan.delacruz@email.com",
        password: "juan123"
    },
    {
        id: "BRY-2024-002",
        fullName: "Maria Santos",
        address: "Purok 1, Barangay Baruyan, Calapan City",
        contact: "09234567890",
        birthday: "Marso 15, 1985",
        gender: "Babae",
        email: "maria.santos@email.com",
        password: "maria123"
    }
];

const defaultResident = {
    id: null,
    fullName: "Bisita",
    address: "-",
    contact: "-",
    birthday: "-",
    gender: "-",
    email: "-"
};

const documentCategories = [
    {
        name: "Barangay Certificates",
        icon: "fa-certificate",
        documents: [
            "Barangay Clearance",
            "Certificate of Indigency",
            "Certificate of Residency",
            "Certificate of Good Moral Character",
            "First Time Job Seeker Certificate",
            "Cedula / Community Tax Certificate"
        ]
    },
    {
        name: "Legal & Protection",
        icon: "fa-gavel",
        documents: [
            "Barangay Protection Order (BPO)",
            "Blotter Report",
            "Barangay Permit"
        ]
    },
    {
        name: "Barangay IDs",
        icon: "fa-id-card",
        documents: [
            "Barangay ID",
            "Solo Parent ID / Certificate",
            "Senior Citizen Certification",
            "Barangay Business Clearance"
        ]
    },
    {
        name: "National IDs",
        icon: "fa-flag",
        documents: [
            "National ID",
            "Driver's License",
            "Passport",
            "UMID ID",
            "Voter's ID",
            "Voter's Certificate"
        ]
    },
    {
        name: "Government Agency IDs",
        icon: "fa-building",
        documents: [
            "TIN ID",
            "PhilHealth ID",
            "Pag-IBIG ID",
            "SSS ID"
        ]
    },
    {
        name: "Clearances",
        icon: "fa-shield-alt",
        documents: [
            "Police Clearance",
            "NBI Clearance"
        ]
    },
    {
        name: "Civil Registry Documents",
        icon: "fa-book",
        documents: [
            "Birth Certificate",
            "Marriage Certificate",
            "Death Certificate"
        ]
    },
    {
        name: "Land & Property",
        icon: "fa-home",
        documents: [
            "Land Title (TCT/OCT)",
            "Deed of Sale",
            "Tax Declaration",
            "Real Property Tax Receipt",
            "Lot Plan / Survey Plan"
        ]
    },
    {
        name: "Building & Lease",
        icon: "fa-building",
        documents: [
            "Building Permit",
            "Occupancy Permit",
            "Contract of Lease",
            "Homeowners Association Clearance"
        ]
    },
    {
        name: "Barangay Clearances & Permits",
        icon: "fa-stamp",
        documents: [
            "Barangay Clearance (Full)",
            "Business Permit",
            "Mayor's Permit"
        ]
    }
];

let currentTab = 'announcements';
let currentFilter = 'all';
let announcements = [];
let requests = [];
let searchTerm = '';
let isLoggedIn = false;
let currentResident = { ...defaultResident };
let registeredResidents = [...sampleResidents];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    checkLoginStatus();
    setupEventListeners();
    renderAnnouncements();
    renderDocumentCategories();
    updateUIForLoginState();
    setGreeting();
    
    switchTab('announcements');
});

function loadData() {
    const storedAnnouncements = localStorage.getItem('barangay_announcements');
    if (storedAnnouncements) {
        announcements = JSON.parse(storedAnnouncements);
    } else {
        announcements = sampleAnnouncements;
        localStorage.setItem('barangay_announcements', JSON.stringify(announcements));
    }
    
    const storedRequests = localStorage.getItem('barangay_requests');
    if (storedRequests) {
        requests = JSON.parse(storedRequests);
    }
    
    const storedResidents = localStorage.getItem('barangay_residents');
    if (storedResidents) {
        registeredResidents = JSON.parse(storedResidents);
    } else {
        localStorage.setItem('barangay_residents', JSON.stringify(registeredResidents));
    }
}

function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('barangay_logged_in_user');
    const rememberMe = localStorage.getItem('barangay_remember_me') === 'true';
    
    if (loggedInUser && rememberMe) {
        const user = JSON.parse(loggedInUser);
        const foundResident = registeredResidents.find(r => r.id === user.id);
        if (foundResident) {
            currentResident = foundResident;
            isLoggedIn = true;
        }
    }
}

function updateUIForLoginState() {
    const welcomeName = document.getElementById('residentNameDisplay');
    const bottomNav = document.getElementById('bottomNav');
    
    if (isLoggedIn && currentResident.id) {
        welcomeName.textContent = currentResident.fullName;
        updateProfileDisplay();
        generateQRCode();
        bottomNav.classList.remove('hidden');
    } else {
        welcomeName.textContent = 'Bisita';
        currentResident = { ...defaultResident };
        updateProfileDisplay();
        
        const qrWrapper = document.getElementById('qrCodeDisplay');
        qrWrapper.innerHTML = `
            <div class="qr-placeholder">
                <i class="fas fa-qrcode"></i>
                <p>Mag-login para makita ang QR code</p>
            </div>
        `;
        document.getElementById('downloadQrBtn').disabled = true;
    }
    
    document.getElementById('qrName').textContent = currentResident.fullName;
    document.getElementById('qrAddress').textContent = currentResident.address === '-' ? '-' : currentResident.address.split(',')[0];
    document.getElementById('qrId').textContent = currentResident.id ? `ID: ${currentResident.id}` : '-';
}

function setGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greetingMessage');
    let greeting = "Magandang Araw!";
    
    if (hour < 12) greeting = "Magandang Umaga!";
    else if (hour < 18) greeting = "Magandang Hapon!";
    else greeting = "Magandang Gabi!";
    
    greetingEl.textContent = greeting;
}

function updateProfileDisplay() {
    document.getElementById('profileName').textContent = currentResident.fullName;
    document.getElementById('profileAddress').textContent = currentResident.address;
    document.getElementById('profileContact').textContent = currentResident.contact;
    document.getElementById('profileBirthday').textContent = currentResident.birthday;
    document.getElementById('profileGender').textContent = currentResident.gender;
    document.getElementById('profileResidentId').textContent = currentResident.id || '-';
}

function generateQRCode() {
    if (!isLoggedIn || !currentResident.id) return;
    
    const qrWrapper = document.getElementById('qrCodeDisplay');
    const downloadBtn = document.getElementById('downloadQrBtn');
    
    const qrData = JSON.stringify({
        id: currentResident.id,
        name: currentResident.fullName,
        address: currentResident.address,
        contact: currentResident.contact
    });
    
    qrWrapper.innerHTML = '';
    
    if (typeof QRCode !== 'undefined') {
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: { dark: '#0f3b2c', light: '#ffffff' }
        }, (error) => {
            if (error) console.error('QR Error:', error);
        });
        qrWrapper.appendChild(canvas);
        downloadBtn.disabled = false;
        
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `QR_${currentResident.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('QR Code na-download na!');
        };
    }
}

function renderDocumentCategories() {
    const container = document.getElementById('documentCategories');
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    let hasResults = false;
    let html = '';
    
    documentCategories.forEach((category, index) => {
        let filteredDocs = category.documents;
        if (searchTermLower) {
            filteredDocs = category.documents.filter(doc => 
                doc.toLowerCase().includes(searchTermLower) ||
                category.name.toLowerCase().includes(searchTermLower)
            );
        }
        
        if (filteredDocs.length === 0) return;
        hasResults = true;
        
        const isExpanded = searchTermLower ? true : (index === 0);
        
        html += `
            <div class="category-section ${isExpanded ? 'expanded' : ''}" data-category="${category.name}">
                <div class="category-header">
                    <div class="category-title">
                        <i class="fas ${category.icon}"></i>
                        <h4>${category.name}</h4>
                        <span>(${filteredDocs.length})</span>
                    </div>
                    <i class="fas fa-chevron-down chevron"></i>
                </div>
                <div class="category-documents">
                    ${filteredDocs.map(doc => `
                        <span class="doc-tag" data-doc="${doc}">
                            <i class="fas fa-file"></i> ${doc}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    if (!hasResults) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Walang nakitang dokumento para sa "${searchTerm}"</p>
            </div>
        `;
    } else {
        container.innerHTML = html;
        
        container.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (!e.target.closest('.doc-tag')) {
                    const section = header.closest('.category-section');
                    section.classList.toggle('expanded');
                }
            });
        });
        
        container.querySelectorAll('.doc-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isLoggedIn) {
                    showToast('Mag-login muna para makapag-request ng dokumento', 'error');
                    switchTab('login');
                    return;
                }
                const docName = tag.dataset.doc;
                openRequestModal(docName);
            });
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const resident = registeredResidents.find(r => r.contact === phone && r.password === password);
    
    if (resident) {
        currentResident = resident;
        isLoggedIn = true;
        
        if (rememberMe) {
            localStorage.setItem('barangay_logged_in_user', JSON.stringify({ id: resident.id }));
            localStorage.setItem('barangay_remember_me', 'true');
        }
        
        updateUIForLoginState();
        showToast(`Welcome, ${resident.fullName}!`, 'success');
        switchTab('announcements');
        
        document.getElementById('loginForm').reset();
    } else {
        showToast('Maling contact number o password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('regFullName').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const birthday = document.getElementById('regBirthday').value;
    const gender = document.getElementById('regGender').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Hindi magkatugma ang password', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Ang password ay dapat hindi bababa sa 6 na karakter', 'error');
        return;
    }
    
    const existingResident = registeredResidents.find(r => r.contact === phone);
    if (existingResident) {
        showToast('May naka-register na sa contact number na ito', 'error');
        return;
    }
    
    const date = new Date(birthday);
    const formattedBirthday = date.toLocaleDateString('tl-PH', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const newResident = {
        id: 'BRY-' + new Date().getFullYear() + '-' + String(registeredResidents.length + 1).padStart(3, '0'),
        fullName,
        address: address + ', Barangay Baruyan, Calapan City',
        contact: phone,
        birthday: formattedBirthday,
        gender,
        email: '',
        password
    };
    
    registeredResidents.push(newResident);
    localStorage.setItem('barangay_residents', JSON.stringify(registeredResidents));
    
    showToast('Matagumpay na nakapag-rehistro! Mag-login para magpatuloy.', 'success');
    
    document.getElementById('registerForm').reset();
    switchTab('login');
    
    document.getElementById('loginPhone').value = phone;
}

function handleLogout() {
    if (confirm('Sigurado ka bang gusto mong mag-logout?')) {
        isLoggedIn = false;
        currentResident = { ...defaultResident };
        localStorage.removeItem('barangay_logged_in_user');
        localStorage.removeItem('barangay_remember_me');
        
        updateUIForLoginState();
        showToast('Matagumpay na naka-logout!', 'success');
        switchTab('announcements');
    }
}

function setupEventListeners() {
    document.getElementById('menuToggle').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('slideMenu').classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('slideMenu');
        const btn = document.getElementById('menuToggle');
        if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
            document.getElementById('slideMenu').classList.remove('show');
        });
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.nav;
            switchTab(tab);
        });
    });
    
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            renderAnnouncements();
        });
    });
    
    const searchInput = document.getElementById('docSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderDocumentCategories();
        });
    }
    
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('requestModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    document.getElementById('documentRequestForm').addEventListener('submit', handleRequestSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('loginPassword');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    document.getElementById('showRegisterLink').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('register');
    });
    
    document.getElementById('showLoginLink').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });
}

function switchTab(tabId) {
    const protectedTabs = ['documents', 'myqr', 'profile'];
    if (protectedTabs.includes(tabId) && !isLoggedIn) {
        showToast('Mag-login muna para ma-access ang pahinang ito', 'error');
        tabId = 'login';
    }
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const tabElement = document.getElementById(`${tabId}Tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.nav === tabId) {
            item.classList.add('active');
        }
    });
    
    currentTab = tabId;
    
    if (tabId === 'myqr' && isLoggedIn) {
        generateQRCode();
    }
    if (tabId === 'documents') {
        renderDocumentCategories();
    }
    if (tabId === 'announcements') {
        renderAnnouncements();
    }
}

function renderAnnouncements() {
    const container = document.getElementById('announcementList');
    let filtered = announcements;
    
    if (currentFilter !== 'all') {
        filtered = announcements.filter(a => a.category === currentFilter);
    }
    
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>Walang anunsyo sa kategoryang ito</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(ann => `
        <div class="announcement-card ${ann.category}">
            <div class="card-header">
                <span class="category-badge">${getCategoryName(ann.category)}</span>
                <span class="date">${formatDate(ann.date)}</span>
            </div>
            <h4>${ann.title}</h4>
            <p>${ann.content}</p>
        </div>
    `).join('');
}

function getCategoryName(cat) {
    const names = { emergency: 'Emergency', program: 'Programa', event: 'Evento' };
    return names[cat] || cat;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tl-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function openRequestModal(docName) {
    if (!isLoggedIn) {
        showToast('Mag-login muna para makapag-request', 'error');
        switchTab('login');
        return;
    }
    
    const modal = document.getElementById('requestModal');
    const titleEl = document.getElementById('modalDocTitle');
    const selectedInput = document.getElementById('selectedDocument');
    
    titleEl.textContent = docName;
    selectedInput.value = docName;
    
    document.getElementById('fullName').value = currentResident.fullName;
    document.getElementById('address').value = currentResident.address;
    document.getElementById('contactNumber').value = currentResident.contact;
    
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('requestModal').classList.remove('show');
    document.getElementById('documentRequestForm').reset();
}

function handleRequestSubmit(e) {
    e.preventDefault();
    
    if (!isLoggedIn) {
        showToast('Mag-login muna para makapag-request', 'error');
        closeModal();
        switchTab('login');
        return;
    }
    
    const docName = document.getElementById('selectedDocument').value;
    
    const request = {
        id: 'REQ-' + Date.now(),
        documentType: docName,
        fullName: document.getElementById('fullName').value,
        address: document.getElementById('address').value,
        contact: document.getElementById('contactNumber').value,
        purpose: document.getElementById('purpose').value || 'N/A',
        fee: 'LIBRE',
        amount: 0,
        status: 'pending',
        requestDate: new Date().toISOString(),
        residentId: currentResident.id
    };
    
    requests.push(request);
    localStorage.setItem('barangay_requests', JSON.stringify(requests));
    
    const allRequests = JSON.parse(localStorage.getItem('barangay_all_requests') || '[]');
    allRequests.push(request);
    localStorage.setItem('barangay_all_requests', JSON.stringify(allRequests));
    
    closeModal();
    showToast('Matagumpay na naisumite ang iyong request!');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#4ade80';
    } else {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#f87171';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}