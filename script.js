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

const currentResident = {
    id: "BRY-2024-001",
    fullName: "Juan Dela Cruz",
    address: "Purok 3, Barangay Baruyan, Calapan City",
    contact: "0912 345 6789",
    birthday: "Enero 1, 1990",
    gender: "Lalaki",
    email: "juan.delacruz@email.com"
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

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    renderAnnouncements();
    renderDocumentCategories();
    updateProfileDisplay();
    generateQRCode();
    setGreeting();
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
}

function setGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greetingMessage');
    let greeting = "Magandang Araw!";
    
    if (hour < 12) greeting = "Magandang Umaga!";
    else if (hour < 18) greeting = "Magandang Hapon!";
    else greeting = "Magandang Gabi!";
    
    greetingEl.textContent = greeting;
    document.getElementById('residentNameDisplay').textContent = currentResident.fullName;
}

function updateProfileDisplay() {
    document.getElementById('profileName').textContent = currentResident.fullName;
    document.getElementById('profileAddress').textContent = currentResident.address;
    document.getElementById('profileContact').textContent = currentResident.contact;
    document.getElementById('profileBirthday').textContent = currentResident.birthday;
    document.getElementById('profileGender').textContent = currentResident.gender;
    document.getElementById('profileResidentId').textContent = currentResident.id;
    
    document.getElementById('qrName').textContent = currentResident.fullName;
    document.getElementById('qrAddress').textContent = currentResident.address.split(',')[0];
    document.getElementById('qrId').textContent = `ID: ${currentResident.id}`;
}

function generateQRCode() {
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
        // Filter documents based on search term
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
                const docName = tag.dataset.doc;
                openRequestModal(docName);
            });
        });
    }
}

function setupEventListeners() {
    // Menu toggle
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
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderDocumentCategories();
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('requestModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    document.getElementById('documentRequestForm').addEventListener('submit', handleRequestSubmit);
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Sigurado ka bang gusto mong mag-logout?')) {
            showToast('Matagumpay na naka-logout!');
        }
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabId}Tab`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.nav === tabId) {
            item.classList.add('active');
        }
    });
    
    currentTab = tabId;
    
    if (tabId === 'myqr') {
        generateQRCode();
    }
    if (tabId === 'documents') {
        renderDocumentCategories();
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