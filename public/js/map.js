/**
 * Map JavaScript - Leaflet Integration
 * Menangani peta interaktif dan fitur pencarian terdekat
 */

let map;
let markers = [];
let userMarker = null;
let userLocation = null;
let routeLine = null; // Untuk menyimpan garis rute

// Inisialisasi peta saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadMarkers();
    setupEventListeners();
});

/**
 * Inisialisasi peta Leaflet
 * Center: Kota Padang (-0.9471, 100.4172)
 */
function initMap() {
    map = L.map('map').setView([-0.9471, 100.4172], 13);

    // Tambah layer tile dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Icon custom untuk marker
    window.futsalIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

/**
 * Load semua marker lapangan dari server
 */
async function loadMarkers() {
    try {
        const response = await fetch('/api/lapangan');
        const result = await response.json();

        if (result.success) {
            const lapanganList = result.data;
            
            // Hapus marker lama
            markers.forEach(marker => marker.remove());
            markers = [];

            // Tambah marker baru
            lapanganList.forEach(lapangan => {
                const marker = L.marker(
                    [lapangan.latitude, lapangan.longitude],
                    { icon: futsalIcon }
                ).addTo(map);

                // Popup content
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h3 style="margin-bottom: 0.5rem;">${lapangan.nama_lapangan}</h3>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-map-marker-alt"></i> ${lapangan.alamat}
                        </p>
                        <p style="color: #28a745; font-weight: bold; margin-bottom: 0.5rem;">
                            <i class="fas fa-tag"></i> Rp ${parseInt(lapangan.harga_sewa).toLocaleString('id-ID')}/jam
                        </p>
                        <p style="color: #ffc107; margin-bottom: 0.8rem;">
                            <i class="fas fa-star"></i> ${parseFloat(lapangan.avg_rating).toFixed(1)} 
                            (${lapangan.total_reviews} ulasan)
                        </p>
                        <a href="/lapangan/${lapangan.id}" style="
                            display: inline-block;
                            background-color: #4A90E2;
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 5px;
                            text-decoration: none;
                            text-align: center;
                        ">
                            Lihat Detail
                        </a>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markers.push(marker);

                // Event listener untuk marker click
                marker.on('click', function() {
                    highlightLapanganCard(lapangan.id);
                });
            });
        }
    } catch (error) {
        console.error('Error loading markers:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Button: Cari Terdekat
    const findNearbyBtn = document.getElementById('findNearbyBtn');
    if (findNearbyBtn) {
        findNearbyBtn.addEventListener('click', findNearbyLapangan);
    }

    // Button: Refresh Lokasi
    const refreshLocationBtn = document.getElementById('refreshLocationBtn');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', refreshUserLocation);
    }

    // Button: Terapkan Filter
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }

    // Button: Reset Filter
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }

    // Search input: auto-filter on typing (debounced)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500); // 500ms delay after user stops typing
        });
    }

    // Card click: zoom ke marker
    const lapanganCards = document.querySelectorAll('.lapangan-card');
    lapanganCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Jangan trigger jika klik tombol detail
            if (e.target.classList.contains('btn-detail') || e.target.closest('.btn-detail')) {
                return;
            }

            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            
            map.setView([lat, lng], 16);
            
            // Buka popup marker yang sesuai
            markers.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
                    marker.openPopup();
                }
            });
        });
    });
}

/**
 * Highlight card lapangan yang sesuai dengan marker
 */
function highlightLapanganCard(lapanganId) {
    const lapanganCards = document.querySelectorAll('.lapangan-card');
    
    lapanganCards.forEach(card => {
        card.style.backgroundColor = '';
    });

    const targetCard = document.querySelector(`.lapangan-card[data-id="${lapanganId}"]`);
    if (targetCard) {
        targetCard.style.backgroundColor = '#E3F2FD';
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            targetCard.style.backgroundColor = '';
        }, 3000);
    }
}

/**
 * Cari lapangan terdekat berdasarkan lokasi user
 */
