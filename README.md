# Traffic Law System Lookup

Hệ thống Tra cứu Luật Giao thông với giao diện Frontend (React/Vite) và Backend API (Python/FastAPI).

## Yêu cầu hệ thống (Prerequisites)
- **Node.js** (Khuyên dùng phiên bản 18 trở lên)
- **Python** (Khuyên dùng phiên bản 3.9 trở lên)

## Hướng dẫn cài đặt (Setup) & Chạy ứng dụng (Run)

### 1. Clone dự án

Mở terminal và chạy lệnh sau để tải dự án về máy:

```bash
git clone <repository_url>
cd TrafficLawSystemLookup
```
*(Lưu ý: Thay `<repository_url>` bằng đường dẫn Git thực tế của dự án)*

---

### 2. Thiết lập & Chạy Backend (FastAPI)

Backend sử dụng Python và FastAPI.

**Bước 1:** Di chuyển vào thư mục backend:
```bash
cd backend
```

**Bước 2:** Tạo môi trường ảo (Virtual Environment):
```bash
python -m venv venv
```

**Bước 3:** Kích hoạt môi trường ảo:
- Trên **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```
- Trên **Windows**:
  ```bash
  .\venv\Scripts\activate
  ```

**Bước 4:** Cài đặt các thư viện phụ thuộc:
```bash
pip install -r requirements.txt
```

**Bước 5:** Khởi động server Backend:
```bash
uvicorn api:app --reload
```
Server Backend sẽ chạy tại địa chỉ: **http://127.0.0.1:8000**

---

### 3. Thiết lập & Chạy Frontend (React + Vite)

Frontend sử dụng React và Vite.

**Bước 1:** Mở một cửa sổ Terminal mới (để giữ cho backend vẫn đang chạy) và di chuyển vào thư mục frontend từ thư mục gốc của dự án:
```bash
cd frontend
```

**Bước 2:** Cài đặt các packages/thư viện:
```bash
npm install
```

**Bước 3:** Khởi động server Frontend:
```bash
npm run dev
```
Giao diện Frontend sẽ chạy tại địa chỉ: **http://localhost:5173** (Hoặc port được Vite cấp trong terminal).

---

## Lưu ý
- Hãy luôn đảm bảo rằng **Backend** đã được bật và đang chạy ở chế độ background trước khi thực hiện tra cứu trên **Frontend** để tránh các lỗi kết nối (Network Error).

