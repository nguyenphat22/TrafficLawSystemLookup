function showView(type) {
    document.getElementById('textView').style.display = (type === 'text') ? 'block' : 'none';
    document.getElementById('pdfView').style.display = (type === 'pdf') ? 'block' : 'none';
    
    document.getElementById('btnText').classList.toggle('active', type === 'text');
    document.getElementById('btnPDF').classList.toggle('active', type === 'pdf');
}

function handleSearch() {
    const input = document.getElementById('userInput').value;
    if (!input.trim()) return alert("Vui lòng nhập nội dung!");

    document.getElementById('searchResult').innerHTML = `
        <p style="color: #004a99; font-weight: bold;">[AI Trợ lý pháp luật]</p>
        <p>Kết quả phân tích cho từ khóa: "<b>${input}</b>"</p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
        <p><i>Hệ thống AI đang được đồng bộ dữ liệu. Ở giai đoạn tiếp theo, các điều khoản từ Nghị định 168/2024/NĐ-CP sẽ được trích xuất tại đây.</i></p>
    `;
    showView('text');
}

function comingSoon(name) {
    alert("Chức năng '" + name + "' đang được phát triển.");
}