function findNearbyLapangan() {
    const btn = document.getElementById('findNearbyBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari lokasi...';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Tambah marker lokasi user
                if (userMarker) {
                    userMarker.remove();
                }

                const userIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('<strong>Lokasi Anda</strong>')
                    .openPopup();

                // Zoom ke lokasi user
                map.setView([userLocation.lat, userLocation.lng], 14);

                // Ambil data lapangan terdekat dari server
                try {
                    const response = await fetch(`/api/lapangan/nearby?latitude=${userLocation.lat}&longitude=${userLocation.lng}`);
                    const result = await response.json();

                    if (result.success) {
                        updateLapanganListWithDistance(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching nearby lapangan:', error);
                    alert('Gagal mengambil data lapangan terdekat');
                }

                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Cari Terdekat';
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Cari Terdekat';
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert('Browser Anda tidak mendukung Geolocation');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Cari Terdekat';
    }
}

/**
 * Refresh lokasi user (force re-detect)
 */
function refreshUserLocation() {
    const btn = document.getElementById('refreshLocationBtn');
    const findBtn = document.getElementById('findNearbyBtn');
    
    // Animasi loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    if (navigator.geolocation) {
        // Force high accuracy dan no cache
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Update/add marker lokasi user
                if (userMarker) {
                    userMarker.setLatLng([userLocation.lat, userLocation.lng]);
                } else {
                    const userIcon = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                        .addTo(map)
                        .bindPopup('<strong>Lokasi Anda (Diperbarui)</strong>');
                }

                userMarker.openPopup();
                map.setView([userLocation.lat, userLocation.lng], 14);

                // Auto fetch lapangan terdekat
                try {
                    const response = await fetch(`/api/lapangan/nearby?latitude=${userLocation.lat}&longitude=${userLocation.lng}`);
                    const result = await response.json();

                    if (result.success) {
                        updateLapanganListWithDistance(result.data);
                        alert(`✅ Lokasi berhasil diperbarui!\n📍 Lat: ${userLocation.lat.toFixed(6)}, Lng: ${userLocation.lng.toFixed(6)}`);
                    }
                } catch (error) {
                    console.error('Error fetching nearby lapangan:', error);
                }

                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMsg = 'Tidak dapat mengakses lokasi Anda.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Izin akses lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Informasi lokasi tidak tersedia. Pastikan GPS aktif.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Timeout. Coba lagi dalam beberapa saat.';
                        break;
                }
                
                alert('❌ ' + errorMsg);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            },
            {
                enableHighAccuracy: true,  // Force GPS accuracy
                timeout: 15000,             // 15 detik timeout
                maximumAge: 0               // No cache, force fresh location
            }
        );
    } else {
        alert('Browser Anda tidak mendukung Geolocation');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    }
}

/**
 * Update daftar lapangan dengan informasi jarak
 * Menggunakan hasil perhitungan Haversine dari backend
 */
function updateLapanganListWithDistance(lapanganData) {
    const lapanganList = document.getElementById('lapanganList');
    
    // Clear dan rebuild list
    lapanganList.innerHTML = '';

    // Data sudah di-sort berdasarkan Haversine distance dari backend
    lapanganData.forEach(lapangan => {
        const card = document.createElement('div');
        card.className = 'lapangan-card';
        card.dataset.id = lapangan.id;
        card.dataset.lat = lapangan.latitude;
        card.dataset.lng = lapangan.longitude;

        card.innerHTML = `
            <h3>${lapangan.nama_lapangan}</h3>
            <p class="address">
                <i class="fas fa-map-marker-alt"></i> ${lapangan.alamat}
            </p>
            <p class="price">
                <i class="fas fa-tag"></i> 
                Rp ${parseInt(lapangan.harga_sewa).toLocaleString('id-ID')}/jam
            </p>
            <div class="rating">
                <i class="fas fa-star"></i>
                ${parseFloat(lapangan.avg_rating).toFixed(1)} 
                (${lapangan.total_reviews} ulasan)
            </div>
            <div class="distance-info" style="display: block;">
                <i class="fas fa-map-pin"></i> 
                <span class="distance-value">${lapangan.distance}</span> km dari lokasi Anda
                <small style="display: block; color: #666; font-size: 0.75rem; margin-top: 0.2rem;">
                    <i class="fas fa-ruler"></i> Jarak lurus (Haversine)
                </small>
            </div>
            <button class="btn btn-route" onclick="showRoute(${lapangan.latitude}, ${lapangan.longitude}, '${lapangan.nama_lapangan}')">
                <i class="fas fa-directions"></i> Lihat Rute
            </button>
            <a href="/lapangan/${lapangan.id}" class="btn btn-detail">
                Detail <i class="fas fa-arrow-right"></i>
            </a>
        `;

        lapanganList.appendChild(card);
    });

    // Re-attach event listeners
    setupEventListeners();
}

