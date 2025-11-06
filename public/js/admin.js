/**
 * Admin Dashboard JavaScript
 * Menangani CRUD lapangan dan moderasi rating
 */

let editMode = false;
let currentLapanganId = null;

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupMenuNavigation();
    setupFormSubmit();
});

/**
 * Setup navigasi menu admin
 */
function setupMenuNavigation() {
    const menuLinks = document.querySelectorAll('.admin-menu a');
    const sections = document.querySelectorAll('.admin-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Jika link bukan anchor (tidak dimulai dengan #), biarkan default behavior
            if (!href.startsWith('#')) {
                return; // Biarkan browser navigate ke URL
            }
            
            e.preventDefault();
            
            // Update active menu
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            const targetId = href.substring(1);
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';
        });
    });
}

/**
 * Setup form submit untuk tambah/edit lapangan
 */
function setupFormSubmit() {
    const form = document.getElementById('lapanganForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Hapus id jika kosong (mode tambah)
        if (!data.id) {
            delete data.id;
        }

        try {
            let url = '/admin/lapangan';
            let method = 'POST';

            if (editMode && currentLapanganId) {
                url = `/admin/lapangan/${currentLapanganId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                closeModal();
                location.reload();
            } else {
                alert(result.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        }
    });
}

/**
 * Tampilkan modal untuk tambah lapangan
 */
function showAddModal() {
    editMode = false;
    currentLapanganId = null;
    
    document.getElementById('modalTitle').textContent = 'Tambah Lapangan';
    document.getElementById('lapanganForm').reset();
    document.getElementById('lapanganId').value = '';
    
    document.getElementById('lapanganModal').style.display = 'block';
}

/**
 * Edit lapangan
 */
async function editLapangan(id) {
    editMode = true;
    currentLapanganId = id;

    try {
        const response = await fetch(`/admin/lapangan/${id}`);
        const result = await response.json();

        if (result.success) {
            const lapangan = result.data;

            // Populate form
            document.getElementById('modalTitle').textContent = 'Edit Lapangan';
            document.getElementById('lapanganId').value = lapangan.id;
            document.getElementById('nama_lapangan').value = lapangan.nama_lapangan;
            document.getElementById('alamat').value = lapangan.alamat;
            document.getElementById('latitude').value = lapangan.latitude;
            document.getElementById('longitude').value = lapangan.longitude;
            document.getElementById('harga_sewa').value = lapangan.harga_sewa;
            document.getElementById('deskripsi').value = lapangan.deskripsi || '';
            document.getElementById('fasilitas').value = lapangan.fasilitas || '';
            document.getElementById('telepon').value = lapangan.telepon || '';
            document.getElementById('jam_operasional').value = lapangan.jam_operasional || '';

            document.getElementById('lapanganModal').style.display = 'block';
        } else {
            alert('Gagal mengambil data lapangan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
    }
}

/**
 * Hapus lapangan
 */
async function deleteLapangan(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
        return;
    }

    try {
        const response = await fetch(`/admin/lapangan/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            location.reload();
        } else {
            alert(result.message || 'Gagal menghapus lapangan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
    }
}

/**
 * Hapus rating (moderasi)
 */
async function deleteRating(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus rating ini?')) {
        return;
    }

    try {
        const response = await fetch(`/admin/rating/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            location.reload();
        } else {
            alert(result.message || 'Gagal menghapus rating');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
    }
}

/**
 * Tutup modal
 */
function closeModal() {
    document.getElementById('lapanganModal').style.display = 'none';
    document.getElementById('lapanganForm').reset();
    editMode = false;
    currentLapanganId = null;
}

// Close modal saat klik di luar modal
window.onclick = function(event) {
    const lapanganModal = document.getElementById('lapanganModal');
    const photoModal = document.getElementById('photoModal');
    
    if (event.target === lapanganModal) {
        closeModal();
    }
    
    if (event.target === photoModal) {
        closePhotoModal();
    }
};

/**
 * Manage Photos - Open modal
 */
async function managePhotos(lapanganId, lapanganNama) {
    document.getElementById('photoModalTitle').textContent = `Kelola Foto: ${lapanganNama}`;
    document.getElementById('photoLapanganId').value = lapanganId;
    document.getElementById('photoModal').style.display = 'block';
    
    // Load existing photos
    await loadPhotos(lapanganId);
    
    // Setup upload form
    setupPhotoUploadForm();
}

/**
 * Load photos for a lapangan
 */
async function loadPhotos(lapanganId) {
    try {
        const response = await fetch(`/admin/photos/lapangan/${lapanganId}`);
        const result = await response.json();
        
        const gallery = document.getElementById('photoGallery');
        
        if (result.success && result.data.length > 0) {
            gallery.innerHTML = '';
            result.data.forEach(photo => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                photoItem.innerHTML = `
                    <img src="${photo.photo_url}" alt="${photo.caption || 'Foto lapangan'}">
                    ${photo.is_primary ? '<span class="photo-primary-badge"><i class="fas fa-star"></i> Utama</span>' : ''}
                    <div class="photo-actions">
                        ${!photo.is_primary ? `
                            <button class="btn-set-primary" onclick="setPrimaryPhoto(${photo.id}, ${lapanganId})">
                                <i class="fas fa-star"></i> Set Utama
                            </button>
                        ` : ''}
                        <button class="btn-delete-photo" onclick="deletePhoto(${photo.id}, ${lapanganId})">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                `;
                gallery.appendChild(photoItem);
            });
        } else {
            gallery.innerHTML = '<p class="text-center" style="color: #999;">Belum ada foto untuk lapangan ini</p>';
        }
    } catch (error) {
        console.error('Error loading photos:', error);
        document.getElementById('photoGallery').innerHTML = '<p class="text-center" style="color: red;">Gagal memuat foto</p>';
    }
}

/**
 * Setup photo upload form
 */
function setupPhotoUploadForm() {
    const form = document.getElementById('photoUploadForm');
    
    // Remove existing listener (if any)
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const lapanganId = document.getElementById('photoLapanganId').value;
        
        try {
            const response = await fetch('/admin/photos/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(result.message);
                newForm.reset();
                await loadPhotos(lapanganId);
            } else {
                alert(result.message || 'Gagal upload foto');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Terjadi kesalahan saat upload foto');
        }
    });
}

/**
 * Set photo as primary
 */
async function setPrimaryPhoto(photoId, lapanganId) {
    if (!confirm('Set foto ini sebagai foto utama?')) return;
    
    try {
        const response = await fetch('/admin/photos/set-primary', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoId, lapanganId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            await loadPhotos(lapanganId);
        } else {
            alert(result.message || 'Gagal set foto utama');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
    }
}

/**
 * Delete photo
 */
async function deletePhoto(photoId, lapanganId) {
    if (!confirm('Hapus foto ini? Tindakan tidak dapat dibatalkan.')) return;
    
    try {
        const response = await fetch(`/admin/photos/${photoId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Foto berhasil dihapus');
            await loadPhotos(lapanganId);
        } else {
            alert(result.message || 'Gagal menghapus foto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
    }
}

/**
 * Close photo modal
 */
function closePhotoModal() {
    document.getElementById('photoModal').style.display = 'none';
    document.getElementById('photoUploadForm').reset();
}

/**
 * ========================================
 * MAP PICKER FUNCTIONALITY
 * ========================================
 */

let pickerMap = null;
let pickerMarker = null;
let selectedLocation = null;

/**
 * Open map picker modal
 */
function openMapPicker() {
    const modal = document.getElementById('mapPickerModal');
    modal.style.display = 'block';
    
    // Initialize map if not already initialized
    setTimeout(() => {
        if (!pickerMap) {
            initPickerMap();
        } else {
            pickerMap.invalidateSize();
        }
    }, 100);
}

/**
 * Initialize picker map
 */
function initPickerMap() {
    // Default center: Padang, Indonesia
    const defaultLat = -0.9471;
    const defaultLng = 100.4172;
    
    // Create map
    pickerMap = L.map('pickerMap').setView([defaultLat, defaultLng], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(pickerMap);
    
    // Add click event to map
    pickerMap.on('click', async function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        await selectLocationFromCoords(lat, lng);
    });
}

/**
 * Search location using Nominatim
 */
async function searchLocation() {
    const query = document.getElementById('mapSearch').value.trim();
    
    if (!query) {
        alert('Masukkan kata kunci pencarian');
        return;
    }
    
    try {
        // Show loading
        document.getElementById('searchResults').innerHTML = '<p style="padding: 1rem;">Mencari...</p>';
        document.getElementById('searchResults').style.display = 'block';
        
        // Search using Nominatim API
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`
        );
        
        const results = await response.json();
        
        if (results.length === 0) {
            document.getElementById('searchResults').innerHTML = '<p style="padding: 1rem;">Tidak ada hasil ditemukan</p>';
            return;
        }
        
        // Display results
        let html = '';
        results.forEach((result, index) => {
            html += `
                <div class="search-result-item" onclick="selectSearchResult(${index})">
                    <strong>${result.display_name.split(',')[0]}</strong>
                    <small>${result.display_name}</small>
                </div>
            `;
        });
        
        document.getElementById('searchResults').innerHTML = html;
        
        // Store results globally
        window.searchResults = results;
        
    } catch (error) {
        console.error('Search error:', error);
        document.getElementById('searchResults').innerHTML = '<p style="padding: 1rem; color: red;">Terjadi kesalahan</p>';
    }
}

/**
 * Select result from search
 */
async function selectSearchResult(index) {
    const result = window.searchResults[index];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Move map to location
    pickerMap.setView([lat, lng], 16);
    
    // Select this location
    await selectLocationFromCoords(lat, lng, result.display_name);
    
    // Hide search results
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('mapSearch').value = '';
}

/**
 * Select location from coordinates
 */
async function selectLocationFromCoords(lat, lng, displayName = null) {
    // Remove existing marker
    if (pickerMarker) {
        pickerMap.removeLayer(pickerMarker);
    }
    
    // Add new marker
    pickerMarker = L.marker([lat, lng]).addTo(pickerMap);
    
    // Get address if not provided
    let addressInfo = displayName;
    let locationName = 'Lokasi Terpilih';
    
    if (!displayName) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            addressInfo = data.display_name;
            locationName = data.name || data.address.road || 'Lokasi Terpilih';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            addressInfo = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    } else {
        locationName = displayName.split(',')[0];
    }
    
    // Store selected location
    selectedLocation = {
        name: locationName,
        address: addressInfo,
        lat: lat,
        lng: lng
    };
    
    // Update UI
    document.getElementById('selectedName').textContent = selectedLocation.name;
    document.getElementById('selectedAddress').textContent = selectedLocation.address;
    document.getElementById('selectedCoords').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    document.getElementById('selectedLocationInfo').style.display = 'block';
    document.getElementById('confirmLocationBtn').disabled = false;
}

/**
 * Confirm and use selected location
 */
function confirmLocation() {
    if (!selectedLocation) {
        alert('Pilih lokasi terlebih dahulu');
        return;
    }
    
    // Fill form fields
    document.getElementById('nama_lapangan').value = selectedLocation.name;
    document.getElementById('alamat').value = selectedLocation.address;
    document.getElementById('latitude').value = selectedLocation.lat.toFixed(6);
    document.getElementById('longitude').value = selectedLocation.lng.toFixed(6);
    
    // Close modal
    closeMapPicker();
    
    alert('Lokasi berhasil dipilih! Silakan lengkapi data lainnya.');
}

/**
 * Close map picker modal
 */
function closeMapPicker() {
    document.getElementById('mapPickerModal').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('selectedLocationInfo').style.display = 'none';
    document.getElementById('confirmLocationBtn').disabled = true;
    selectedLocation = null;
    
    // Remove marker
    if (pickerMarker) {
        pickerMap.removeLayer(pickerMarker);
        pickerMarker = null;
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const lapanganModal = document.getElementById('lapanganModal');
    const photoModal = document.getElementById('photoModal');
    const mapPickerModal = document.getElementById('mapPickerModal');
    
    if (event.target === lapanganModal) {
        closeModal();
    }
    if (event.target === photoModal) {
        closePhotoModal();
    }
    if (event.target === mapPickerModal) {
        closeMapPicker();
    }
}
