const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/health`);
        res.json({
            frontend: 'healthy',
            backend: response.data
        });
    } catch (error) {
        res.status(500).json({
            frontend: 'healthy',
            backend: 'unavailable',
            error: error.message
        });
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { sequence, analysis_type = 'score' } = req.body;

        if (!sequence) {
            return res.status(400).json({
                error: 'DNA sequence is required'
            });
        }

        console.log(`Analyzing sequence of length: ${sequence.length}`);

        const response = await axios.post(`${PYTHON_API_URL}/analyze`, {
            sequence: sequence,
            analysis_type: analysis_type
        });

        res.json(response.data);
    } catch (error) {
        console.error('Analysis error:', error.response?.data || error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data.detail || 'Analysis failed'
            });
        } else {
            res.status(500).json({
                error: 'Unable to connect to analysis service'
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📡 Python API expected at: ${PYTHON_API_URL}`);
});
