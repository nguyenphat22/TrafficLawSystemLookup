import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

// ===============================
// CORS & Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// (Model is now loaded on Colab)
// ===============================

// ===============================
// ROUTES
// ===============================
app.get('/', (req, res) => {
    res.json({ message: "RAG Legal API is running 🚀" });
});

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

app.post('/ask', async (req, res) => {
    try {
        const query = req.body;
        if (!query || !query.question) {
            return res.status(400).json({ error: "Missing 'question' in request body." });
        }

        const ngrok_url = "https://exciting-depraved-hardness.ngrok-free.dev";
        
        const response = await fetch(`${ngrok_url}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: query.question })
        });

        if (!response.ok) {
            throw new Error(`Colab Server Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error connecting to Colab:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
