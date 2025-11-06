/**
 * Analytics Dashboard JavaScript
 * Load data dan render charts menggunakan Chart.js
 */

let charts = {};

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadGeneralStats();
    loadPopularLapangan();
    loadRatingDistribution();
    loadRatingTrend();
});

/**
 * Load statistik umum
 */
async function loadGeneralStats() {
    try {
        const response = await fetch('/admin/api/analytics/general-stats');
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            document.getElementById('totalLapangan').textContent = stats.total_lapangan || 0;
            document.getElementById('totalUsers').textContent = stats.total_users || 0;
            document.getElementById('totalReviews').textContent = stats.total_reviews || 0;
            document.getElementById('avgRating').textContent = parseFloat(stats.avg_rating || 0).toFixed(1);
        }
    } catch (error) {
        console.error('Error loading general stats:', error);
    }
}

/**
 * Load dan render chart lapangan terpopuler
 */
async function loadPopularLapangan() {
    try {
        const response = await fetch('/admin/api/analytics/popular-lapangan');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            const data = result.data.slice(0, 10); // Top 10

            const ctx = document.getElementById('popularLapanganChart').getContext('2d');
            
            // Destroy existing chart if any
            if (charts.popular) charts.popular.destroy();

            charts.popular = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.nama_lapangan),
                    datasets: [{
                        label: 'Jumlah Review',
                        data: data.map(item => item.total_reviews),
                        backgroundColor: 'rgba(74, 144, 226, 0.8)',
                        borderColor: 'rgba(74, 144, 226, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading popular lapangan:', error);
    }
}

/**
 * Load dan render chart distribusi rating
 */
async function loadRatingDistribution() {
    try {
        const response = await fetch('/admin/api/analytics/rating-distribution');
        const result = await response.json();

        if (result.success) {
            // Ensure all ratings 1-5 are present
            const ratingMap = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
            result.data.forEach(item => {
                ratingMap[item.rating] = parseInt(item.count);
            });

            const ctx = document.getElementById('ratingDistributionChart').getContext('2d');
            
            // Destroy existing chart if any
            if (charts.distribution) charts.distribution.destroy();

            charts.distribution = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['⭐ 1 Bintang', '⭐⭐ 2 Bintang', '⭐⭐⭐ 3 Bintang', '⭐⭐⭐⭐ 4 Bintang', '⭐⭐⭐⭐⭐ 5 Bintang'],
                    datasets: [{
                        data: Object.values(ratingMap),
                        backgroundColor: [
                            'rgba(220, 53, 69, 0.8)',   // Red - 1 star
                            'rgba(255, 193, 7, 0.8)',   // Orange - 2 stars
                            'rgba(255, 235, 59, 0.8)',  // Yellow - 3 stars
                            'rgba(76, 175, 80, 0.8)',   // Light green - 4 stars
                            'rgba(40, 167, 69, 0.8)'    // Green - 5 stars
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading rating distribution:', error);
    }
}

/**
 * Load dan render chart trend rating per bulan
 */
async function loadRatingTrend() {
    try {
        const response = await fetch('/admin/api/analytics/rating-per-month');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            const data = result.data;

            const ctx = document.getElementById('ratingTrendChart').getContext('2d');
            
            // Destroy existing chart if any
            if (charts.trend) charts.trend.destroy();

            charts.trend = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => {
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                        return `${months[item.month - 1]} ${item.year}`;
                    }),
                    datasets: [{
                        label: 'Jumlah Rating',
                        data: data.map(item => item.total_ratings),
                        borderColor: 'rgba(74, 144, 226, 1)',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Rata-rata Rating',
                        data: data.map(item => parseFloat(item.avg_rating)),
                        borderColor: 'rgba(40, 167, 69, 1)',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Jumlah Rating'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            min: 0,
                            max: 5,
                            grid: {
                                drawOnChartArea: false
                            },
                            title: {
                                display: true,
                                text: 'Rata-rata Rating'
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading rating trend:', error);
    }
}