// Variable untuk menyimpan layer routing
let currentRouteLayer = null;
let currentRouteMarkers = [];
let currentTransportMode = 'foot'; // Default: jalan kaki

/**
 * Menampilkan rute dari lokasi user ke lapangan dengan mode transportasi
 */
async function showRoute(destLat, destLng, lapanganName, transportMode = 'foot') {
    if (!userLocation) {
        alert('Silakan klik "Cari Terdekat" terlebih dahulu untuk menentukan lokasi Anda');
        return;
    }

    // Simpan mode transportasi
    currentTransportMode = transportMode;

    // Hapus rute sebelumnya jika ada
    clearRoute();

    // Tampilkan loading
    const routePanel = document.getElementById('routePanel');
    if (routePanel) {
        routePanel.style.display = 'block';
        routePanel.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Mencari rute terbaik...</div>';
    }

    try {
        // Panggil OSRM API untuk mendapatkan rute detail
        // Mode: foot-walking (jalan kaki), cycling (sepeda/motor), driving (mobil)
        let osrmMode = 'foot';
        if (transportMode === 'driving') osrmMode = 'driving';
        else if (transportMode === 'bike') osrmMode = 'cycling';
        
        const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmMode}/${userLocation.lng},${userLocation.lat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true&alternatives=false`;
        
        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('Rute tidak ditemukan');
        }

        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;

        // Konversi koordinat dari [lng, lat] ke [lat, lng] untuk Leaflet
        const latlngs = coordinates.map(coord => [coord[1], coord[0]]);

        // Gambar polyline rute di peta
        currentRouteLayer = L.polyline(latlngs, {
            color: getRouteColor(transportMode),
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round'
        }).addTo(map);

        // Zoom ke rute
        map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });

        // Extract step-by-step directions
        const steps = route.legs[0].steps;
        const distance = (route.distance / 1000).toFixed(2); // km
        
        // Hitung estimasi waktu berdasarkan mode transportasi
        // OSRM duration mungkin tidak akurat untuk setiap mode, jadi kita hitung sendiri
        const duration = calculateEstimatedTime(distance, transportMode);

        // Tampilkan panel instruksi rute
        displayRouteInstructions(steps, distance, duration, transportMode, lapanganName, destLat, destLng);

        // Tambah marker untuk setiap turn
        addTurnMarkers(steps);

    } catch (error) {
        console.error('Error fetching route:', error);
        if (routePanel) {
            routePanel.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    Gagal mendapatkan rute. Menggunakan jalur langsung.
                </div>
            `;
        }
        
        // Fallback: gambar garis lurus
        showSimpleRoute(destLat, destLng, lapanganName);
    }
}

/**
 * Menghitung estimasi waktu berdasarkan jarak dan mode transportasi
 * Menggunakan kecepatan rata-rata yang realistis di kota Padang
 */
function calculateEstimatedTime(distance, mode) {
    // Kecepatan rata-rata (km/jam) untuk kondisi jalan di kota dengan traffic
    const speeds = {
        'foot': 5,        // Jalan kaki: 5 km/jam (kecepatan normal)
        'bike': 30,       // Motor/Sepeda: 30 km/jam (lincah, bisa hindari macet)
        'driving': 25     // Mobil: 25 km/jam (ikuti traffic, traffic light, lebih lambat di kota)
    };
    
    const speed = speeds[mode] || speeds['foot'];
    
    // Waktu = Jarak / Kecepatan (dalam jam), convert ke menit
    const timeInHours = parseFloat(distance) / speed;
    const timeInMinutes = Math.ceil(timeInHours * 60);
    
    return timeInMinutes;
}

/**
 * Mendapatkan warna rute berdasarkan mode transportasi
 */
