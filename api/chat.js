<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Groq AI Chat</title>
    <style>
        body { font-family: 'Pretendard', sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .chat-container { width: 450px; height: 650px; background: white; border-radius: 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; }
        header { background: #f55036; color: white; padding: 15px; text-align: center; font-weight: bold; }
        .chat-window { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .message { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 14px; }
        .user { align-self: flex-end; background-color: #f55036; color: white; }
        .ai { align-self: flex-start; background-color: #eee; color: #333; }
        .input-area { display: flex; padding: 15px; border-top: 1px solid #eee; }
        #user-input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; }
        #send-btn { margin-left: 8px; padding: 10px 16px; background: #333; color: white; border: none; border-radius: 6px; cursor: pointer; }
        #send-btn:disabled { opacity: 0.5; }
    </style>
</head>
<body>

<div class="chat-container">
    <header>Groq AI Assistant</header>
    <div id="chat-window" class="chat-window">
        <div class="message ai">Groq 모델(Llama 3)과 대화를 시작해보세요!</div>
    </div>
    <div class="input-area">
        <input type="text" id="user-input" placeholder="메시지를 입력하세요..." autocomplete="off">
        <button id="send-btn">전송</button>
    </div>
</div>

<script>
    // 1. 환경 변수 설정 (로컬 테스트용)
    // 실제 배포 시에는 'gsk_...'로 시작하는 키를 직접 넣거나 서버 환경변수를 활용하세요.
    const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 

    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return msgDiv;
    }

    async function fetchGroqResponse(userText) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Groq에서 지원하는 모델명
                messages: [{ role: "user", content: userText }]
            })
        });

        if (!response.ok) throw new Error("API 요청 실패");
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async function handleChat() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = "";
        sendBtn.disabled = true;

        const loading = addMessage("입력 중...", 'ai');

        try {
            const aiReply = await fetchGroqResponse(text);
            loading.innerText = aiReply;
        } catch (err) {
            loading.innerText = "에러: API 키를 확인하거나 나중에 다시 시도해주세요.";
        } finally {
            sendBtn.disabled = false;
        }
    }

    sendBtn.onclick = handleChat;
    userInput.onkeypress = (e) => { if(e.key === 'Enter') handleChat(); };
</script>

</body>
</html>
