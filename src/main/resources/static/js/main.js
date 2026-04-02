// Global UI Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Tab Switching Logic
    const initTabs = () => {
        const tabLinks = document.querySelectorAll('.nav-link[data-target]');
        const tabContents = document.querySelectorAll('.tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active classes
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => {
                    c.style.display = 'none';
                    c.classList.remove('animate-fade-in');
                });

                // Add active class
                link.classList.add('active');
                const targetId = link.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                
                if (targetContent) {
                    targetContent.style.display = 'block';
                    // Re-trigger animation
                    void targetContent.offsetWidth; 
                    targetContent.classList.add('animate-fade-in');
                }
            });
        });
    };

    // Initialize map if the container exists (OpenStreetMap integration mockup)
    const initMockMap = () => {
        const mapContainer = document.getElementById('osm-map');
        if (mapContainer) {
            // In a real app, you would initialize Leaflet.js with OSM tiles here.
            mapContainer.innerHTML = `
                <div class="flex items-center justify-center" style="height: 100%; background: rgba(0,0,0,0.2);">
                    <div class="text-center">
                        <i class="fas fa-map-marked-alt text-4xl mb-3 text-primary" style="color:#6366f1"></i>
                        <p class="text-muted">Bản đồ OpenStreetMap Interactive (Đã tải)</p>
                        <p class="text-sm">Hiển thị đường dẫn tối ưu giữa các địa điểm AI gợi ý.</p>
                    </div>
                </div>
            `;
        }
    };

    initTabs();
    initMockMap();
});

// Mock notification
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'glass-panel p-4 flex items-center gap-3 animate-fade-in';
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.zIndex = '9999';
    notif.style.borderLeft = '4px solid #10b981';
    
    notif.innerHTML = `
        <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.5rem;"></i>
        <div>
            <h4 style="font-size: 14px; margin-bottom: 2px;">Thành công</h4>
            <p class="text-sm">${msg}</p>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(20px)';
        notif.style.transition = 'all 0.5s ease';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}
