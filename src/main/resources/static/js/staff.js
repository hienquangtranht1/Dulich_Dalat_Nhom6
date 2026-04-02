/* =========================================================
   staff.js – Smart Tour Đà Lạt – Đại Lý (Staff)
   ========================================================= */

// ── 1. TOAST ─────────────────────────────────────────────
function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.style.background = isError
        ? 'linear-gradient(135deg,#f43f5e,#fb7185)'
        : 'linear-gradient(135deg,#10b981,#34d399)';
    t.innerHTML = `<i class="fas fa-${isError ? 'circle-xmark' : 'circle-check'}"></i> ${msg}`;
    t.style.transform = 'translateY(0)';
    t.style.opacity = '1';
    setTimeout(() => { t.style.transform = 'translateY(100px)'; t.style.opacity = '0'; }, 3200);
}

// ── 2. THÔNG TIN NHÂN VIÊN ───────────────────────────────
async function fetchInfo() {
    try {
        const res = await fetch('/api/staff/me');
        if (res.status === 401 || res.status === 403) {
            showToast('Phiên đăng nhập hết hạn!', true);
            setTimeout(() => location.href = 'index.html', 1500);
            return;
        }
        if (!res.ok) return;
        const d = await res.json();
        const el = document.getElementById('agencyName');
        if (el) el.innerText = d.agencyName || d.username || 'Đại lý';
    } catch {}
}

// ── 3. DANH SÁCH DỊCH VỤ (của Đại lý) ──────────────────
async function fetchServices() {
    const tbody = document.getElementById('servicesList');
    if (!tbody) return;
    try {
        const res = await fetch('/api/staff/services');
        if (!res.ok) return;
        const data = await res.json();
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Trống! Gõ Nút Nền Upload Cập Nhật Ngay Rổ Hàng Nhé!</td></tr>';
            return;
        }
        data.forEach(s => {
            const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price);
            const statusBadge = s.isApproved
                ? '<span class="badge badge-approved">✔ Đã Duyệt</span>'
                : '<span class="badge badge-pending">⏳ Chờ Duyệt</span>';
            tbody.innerHTML += `
            <tr>
                <td><img src="${s.imageUrl}" class="thumb-img" onerror="this.src='https://via.placeholder.com/60'" alt="${s.name}"></td>
                <td><b>${s.name}</b><br><span class="text-muted text-sm">${s.description || ''}</span></td>
                <td><span class="type-tag">${s.type}</span></td>
                <td class="price-cell">${price}</td>
                <td>${statusBadge}</td>
            </tr>`;
        });
    } catch {}
}

// ── 4. ĐƠN ĐẶT HÀNG (Orders) ─────────────────────────────
async function fetchOrders() {
    const tbody = document.getElementById('ordersList');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:1rem"><i class="fas fa-spinner fa-spin"></i> Đang tải...</td></tr>';
    try {
        const res = await fetch('/api/staff/orders');
        if (!res.ok) return;
        const data = await res.json();
        tbody.innerHTML = '';
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Chưa có đơn đặt nào từ khách hàng!</td></tr>';
            return;
        }
        data.forEach(o => {
            const isPending = o.status === 'PENDING';
            const actionBtn = isPending
                ? `<button class="btn btn-success btn-xs" onclick="approveOrder(${o.id})"><i class="fas fa-check"></i> Xác nhận</button>`
                : `<span class="badge badge-approved">✔ Đã Xử lý</span>`;
            const amount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalAmount);
            tbody.innerHTML += `
            <tr>
                <td class="order-id">#${String(o.id).padStart(5,'0')}</td>
                <td>${o.customer}</td>
                <td class="text-sm">${o.services}</td>
                <td class="price-cell">${amount}</td>
                <td>${actionBtn}</td>
            </tr>`;
        });
    } catch {}
}

async function approveOrder(id) {
    const res = await fetch(`/api/staff/orders/${id}/approve`, { method: 'POST' });
    if (res.ok) { showToast('Đã xác nhận đơn hàng #' + String(id).padStart(5,'0')); fetchOrders(); }
    else showToast('Lỗi xác nhận đơn!', true);
}

