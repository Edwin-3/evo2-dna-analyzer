class DNAAnalyzer {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.checkHealth();
    }

    initializeElements() {
        this.dnaSequence = document.getElementById('dnaSequence');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loading = document.getElementById('loading');
        this.resultsSection = document.getElementById('resultsSection');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');

        // Sequence info elements
        this.sequenceLength = document.getElementById('sequenceLength');
        this.sequenceValid = document.getElementById('sequenceValid');

        // Result elements
        this.resultLength = document.getElementById('resultLength');
        this.resultGC = document.getElementById('resultGC');
        this.resultTime = document.getElementById('resultTime');
        this.resultScore = document.getElementById('resultScore');
        this.resultFunction = document.getElementById('resultFunction');
        this.resultConservation = document.getElementById('resultConservation');
        this.resultMutations = document.getElementById('resultMutations');
    }

    setupEventListeners() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeSequence());
        this.sampleBtn.addEventListener('click', () => this.loadSample());
        this.clearBtn.addEventListener('click', () => this.clearSequence());
        this.dnaSequence.addEventListener('input', () => this.validateSequence());

        // Enter key to analyze
        this.dnaSequence.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.analyzeSequence();
            }
        });
    }

    validateSequence() {
        const sequence = this.dnaSequence.value.toUpperCase();
        const length = sequence.length;
        const isValid = /^[ACGT]*$/.test(sequence);

        this.sequenceLength.textContent = `Length: ${length}`;
        this.sequenceValid.textContent = isValid ? 'Valid sequence' : 'Invalid characters detected';
        this.sequenceValid.className = isValid ? 'valid' : 'invalid';

        this.analyzeBtn.disabled = !isValid || length === 0;
    }

    loadSample() {
        const samples = [
            'ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG',
            'GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG',
            'CGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTAC',
            'AAATTTCCCGGGATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG'
        ];

        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        this.dnaSequence.value = randomSample;
        this.validateSequence();
    }

    clearSequence() {
        this.dnaSequence.value = '';
        this.resultsSection.style.display = 'none';
        this.validateSequence();
    }

    async analyzeSequence() {
        const sequence = this.dnaSequence.value.toUpperCase().trim();

        if (!sequence) {
            this.showError('Please enter a DNA sequence');
            return;
        }

        this.showLoading(true);
        this.resultsSection.style.display = 'none';

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sequence: sequence,
                    analysis_type: 'score'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const result = await response.json();
            this.displayResults(result);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(result) {
        // Basic information
        this.resultLength.textContent = result.length.toLocaleString();
        this.resultGC.textContent = `${result.gc_content.toFixed(1)}%`;
        this.resultTime.textContent = `${(result.processing_time * 1000).toFixed(0)}ms`;

        // Evo 2 analysis
        this.resultScore.textContent = result.score.toFixed(3);
        this.resultFunction.textContent = result.predictions.functional_prediction;
        this.resultConservation.textContent = result.predictions.conservation_score.toFixed(3);
        this.resultMutations.textContent = result.predictions.mutations_detected;

        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.analyzeBtn.disabled = show;
    }

    showError(message) {
        alert(`Error: ${message}`);
        console.error('Analysis error:', message);
    }

    async checkHealth() {
        try {
            const response = await fetch('/api/health');
            const health = await response.json();

            if (health.backend && health.backend.status === 'healthy') {
                this.updateStatus('Connected', 'success');
            } else {
                this.updateStatus('Backend unavailable', 'warning');
            }
        } catch (error) {
            this.updateStatus('Connection error', 'error');
        }
    }

    updateStatus(message, type) {
        this.statusText.textContent = message;
        this.statusIndicator.className = `status-indicator ${type}`;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DNAAnalyzer();
});
