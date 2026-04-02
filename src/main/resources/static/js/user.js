/* =========================================================
   user.js – Smart Tour Đà Lạt – Khách Du Lịch
   ========================================================= */

// ── 1. TOAST NOTIFICATION ─────────────────────────────────
function showToast(msg, isError = false) {
    const t = document.createElement('div');
    t.style.cssText = `
        position:fixed;bottom:20px;right:20px;z-index:9999;
        padding:0.9rem 1.5rem;border-radius:12px;color:#fff;font-size:.875rem;
        font-weight:600;display:flex;align-items:center;gap:.5rem;min-width:260px;
        background:${isError ? 'linear-gradient(135deg,#f43f5e,#fb7185)' : 'linear-gradient(135deg,#10b981,#34d399)'};
        box-shadow:0 10px 30px rgba(0,0,0,.4);animation:slideUp .35s ease;
    `;
    t.innerHTML = `<i class="fas fa-${isError ? 'circle-xmark' : 'circle-check'}"></i> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .5s'; setTimeout(() => t.remove(), 500); }, 3200);
}

// ── 2. SIDEBAR TAB SWITCHING ──────────────────────────────
function initTabs() {
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            document.querySelectorAll('.nav-link[data-target]').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            link.classList.add('active');
            const el = document.getElementById(target);
            if (el) { el.style.display = 'block'; }
            if (target === 'booking') fetchServices();
            if (target === 'billing') fetchMyOrders();
            if (target === 'map') setTimeout(initUserMap, 150);
        });
    });
}

// ── 3. OSM MAP (LEAFLET) ─────────────────────────────────
let userMap;
function initUserMap() {
    if (userMap) { userMap.invalidateSize(); return; }
    userMap = L.map('osm-map').setView([11.9404, 108.4583], 13);
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN', {
        attribution: 'Bản đồ Du lịch Đà Lạt © Smart Tour System'
    }).addTo(userMap);

    // Điểm mặc định nổi tiếng tại Đà Lạt
    const spots = [
        { lat: 11.9404, lng: 108.4583, name: 'Trung tâm Đà Lạt – Hồ Xuân Hương' },
        { lat: 11.9288, lng: 108.5358, name: 'Trại Mát / Cầu Đất Farm' },
        { lat: 11.8841, lng: 108.4030, name: 'God Valley – Thung lũng Tình Yêu' },
        { lat: 11.9618, lng: 108.4273, name: 'Làng Cù Lần – Langbiang' },
        { lat: 12.0023, lng: 108.4600, name: 'Đỉnh Langbiang 2167m' },
    ];
    spots.forEach(s => L.marker([s.lat, s.lng]).addTo(userMap).bindPopup(`<b>${s.name}</b>`));
}

// ── 4. AI LỊCH TRÌNH ─────────────────────────────────────
async function handleAIGenerate(e) {
    e.preventDefault();
    const btn = document.getElementById('btnAIGenerate');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI đang phân tích...';
    btn.disabled = true;

    const body = new URLSearchParams({
        budget:      document.getElementById('aiBudget').value,
        days:        document.getElementById('aiDays').value,
        transport:   document.getElementById('aiTransport').value,
        preferences: document.getElementById('aiPrefs').value
    });

    try {
        const res = await fetch('/api/user/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        if (res.ok) {
            const data = await res.json();
            showToast(data.message);
            renderItinerary(data.itinerary);
            document.getElementById('ai-result').style.display = 'block';
        } else {
            showToast('Lỗi Server AI. Vui lòng thử lại!', true);
        }
    } catch {
        showToast('Không kết nối được máy chủ AI!', true);
    } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
    }
}

function renderItinerary(days) {
    const c = document.getElementById('ai-itinerary-content');
    c.innerHTML = '';
    days.forEach(d => {
        c.innerHTML += `
        <div class="ai-day-card">
            <h4 class="ai-day-title">${d.title}</h4>
            <ul class="ai-day-list">
                <li><span class="time-badge morning">🌅 Sáng</span> ${d.morning}</li>
                <li><span class="time-badge noon">☀️ Trưa</span> ${d.afternoon}</li>
                <li><span class="time-badge evening">🌙 Tối</span> ${d.evening}</li>
            </ul>
        </div>`;
    });
}

// ── 5. ĐẶT DỊCH VỤ / BOOKING ─────────────────────────────
async function fetchServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading-msg"><i class="fas fa-spinner fa-spin"></i> Đang tải dịch vụ...</div>';

    try {
        const res = await fetch('/api/user/services');
        if (!res.ok) { if (res.status === 401 || res.status === 403) location.href = 'index.html'; return; }
        
        const data = await res.json();
        
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = '<div class="empty-msg">Hệ thống chưa có dịch vụ nào được mở bán!</div>';
            return;
        }
        
        window._servicesData = data;
        data.forEach(s => {
            const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price);
            const tagColor = s.type === 'HOTEL'
                ? 'background:rgba(52,211,153,.2);color:#34d399;'
                : 'background:rgba(129,140,248,.2);color:#818cf8;';
            grid.innerHTML += `
            <div class="service-card glass-panel">
                <img src="${s.imageUrl}" class="service-img" onerror="this.src='https://images.unsplash.com/photo-1559599525-47d0af8071e6?w=400'" alt="${s.name}">
                <div class="service-info">
                    <div class="service-header">
                        <h3>${s.name}</h3>
                        <span class="type-badge" style="${tagColor}">${s.type}</span>
                    </div>
                    <p class="service-agency"><i class="fas fa-store"></i> ${s.agencyName}</p>
                    <p class="service-desc">${s.description.substring(0,60)}...</p>
                    <div class="service-footer">
                        <span class="price-tag">${price}</span>
                        <button class="btn btn-primary btn-sm" onclick="showServiceDetail(${s.id})">
                            <i class="fas fa-info-circle"></i> Xem Chi Tiết
                        </button>
                    </div>
                </div>
            </div>`;
        });
    } catch { grid.innerHTML = '<div class="empty-msg">Lỗi kết nối máy chủ.</div>'; }
}

async function bookService(id, btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    try {
        const res = await fetch(`/api/user/book/${id}`, { method: 'POST' });
        const json = await res.json();
        if (res.ok) {
            showToast(json.message);
            btn.innerHTML = '<i class="fas fa-check"></i> Đã Đặt';
            btn.style.background = '#10b981';
        } else {
            showToast(json.error || 'Không thể đặt dịch vụ!', true);
            btn.innerHTML = orig; btn.disabled = false;
        }
    } catch {
        showToast('Lỗi kết nối!', true);
        btn.innerHTML = orig; btn.disabled = false;
    }
}

let detailMap;
function showServiceDetail(id) {
    const s = (window._servicesData || []).find(x => x.id === id);
    if (!s) return;
    
    // Thuộc tính mở rộng của Tour
    const tourMeta = s.type === 'TOUR' ? `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin:1rem 0;padding:1rem;background:rgba(0,0,0,0.2);border-radius:12px;">
            <div><span class="text-muted text-sm d-block">Giới hạn khách:</span> <b>${s.maxPeople || 'Không giới hạn'} người</b></div>
            <div><span class="text-muted text-sm d-block">Lịch trình:</span> <b>${s.durationDays || '?'} ngày</b></div>
            <div><span class="text-muted text-sm d-block">Phương tiện:</span> <b>${s.transportation || 'Tự túc'}</b></div>
        </div>
    ` : (s.openingTime || s.closingTime ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;padding:1rem;background:rgba(0,0,0,0.2);border-radius:12px;">
            <div><span class="text-muted text-sm d-block"><i class="fas fa-door-open"></i> Giờ Mở Cửa:</span> <b>${s.openingTime || 'Chưa cập nhật'}</b></div>
            <div><span class="text-muted text-sm d-block"><i class="fas fa-door-closed"></i> Giờ Đóng Cửa:</span> <b>${s.closingTime || 'Chưa cập nhật'}</b></div>
        </div>
    ` : '');

    document.getElementById('service-modal-content').innerHTML = `
        <div style="display:flex;gap:1.5rem;align-items:flex-start">
            <img src="${s.imageUrl}" style="width:300px;height:220px;border-radius:16px;object-fit:cover" onerror="this.src='https://via.placeholder.com/400x300'">
            <div style="flex:1">
                <h2 style="margin-bottom:.5rem;color:#818cf8">${s.name}</h2>
                <span class="type-badge" style="background:rgba(129,140,248,.2);color:#818cf8">${s.type}</span>
                <span style="font-size:.85rem;color:var(--text-muted);margin-left:.75rem"><i class="fas fa-store"></i> ${s.agencyName}</span>
                ${tourMeta}
                <p style="margin-top:1rem;font-size:.9rem;color:rgba(255,255,255,.8);line-height:1.6">${s.description}</p>
                <div style="margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid rgba(255,255,255,.1)">
                    <div>
                        <span class="text-muted" style="font-size:.8rem;display:block">Giá trọn gói</span>
                        <span class="price-tag" style="font-size:1.6rem">${new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(s.price)}</span>
                    </div>
                    <button class="btn btn-success" style="padding:.8rem 2rem;font-size:1rem" onclick="bookService(${s.id}, this)">
                        <i class="fas fa-shopping-cart"></i> Đặt Dịch Vụ Này
                    </button>
                </div>
            </div>
        </div>
        <!-- Bản đồ Lộ trình -->
        <h4 style="margin-top:2rem;margin-bottom:.75rem"><i class="fas fa-map-marked-alt text-primary"></i> Bản đồ Tuyến Đường</h4>
        <div id="detail-map" style="width:100%;height:300px;border-radius:12px;overflow:hidden"></div>
    `;
    
    document.getElementById('service-modal').style.display = 'flex';

    // Vẽ bản đồ
    setTimeout(() => {
        if (!detailMap) {
            detailMap = L.map('detail-map').setView([11.94, 108.45], 13);
            L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN', { attribution: 'Bản đồ Du lịch Đà Lạt © Smart Tour System'}).addTo(detailMap);
        } else {
            detailMap.invalidateSize();
            detailMap.eachLayer(l => { if (!l._url) detailMap.removeLayer(l) }); // Xóa marker/polyline cũ, giữ nguyên base layer
        }

        if (s.mapPoints) {
            const arr = s.mapPoints.split('|').filter(x=>x).map(p => {
                const parts = p.split(';');
                const ll = parts[0].split(',');
                return { lat: parseFloat(ll[0]), lng: parseFloat(ll[1]), name: parts[1] || 'Điểm dừng', imgUrl: parts[2] || '', time: parts[3] || '' };
            });

            if (arr.length > 0) {
                if (arr.length === 1) {
                    L.marker([arr[0].lat, arr[0].lng]).addTo(detailMap).bindPopup(`<b>${arr[0].name}</b>`).openPopup();
                    detailMap.setView([arr[0].lat, arr[0].lng], 15);
                } else {
                    let totalDist = 0;
                    const latLngs = arr.map(p => [p.lat, p.lng]);
                    
                    arr.forEach((p, i) => {
                        let label = `<div style="text-align:center"><b>${i + 1}. ${p.name}</b>`;
                        if (i === 0) label = `<div style="text-align:center">🚩 Bắt đầu: <b>${p.name}</b>`;
                        else if (i === arr.length - 1) label = `<div style="text-align:center">🏁 Kết thúc: <b>${p.name}</b>`;
                        
                        if (p.imgUrl) {
                            label += `<br/><img src="${p.imgUrl}" style="width:140px;height:90px;object-fit:cover;border-radius:6px;margin-top:6px;box-shadow:0 2px 4px rgba(0,0,0,.2)">`;
                        }
                        if (p.time) {
                            label += `<br/><span style="color:#f59e0b;font-size:11px;font-weight:bold;margin-top:4px;display:inline-block">⏰ Thời gian: ${p.time}</span>`;
                        }
                        label += `</div>`;
                        L.marker([p.lat, p.lng]).addTo(detailMap).bindPopup(label);
                    });

                    for (let i = 0; i < arr.length - 1; i++) {
                        const dist = L.latLng(arr[i].lat, arr[i].lng).distanceTo(L.latLng(arr[i+1].lat, arr[i+1].lng));
                        totalDist += dist;
                        
                        // Chấm label km lên chính giữa đường đứt nét
                        const midLat = (arr[i].lat + arr[i+1].lat) / 2;
                        const midLng = (arr[i].lng + arr[i+1].lng) / 2;
                        const dStr = dist > 1000 ? (dist/1000).toFixed(1) + ' km' : Math.round(dist) + ' m';
                        L.marker([midLat, midLng], {
                            icon: L.divIcon({
                                className: 'dist-label-icon',
                                html: `<div style="background:#fff;color:#f43f5e;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid #f43f5e;font-weight:bold;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.2);transform:translate(-50%,-50%)">${dStr}</div>`,
                                iconSize: [0, 0]
                            }),
                            interactive: false
                        }).addTo(detailMap);
                    }
                    
                    const distText = totalDist > 1000 ? (totalDist/1000).toFixed(1) + ' km' : Math.round(totalDist) + ' m';
                    
                    const line = L.polyline(latLngs, {color:'#f43f5e', weight:4, dashArray:'10'}).addTo(detailMap);
                    detailMap.fitBounds(line.getBounds(), {padding:[30,30]});
                    
                    // Show distance text
                    const distEl = document.createElement('div');
                    distEl.innerHTML = `<i class="fas fa-route"></i> Tổng quãng đường bay/chạy: <b style="color:#34d399">${distText}</b>`;
                    distEl.style.marginTop = '0.5rem';
                    distEl.style.marginBottom = '1rem';
                    document.getElementById('detail-map').insertAdjacentElement('beforebegin', distEl);
                }
            }
        }
    }, 200);
}