function getRouteColor(mode) {
    const colors = {
        'foot': '#4A90E2',      // Biru untuk jalan kaki
        'bike': '#FF6B6B',      // Merah untuk motor/sepeda
        'driving': '#28a745'    // Hijau untuk mobil
    };
    return colors[mode] || '#4A90E2';
}

/**
 * Mendapatkan icon untuk mode transportasi
 */
function getTransportIcon(mode) {
    const icons = {
        'foot': 'fa-walking',
        'bike': 'fa-motorcycle',
        'driving': 'fa-car'
    };
    return icons[mode] || 'fa-walking';
}

/**
 * Mendapatkan label untuk mode transportasi
 */
function getTransportLabel(mode) {
    const labels = {
        'foot': 'Jalan Kaki',
        'bike': 'Motor/Sepeda',
        'driving': 'Mobil'
    };
    return labels[mode] || 'Jalan Kaki';
}

/**
 * Mendapatkan info kecepatan untuk mode transportasi
 */
function getSpeedInfo(mode) {
    const speedInfo = {
        'foot': 'Avg. 5 km/jam',
        'bike': 'Avg. 30 km/jam',
        'driving': 'Avg. 25 km/jam'
    };
    return speedInfo[mode] || 'Estimasi Waktu';
}

/**
 * Mendapatkan catatan untuk mode transportasi
 */
function getRouteNote(mode) {
    const notes = {
        'foot': 'Estimasi untuk berjalan kaki dengan kecepatan normal (~5 km/jam)',
        'bike': 'Motor/sepeda lebih cepat karena lincah hindari macet (~30 km/jam)',
        'driving': 'Mobil terkendala traffic, traffic light & one-way di kota (~25 km/jam)'
    };
    return notes[mode] || 'Estimasi waktu tempuh berdasarkan kondisi jalan normal';
}

/**
 * Menampilkan instruksi rute step-by-step
 */
function displayRouteInstructions(steps, distance, duration, mode, lapanganName, destLat, destLng) {
    const routePanel = document.getElementById('routePanel');
    if (!routePanel) return;

    let instructionsHTML = `
        <div class="route-header">
            <div class="route-title">
                <i class="fas fa-route"></i>
                <span>Rute ke ${lapanganName}</span>
            </div>
            <button class="btn-close-route" onclick="clearRoute()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="route-summary">
            <div class="summary-item">
                <i class="fas fa-map-marked-alt"></i>
                <div>
                    <strong>${distance} km</strong>
                    <small>Via Jalan Raya</small>
                </div>
            </div>
            <div class="summary-item">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>~${duration} menit</strong>
                    <small>${getSpeedInfo(mode)}</small>
                </div>
            </div>
            <div class="summary-item">
                <i class="fas ${getTransportIcon(mode)}"></i>
                <div>
                    <strong>${getTransportLabel(mode)}</strong>
                    <small>Mode Transport</small>
                </div>
            </div>
        </div>

        <div class="transport-modes">
            <button class="btn-transport ${mode === 'foot' ? 'active' : ''}" onclick="showRoute(${destLat}, ${destLng}, '${lapanganName}', 'foot')">
                <i class="fas fa-walking"></i>
                <span>Jalan Kaki</span>
            </button>
            <button class="btn-transport ${mode === 'bike' ? 'active' : ''}" onclick="showRoute(${destLat}, ${destLng}, '${lapanganName}', 'bike')">
                <i class="fas fa-motorcycle"></i>
                <span>Motor</span>
            </button>
            <button class="btn-transport ${mode === 'driving' ? 'active' : ''}" onclick="showRoute(${destLat}, ${destLng}, '${lapanganName}', 'driving')">
                <i class="fas fa-car"></i>
                <span>Mobil</span>
            </button>
        </div>

        <div class="route-note">
            <i class="fas fa-info-circle"></i>
            <small>
                ${getRouteNote(mode)}
            </small>
        </div>

        <div class="route-steps">
            <h4><i class="fas fa-list-ol"></i> Petunjuk Arah</h4>
    `;

    steps.forEach((step, index) => {
        const distance = (step.distance / 1000).toFixed(2);
        const instruction = getIndonesianInstruction(step);
        const icon = getStepIcon(step.maneuver.type);

        instructionsHTML += `
            <div class="route-step">
                <div class="step-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="step-content">
                    <div class="step-instruction">${instruction}</div>
                    <div class="step-distance">${distance} km</div>
                </div>
            </div>
        `;
    });

    instructionsHTML += `
            <div class="route-step destination">
                <div class="step-icon">
                    <i class="fas fa-flag-checkered"></i>
                </div>
                <div class="step-content">
                    <div class="step-instruction"><strong>Tiba di ${lapanganName}</strong></div>
                </div>
            </div>
        </div>
    `;

    routePanel.innerHTML = instructionsHTML;
    routePanel.style.display = 'block';
}

