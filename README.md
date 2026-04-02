# 🌲 Hệ Thống Quản Lý & Đặt Tour Du Lịch Đà Lạt (Nhóm 6)

Dự án Website Du lịch Đà Lạt (Smart Tour) là hệ thống giúp người dùng tìm kiếm, xem thông tin và đặt các tour du lịch hấp dẫn tại Đà Lạt. Dự án được xây dựng với kiến trúc Client-Server, sử dụng **Spring Boot** cho Backend và **Vite + TypeScript** cho Frontend.

## 🛠️ Công Nghệ Sử Dụng

### Frontend (`/client`)
- **Framework/Build tool:** Vite, TypeScript (React/Vue...)
- **Styling:** CSS/PostCSS
- **Package Manager:** npm / yarn

### Backend (`/src`)
- **Ngôn ngữ & Framework:** Java 17+, Spring Boot
- **Quản lý dependencies:** Maven (`pom.xml`)
- **Cơ sở dữ liệu:** Hệ quản trị CSDL quan hệ (MySQL/PostgreSQL) thông qua file `smarttour_db.sql`

## 📁 Cấu Trúc Thư Mục

```text
Dulich_Dalat_Nhom6/
├── client/                 # Mã nguồn Frontend (Vite/TS)
├── src/                    # Mã nguồn Backend (Java Spring Boot)
├── uploads/                # Thư mục chứa hình ảnh/file upload tĩnh
├── smarttour_db.sql        # File script khởi tạo Cơ sở dữ liệu
├── pom.xml                 # Cấu hình thư viện Maven (Backend)
├── package.json            # Cấu hình thư viện npm (Frontend)
├── vite.config.ts          # Cấu hình Vite
├── class_diagram.md        # Biểu đồ lớp (Thiết kế hệ thống)
└── README.md               # Tài liệu hướng dẫn (File này)
🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án
Để chạy dự án trên máy cá nhân, hãy đảm bảo bạn đã cài đặt Java (JDK 17+), Node.js (v16+), Maven và hệ quản trị CSDL (như MySQL).

Bước 1: Khởi tạo Cơ sở dữ liệu
Mở hệ quản trị cơ sở dữ liệu của bạn (VD: MySQL Workbench, XAMPP, phpMyAdmin).

Tạo một database mới (ví dụ: smarttour_db).

Import file smarttour_db.sql vào database vừa tạo để có sẵn cấu trúc bảng và dữ liệu mẫu.

Cấu hình lại thông tin kết nối Database (URL, username, password) trong file application.properties hoặc application.yml của thư mục Backend (src/main/resources/).

Bước 2: Chạy Backend (Spring Boot)
Mở terminal tại thư mục gốc của dự án và chạy lệnh sau (sử dụng Maven wrapper):
# Cấp quyền thực thi cho Maven wrapper (nếu dùng MacOS/Linux)
chmod +x mvnw
# Khởi chạy Backend
./mvnw spring-boot:run
Backend sẽ mặc định chạy trên cổng http://localhost:8080 (hoặc cổng được thiết lập trong config).

Bước 3: Chạy Frontend (Vite)
Mở một terminal mới, di chuyển vào thư mục client và tiến hành cài đặt thư viện, sau đó khởi chạy ứng dụng:

Bash
cd client
npm install
npm run dev
Frontend sẽ chạy trên cổng mặc định của Vite, ví dụ http://localhost:5173.

📋 Biểu Đồ Thiết Kế Hệ Thống
Bạn có thể tham khảo kiến trúc lớp của hệ thống thông qua các file sau:

Class Diagram Markdown

Class Diagram HTML

👥 Thành Viên Nhóm 6

TRẦN QUANG HIỂN		        2280600922
LÊ TRẦN KIM HƯNG		      2280601297
NGUYỄN HOÀNG ANH		      2280600079
HÀ LÊ QUỐC VIỆT	          2280603661
BÙI THÀNH ANH VŨ	        2280603718
TRƯƠNG VŨ MINH VÂN	      2280603646
HUỲNH NGUYỄN THÀNH ĐẠT	       


...

📝 Giấy Phép (License)
Dự án được phát triển nhằm mục đích học tập.