// ── 7. THANH TOÁN & HÓA ĐƠN NHÓM ────────────────────────
async function fetchMyOrders() {
    try {
        const res = await fetch('/api/user/orders');
        if (!res.ok) return;
        const data = await res.json();
        
        let total = 0;
        let htmlList = '';
        if (data.length === 0) {
            htmlList = '<div class="empty-msg">Bạn chưa đặt dịch vụ nào. Hóa đơn trống!</div>';
        } else {
            htmlList = '<table class="data-table" style="width:100%;text-align:left;margin-bottom:1.5rem"><thead><tr><th>Mã Đơn</th><th>Dịch Vụ Phân Bổ</th><th>Trạng Thái</th><th>Thành Tiền</th></tr></thead><tbody>';
            data.forEach(o => {
                if (o.status !== 'CANCELLED') total += o.totalAmount;
                const statusBadge = o.status === 'PENDING' 
                    ? '<span style="color:#fbbf24;font-size:.8rem"><i class="fas fa-clock"></i> Chờ duyệt</span>'
                    : '<span style="color:#34d399;font-size:.8rem"><i class="fas fa-check"></i> Đã xuất vé</span>';
                
                htmlList += `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
                        <td style="padding:.75rem 0;font-family:monospace;color:#818cf8">#${String(o.id).padStart(5,'0')}</td>
                        <td>${o.services}</td>
                        <td>${statusBadge}</td>
                        <td style="color:#34d399;font-weight:bold">${new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(o.totalAmount)}</td>
                    </tr>
                `;
            });
            htmlList += '</tbody></table>';
        }

        const inc = total * 0.05; // Giả lập VAT/Phát sinh 5%
        const final = total + inc;

        document.querySelector('.bill-grid').innerHTML = `
            <div class="stat-card">
                <span class="stat-label">Tổng Dịch Vụ Đã Đặt</span>
                <span class="stat-value">${new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(total)}</span>
            </div>
            <div class="stat-card emerald">
                <span class="stat-label">Chi Phí Phát Sinh (VAT)</span>
                <span class="stat-value text-secondary">${new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(inc)}</span>
            </div>
            <div class="stat-card rose">
                <span class="stat-label">Chia cho Mỗi Người (3)</span>
                <span class="stat-value text-accent">${new Intl.NumberFormat('vi-VN', {style:'currency',currency:'VND'}).format(final / 3)}</span>
            </div>
        `;

        let listContainer = document.getElementById('my-orders-list');
        if (!listContainer) {
            listContainer = document.createElement('div');
            listContainer.id = 'my-orders-list';
            document.getElementById('billing').querySelector('.glass-panel').insertBefore(listContainer, document.querySelector('.bill-grid'));
        }
        listContainer.innerHTML = '<h4 style="margin-bottom:1rem;color:#fff">Chi Tiết Các Bill Đã Đặt Toàn Hành Trình</h4>' + htmlList;

    } catch (e) { console.error(e); }
}


// ── 8. KHỞI ĐỘNG ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    fetchServices();
});
