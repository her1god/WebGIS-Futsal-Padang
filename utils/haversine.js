/**
 * Algoritma Haversine untuk menghitung jarak antara dua titik koordinat
 * Formula: d = 2 * R * arcsin(sqrt(sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)))
 * 
 * @param {number} lat1 - Latitude titik pertama (dalam derajat)
 * @param {number} lon1 - Longitude titik pertama (dalam derajat)
 * @param {number} lat2 - Latitude titik kedua (dalam derajat)
 * @param {number} lon2 - Longitude titik kedua (dalam derajat)
 * @returns {number} Jarak dalam kilometer (km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Radius bumi dalam kilometer
    const R = 6371;
    
    // Konversi derajat ke radian
    const toRad = (degrees) => degrees * (Math.PI / 180);
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);
    
    // Formula Haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * 
              Math.cos(radLat1) * Math.cos(radLat2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Jarak dalam kilometer
    const distance = R * c;
    
    // Bulatkan hingga 2 desimal
    return Math.round(distance * 100) / 100;
}

/**
 * Menghitung jarak dari satu titik ke banyak titik
 * dan mengurutkan berdasarkan jarak terdekat
 * 
 * @param {number} userLat - Latitude pengguna
 * @param {number} userLon - Longitude pengguna
 * @param {Array} locations - Array objek lokasi dengan properti latitude dan longitude
 * @returns {Array} Array lokasi yang sudah diurutkan berdasarkan jarak terdekat
 */
function sortByDistance(userLat, userLon, locations) {
    // Tambahkan properti distance ke setiap lokasi
    const locationsWithDistance = locations.map(location => {
        const distance = calculateDistance(
            userLat, 
            userLon, 
            location.latitude, 
            location.longitude
        );
        
        return {
            ...location,
            distance: distance
        };
    });
    
    // Urutkan berdasarkan jarak (ascending)
    locationsWithDistance.sort((a, b) => a.distance - b.distance);
    
    return locationsWithDistance;
}

/**
 * Mendapatkan lokasi terdekat dalam radius tertentu
 * 
 * @param {number} userLat - Latitude pengguna
 * @param {number} userLon - Longitude pengguna
 * @param {Array} locations - Array objek lokasi
 * @param {number} radiusKm - Radius pencarian dalam kilometer (default: 5km)
 * @returns {Array} Array lokasi dalam radius yang ditentukan
 */
function getLocationsInRadius(userLat, userLon, locations, radiusKm = 5) {
    const locationsWithDistance = sortByDistance(userLat, userLon, locations);
    
    // Filter lokasi yang jaraknya <= radius
    return locationsWithDistance.filter(location => location.distance <= radiusKm);
}

module.exports = {
    calculateDistance,
    sortByDistance,
    getLocationsInRadius
};