/**
 * Mendapatkan instruksi dalam bahasa Indonesia
 */
function getIndonesianInstruction(step) {
    const maneuver = step.maneuver;
    const type = maneuver.type;
    const modifier = maneuver.modifier || '';
    const streetName = step.name || 'jalan';

    const instructions = {
        'depart': `Mulai dari ${streetName}`,
        'turn': {
            'left': `Belok kiri ke ${streetName}`,
            'right': `Belok kanan ke ${streetName}`,
            'slight left': `Ambil sedikit ke kiri ke ${streetName}`,
            'slight right': `Ambil sedikit ke kanan ke ${streetName}`,
            'sharp left': `Belok tajam ke kiri ke ${streetName}`,
            'sharp right': `Belok tajam ke kanan ke ${streetName}`
        },
        'continue': `Lurus terus di ${streetName}`,
        'merge': `Bergabung ke ${streetName}`,
        'ramp': `Ambil jalan tol`,
        'roundabout': `Masuk bundaran dan keluar di ${streetName}`,
        'arrive': `Tiba di tujuan`
    };

    if (type === 'turn' && instructions[type][modifier]) {
        return instructions[type][modifier];
    }

    return instructions[type] || `Lanjutkan di ${streetName}`;
}

/**
 * Mendapatkan icon untuk jenis manuver
 */
function getStepIcon(maneuverType) {
    const icons = {
        'depart': 'fa-location-arrow',
        'turn': 'fa-turn-up',
        'continue': 'fa-arrow-up',
        'merge': 'fa-code-merge',
        'arrive': 'fa-flag-checkered',
        'roundabout': 'fa-circle-notch',
        'ramp': 'fa-road'
    };
    return icons[maneuverType] || 'fa-arrow-right';
}

/**
 * Menambahkan marker untuk setiap belokan
 */