// ── 5. FORM ĐĂNG DỊCH VỤ ─────────────────────────────────
function initServiceForm() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type=submit]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải lên...';
        btn.disabled = true;

        const fd = new FormData();
        fd.append('name',        document.getElementById('svcName').value);
        fd.append('type',        document.getElementById('svcType').value);
        fd.append('price',       document.getElementById('svcPrice').value);
        fd.append('description', document.getElementById('svcDesc').value);
        
        if (document.getElementById('svcType').value === 'TOUR') {
            fd.append('maxPeople', document.getElementById('svcMaxPeople').value);
            fd.append('durationDays', document.getElementById('svcDuration').value);
            fd.append('transportation', document.getElementById('svcTransport').value);
        } else {
            fd.append('openingTime', document.getElementById('svcOpenTime').value || '');
            fd.append('closingTime', document.getElementById('svcCloseTime').value || '');
        }

        fd.append('mapPoints',   document.getElementById('svcMapPoints').value || '');
        const imgInput = document.getElementById('svcImage');
        if (imgInput && imgInput.files[0]) fd.append('image', imgInput.files[0]);

        try {
            const res = await fetch('/api/staff/services', { method: 'POST', body: fd });
            if (res.ok) {
                const d = await res.json();
                showToast(d.message || 'Đã tải lên! Chờ Admin duyệt.');
                form.reset(); clearServiceMap();
                fetchServices();
            } else if (res.status === 401 || res.status === 403) {
                showToast('Phiên đăng nhập hết hạn!', true);
                setTimeout(() => location.href = 'index.html', 1500);
            } else {
                const err = await res.text().catch(() => 'Lỗi không xác định');
                showToast('❌ ' + err.substring(0, 100), true);
            }
        } catch { showToast('❌ Không kết nối Server!', true); }
        finally { btn.innerHTML = orig; btn.disabled = false; }
    });
}

// ── 6. FORM THÊM ĐIỂM ĐẾN ────────────────────────────────
function initLocationForm() {
    const form = document.getElementById('locationForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = new URLSearchParams({
            name:        document.getElementById('locName').value,
            coordinates: document.getElementById('locCoords').value
        });
        const res = await fetch('/api/staff/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        if (res.ok) { showToast('Toạ độ mới đã được lưu vào Database!'); form.reset(); }
        else showToast('Lỗi khi lưu toạ độ!', true);
    });
}

// ── 7. BẢN ĐỒ ĐĂNG DỊCH VỤ (HOTEL / TOUR) ───────────────
let serviceMapL, serviceMarkers = [], servicePolyline = null;

function initServiceMap() {
    if (serviceMapL) { serviceMapL.invalidateSize(); return; }
    serviceMapL = L.map('service-map').setView([11.9404, 108.4583], 13);
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN', {
        attribution: 'Smart Tour Bản đồ Chủ Quyền Việt Nam'
    }).addTo(serviceMapL);

    serviceMapL.on('click', e => {
        const type = document.getElementById('svcType').value;
        const max  = type === 'HOTEL' ? 1 : 5;
        if (serviceMarkers.length >= max) {
            if (type === 'HOTEL') {
                serviceMapL.removeLayer(serviceMarkers[0]);
                serviceMarkers = [];
            } else {
                showToast(`Tour chỉ tối đa ${max} điểm dừng!`, true); return;
            }
        }
        
        let placeName = 'Khách sạn/Dịch vụ';
        if (type === 'TOUR') {
            const nth = serviceMarkers.length === 0 ? 'Bắt đầu' : (serviceMarkers.length === max - 1 ? 'Kết thúc' : (serviceMarkers.length + 1));
            placeName = prompt(`Nhập tên địa điểm ${nth} (VD: Chợ Đà Lạt):`);
            if (!placeName) return; // Huỷ chấm nếu ko nhập
        }

        const idx = serviceMarkers.length;
        const m = L.marker(e.latlng, { draggable: true }).addTo(serviceMapL);
        m.placeName = placeName.replace(/;/g, ' '); // Tránh lỗi delimiter
        
        m.bindPopup(`
            <div style="min-width:180px;font-family:sans-serif;text-align:center">
                <b style="color:#2563eb;font-size:14px;display:block;margin-bottom:8px">${m.placeName}</b>
                ${type === 'TOUR' ? `<input type="text" placeholder="Tgian ở đây (VD: 08:30 - 10:00)" style="width:100%;margin-bottom:6px;font-size:11px;padding:4px;border:1px solid #cbd5e1;border-radius:4px" onchange="serviceMarkers[${idx}].placeTime=this.value; updateServicePoints()">` : ''}
                <label style="font-size:11px;color:#64748b;font-weight:bold;display:block;margin-bottom:4px;cursor:pointer;background:#f8fafc;padding:4px;border-radius:4px;border:1px dashed #cbd5e1">
                    <i class="fas fa-camera"></i> Tải ảnh địa danh này
                    <input type="file" style="display:none" accept="image/*" onchange="uploadPointImage(event, ${idx})">
                </label>
                <div id="p-img-${idx}" style="margin-top:6px;border-radius:6px;overflow:hidden"></div>
            </div>
        `).openPopup();
        
        serviceMarkers.push(m);
        m.on('dragend', updateServicePoints);
        updateServicePoints();
    });
}

