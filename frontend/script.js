function showView(type) {
    document.getElementById('textView').style.display = (type === 'text') ? 'block' : 'none';
    document.getElementById('pdfView').style.display = (type === 'pdf') ? 'block' : 'none';
    
    document.getElementById('btnText').classList.toggle('active', type === 'text');
    document.getElementById('btnPDF').classList.toggle('active', type === 'pdf');
}

// Function to handle header search
function handleSearch() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (text) {
        processMessage(text);
        input.value = '';
    }
}

function handleHeaderKeyPress(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

// Function to handle chat input
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (text) {
        processMessage(text);
        input.value = '';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function processMessage(text) {
    // Switch to text view if not already
    showView('text');
    
    const chatHistory = document.getElementById('chatHistory');
    
    // Add user message
    const userMsgHTML = `
        <div class="chat-message user">
            <div class="message-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="message-content">${escapeHTML(text)}</div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', userMsgHTML);
    scrollToBottom();

    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingHTML = `
        <div class="chat-message bot" id="${loadingId}">
            <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', loadingHTML);
    scrollToBottom();

    try {
        const response = await fetch('http://localhost:8000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();
        
        // Remove loading
        document.getElementById(loadingId).remove();

        // Add bot message
        let botContent = `<p>${formatText(data.answer)}</p>`;
        if (data.context) {
            botContent += `<div class="message-context"><strong>Căn cứ pháp lý:</strong><br>${formatText(data.context)}</div>`;
        }

        const botMsgHTML = `
            <div class="chat-message bot">
                <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content">${botContent}</div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', botMsgHTML);
        scrollToBottom();

    } catch (error) {
        // Remove loading
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        const errorMsgHTML = `
            <div class="chat-message bot">
                <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content" style="color: red;">
                    Lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại backend.
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', errorMsgHTML);
        scrollToBottom();
        console.error('Error:', error);
    }
}

function scrollToBottom() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function formatText(text) {
    if (!text) return '';
    return escapeHTML(text).replace(/\n/g, '<br>');
}

function comingSoon(name) {
    alert("Chức năng '" + name + "' đang được phát triển.");
}