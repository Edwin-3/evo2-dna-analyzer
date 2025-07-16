# Evo 2 DNA Analysis Web App

## Overview

The Evo 2 DNA Analysis Web App is a full-stack application that leverages the Evo 2 language model to analyze DNA sequences. It provides a user-friendly interface for inputting DNA sequences and receiving real-time analysis results, including likelihood scores, functional predictions, and other genomic metrics.

## Features

- **DNA Sequence Analysis**: Analyze DNA sequences using the Evo 2 AI model.
- **Real-time Results**: Get immediate feedback on sequence properties and predictions.
- **Interactive UI**: User-friendly interface with sample loading and validation.
- **Microservices Architecture**: Separates Python AI backend from Node.js frontend for scalability.
- **Docker Support**: Ready for containerized deployment.

## Tech Stack

- **Backend (Python)**: FastAPI for REST API, Evo 2 for DNA analysis.
- **Frontend (Node.js)**: Express.js server serving HTML/CSS/JS.
- **Database**: Optional SQLAlchemy integration for storing results.
- **Containerization**: Docker and Docker Compose for easy deployment.

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- GPU with CUDA support (recommended for Evo 2)
- Docker (optional for containerized deployment)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/evo2-dna-analyzer.git
   cd evo2-dna-analyzer
   ```

2. **Set Up Python Backend**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install Python dependencies
   cd python-service
   pip install -r requirements.txt
   ```

3. **Set Up Node.js Frontend**
   ```bash
   cd ../node-service
   npm install
   ```

4. **Run the Application**
   - Start the Python backend:
     ```bash
     cd ../python-service
     python app.py
     ```
   - Start the Node.js frontend (in a new terminal):
     ```bash
     cd ../node-service
     npm start
     ```

5. **Access the App**
   Open your browser and navigate to `http://localhost:3000`.

## Docker Deployment

1. **Build and Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the App**
   The app will be available at `http://localhost`.

## Configuration

Environment variables can be set in a `.env` file:

```bash
# .env file
NODE_ENV=production
PYTHON_API_URL=http://python-service:8000
PORT=3000
UVICORN_HOST=0.0.0.0
UVICORN_PORT=8000
```

## Usage

1. Enter a DNA sequence in the input box or click "Load Sample" to load a predefined sequence.
2. Click "Analyze Sequence" to submit the sequence for analysis.
3. View the results in the "Analysis Results" section.

## Testing

### Python Backend Tests
```bash
cd python-service
pytest
```

### Node.js Frontend Tests
```bash
cd node-service
npm test
```

## Project Structure

```
evo2-dna-analyzer/
├── python-service/          # FastAPI backend
│   ├── app.py               # Main FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── test_app.py          # Unit tests
├── node-service/            # Express.js frontend
│   ├── server.js            # Express server
│   ├── public/              # Frontend assets
│   │   ├── index.html       # Main HTML file
│   │   ├── style.css        # CSS styles
│   │   └── script.js        # Client-side JavaScript
│   └── package.json         # Node.js dependencies
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # Project documentation
```

## Troubleshooting

- **Evo 2 Model Loading Issues**: Ensure CUDA is available and GPU memory is sufficient.
- **Port Conflicts**: Change ports in `app.py` (Python) or `package.json` (Node.js) if needed.
- **CORS Issues**: Verify CORS settings in `server.js`.

## Extensions

- Add more analysis types (e.g., protein translation, ORF finding).
- Enhance UI with sequence visualization and export options.
- Integrate with databases for persistent storage.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.