function addTurnMarkers(steps) {
    steps.forEach((step, index) => {
        if (step.maneuver.type === 'turn' || step.maneuver.type === 'roundabout') {
            const location = step.maneuver.location;
            const marker = L.circleMarker([location[1], location[0]], {
                radius: 6,
                fillColor: '#fff',
                color: '#FF6B6B',
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(map);

            currentRouteMarkers.push(marker);
        }
    });
}

/**
 * Fallback: Tampilkan rute sederhana (garis lurus)
 */
function showSimpleRoute(destLat, destLng, lapanganName) {
    const latlngs = [
        [userLocation.lat, userLocation.lng],
        [destLat, destLng]
    ];

    currentRouteLayer = L.polyline(latlngs, {
        color: '#FF6B6B',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);

    map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });

    const distance = calculateDistanceFromUser(destLat, destLng);
    currentRouteLayer.bindPopup(`
        <div style="text-align: center;">
            <strong>Rute ke ${lapanganName}</strong><br>
            <i class="fas fa-route"></i> Jarak: ${distance} km<br>
        </div>
    `).openPopup();
}

/**
 * Helper function untuk menghitung jarak dari user location
 */
function calculateDistanceFromUser(lat, lng) {
    if (!userLocation) return 0;
    
    const R = 6371;
    const dLat = toRad(lat - userLocation.lat);
    const dLon = toRad(lng - userLocation.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Hapus rute yang sedang ditampilkan
 */
function clearRoute() {
    // Hapus route layer
    if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
        currentRouteLayer = null;
    }

    // Hapus semua marker belokan
    currentRouteMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    currentRouteMarkers = [];

    // Sembunyikan panel rute
    const routePanel = document.getElementById('routePanel');
    if (routePanel) {
        routePanel.style.display = 'none';
        routePanel.innerHTML = '';
    }

    // Zoom kembali ke view semua marker
    if (userMarker && markers.length > 0) {
        const bounds = L.featureGroup([userMarker, ...markers]).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Terapkan filter dan search
 */
async function applyFilters() {
    try {
        // Ambil nilai filter
        const search = document.getElementById('searchInput').value.trim();
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const minRating = document.getElementById('minRating').value;
        const sortBy = document.getElementById('sortBy').value;

        // Build query string
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (minRating) params.append('minRating', minRating);
        if (sortBy) params.append('sortBy', sortBy);

        // Fetch filtered data
        const response = await fetch(`/api/lapangan/filter?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
            updateMapAndList(result.data);
        } else {
            alert('Gagal memuat data lapangan');
        }
    } catch (error) {
        console.error('Error applying filters:', error);
        alert('Terjadi kesalahan saat memfilter data');
    }
}

/**
 * Reset semua filter
 */
async function resetFilters() {
    // Reset input values
    document.getElementById('searchInput').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('minRating').value = '';
    document.getElementById('sortBy').value = '';

    // Load all lapangan (tanpa filter)
    loadMarkers();
}

/**
 * Update peta dan daftar lapangan dengan data baru
 */
function updateMapAndList(lapanganList) {
    // Hapus marker lama
    markers.forEach(marker => marker.remove());
    markers = [];

    // Update daftar di sidebar
    const lapanganListContainer = document.getElementById('lapanganList');
    
    if (lapanganList.length === 0) {
        lapanganListContainer.innerHTML = '<p class="no-data">Tidak ada lapangan yang sesuai dengan filter.</p>';
        return;
    }

    // Generate HTML untuk daftar
    let html = '';
    lapanganList.forEach(lapangan => {
        html += `
            <div class="lapangan-card" data-id="${lapangan.id}" 
                 data-lat="${lapangan.latitude}" 
                 data-lng="${lapangan.longitude}">
                <h3>${lapangan.nama_lapangan}</h3>
                <p class="address">
                    <i class="fas fa-map-marker-alt"></i> ${lapangan.alamat}
                </p>
                <p class="price">
                    <i class="fas fa-tag"></i> 
                    Rp ${parseInt(lapangan.harga_sewa).toLocaleString('id-ID')}/jam
                </p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    ${parseFloat(lapangan.avg_rating || 0).toFixed(1)} 
                    (${lapangan.total_reviews || 0} ulasan)
                </div>
                <div class="distance-info" style="display: none;">
                    <i class="fas fa-route"></i> <span class="distance-value"></span> km
                </div>
                <a href="/lapangan/${lapangan.id}" class="btn btn-detail">
                    Detail <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        // Tambah marker ke peta
        const marker = L.marker(
            [lapangan.latitude, lapangan.longitude],
            { icon: futsalIcon }
        ).addTo(map);

        // Popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin-bottom: 0.5rem;">${lapangan.nama_lapangan}</h3>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-map-marker-alt"></i> ${lapangan.alamat}
                </p>
                <p style="color: #28a745; font-weight: bold; margin-bottom: 0.5rem;">
                    <i class="fas fa-tag"></i> Rp ${parseInt(lapangan.harga_sewa).toLocaleString('id-ID')}/jam
                </p>
                <p style="color: #ffc107; margin-bottom: 0.8rem;">
                    <i class="fas fa-star"></i> ${parseFloat(lapangan.avg_rating || 0).toFixed(1)} 
                    (${lapangan.total_reviews || 0} ulasan)
                </p>
                <a href="/lapangan/${lapangan.id}" style="
                    display: inline-block;
                    background-color: #4A90E2;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    text-decoration: none;
                    text-align: center;
                ">
                    Lihat Detail
                </a>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);

        // Event listener untuk marker click
        marker.on('click', function() {
            highlightLapanganCard(lapangan.id);
        });
    });

    lapanganListContainer.innerHTML = html;

    // Setup event listeners untuk card yang baru
    setupEventListeners();

    // Fit map bounds untuk menampilkan semua marker
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
}