async function uploadPointImage(event, idx) {
    const file = event.target.files[0];
    if (!file) return;
    const m = serviceMarkers[idx];
    if (!m) return;
    
    document.getElementById(`p-img-${idx}`).innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tải...`;
    
    const fd = new FormData();
    fd.append('file', file);
    try {
        const res = await fetch('/api/staff/upload-image', { method: 'POST', body: fd });
        if (!res.ok) throw new Error("Lỗi tải ảnh");
        const data = await res.json();
        m.placeImage = data.url;
        document.getElementById(`p-img-${idx}`).innerHTML = `<img src="${data.url}" style="width:100%;height:80px;object-fit:cover;border-radius:6px">`;
        updateServicePoints();
    } catch(e) {
        document.getElementById(`p-img-${idx}`).innerHTML = `<span style="color:red;font-size:11px">Lỗi up ảnh</span>`;
    }
}

function updateServicePoints() {
    const coords = serviceMarkers.map(m => m.getLatLng().lat.toFixed(6) + ',' + m.getLatLng().lng.toFixed(6) + ';' + (m.placeName || '') + ';' + (m.placeImage || '') + ';' + (m.placeTime || ''));
    document.getElementById('svcMapPoints').value = coords.join('|');
    if (serviceMarkers.length > 1) {
        if (servicePolyline) serviceMapL.removeLayer(servicePolyline);
        servicePolyline = L.polyline(serviceMarkers.map(m => m.getLatLng()), {
            color: '#f43f5e', weight: 4, dashArray: '8,10'
        }).addTo(serviceMapL);
    } else if (servicePolyline) {
        serviceMapL.removeLayer(servicePolyline);
        servicePolyline = null;
    }
}

function clearServiceMap() {
    serviceMarkers.forEach(m => serviceMapL && serviceMapL.removeLayer(m));
    serviceMarkers = [];
    if (servicePolyline) { serviceMapL && serviceMapL.removeLayer(servicePolyline); servicePolyline = null; }
    const el = document.getElementById('svcMapPoints');
    if (el) el.value = '';
}

// ── 8. BẢN ĐỒ HỖ TRỢ ĐỊA ĐIỂM ──────────────────────────
let locMap, locMarker;

function initLocMap() {
    if (locMap) { locMap.invalidateSize(); return; }
    locMap = L.map('osm-map').setView([11.9404, 108.4583], 13);
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN', {
        attribution: 'Smart Tour Bản đồ Chủ Quyền Việt Nam'
    }).addTo(locMap);
    locMarker = L.marker([11.9404, 108.4583], { draggable: true }).addTo(locMap);
    document.getElementById('locCoords').value = '11.940400, 108.458300';
    locMap.on('click', e => {
        locMarker.setLatLng(e.latlng);
        document.getElementById('locCoords').value = e.latlng.lat.toFixed(6) + ', ' + e.latlng.lng.toFixed(6);
    });
    locMarker.on('dragend', () => {
        const p = locMarker.getLatLng();
        document.getElementById('locCoords').value = p.lat.toFixed(6) + ', ' + p.lng.toFixed(6);
    });
}

// ── 9. SỰ KIỆN CHUYỂN TAB (bổ sung cho bản đồ) ───────────
function initStaffTabs() {
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.addEventListener('click', () => {
            const t = link.getAttribute('data-target');
            if (t === 'locations') setTimeout(initLocMap, 150);
            if (t === 'manage') setTimeout(initServiceMap, 150);
            if (t === 'orders') fetchOrders();
        });
    });
}

// ── 10. TYPE CHANGE (Hotel vs Tour) ────────────────────────
function initTypeChange() {
    const sel = document.getElementById('svcType');
    if (!sel) return;
    sel.addEventListener('change', () => {
        clearServiceMap();
        const isTour = sel.value === 'TOUR';
        
        document.querySelectorAll('.tour-only').forEach(el => {
            el.style.display = isTour ? 'flex' : 'none';
        });
        document.querySelectorAll('.not-tour').forEach(el => {
            el.style.display = !isTour ? 'flex' : 'none';
        });

        const hint = document.getElementById('map-instruction');
        if (hint) hint.innerText = isTour
            ? '(Chạm 1–5 điểm liên tiếp để vẽ Lộ trình Tour)'
            : '(Chạm 1 điểm để ghim toạ độ)';
    });
}

// ── 11. KHỞI ĐỘNG ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    fetchInfo();
    fetchServices();
    fetchOrders();
    initServiceForm();
    initLocationForm();
    initStaffTabs();
    initTypeChange();
    setTimeout(initServiceMap, 200);
});
