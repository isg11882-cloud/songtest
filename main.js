
document.addEventListener('DOMContentLoaded', () => {
    // Existing Lotto & Theme Logic
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    // Theme logic
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeBtn.textContent = 'Light Mode';
    }

    themeBtn.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            themeBtn.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeBtn.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Lotto logic
    const colors = [
        '#ff6b6b', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0',
        '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#fcc419', '#ff922b'
    ];

    generateBtn.addEventListener('click', () => {
        lottoNumbersContainer.innerHTML = '';
        const lottoNumbers = generateUniqueNumbers();
        lottoNumbers.forEach((number, index) => {
            const circle = document.createElement('div');
            circle.classList.add('lotto-number');
            circle.textContent = number;
            circle.style.backgroundColor = colors[index % colors.length];
            circle.style.animation = `fadeInUp 0.5s ${index * 0.1}s ease-out forwards`;
            lottoNumbersContainer.appendChild(circle);
        });
    });

    function generateUniqueNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // --- Logo Similarity Search Logic (Teachable Machine Integration) ---
    const URL = "https://teachablemachine.withgoogle.com/models/9zz7ofRNd/";
    let model, maxPredictions;

    const dropZone = document.getElementById('drop-zone');
    const logoInput = document.getElementById('logo-input');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisResults = document.getElementById('analysis-results');
    const resultsGrid = document.getElementById('results-grid');

    // Load the image model
    async function initModel() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }

    if (dropZone) {
        dropZone.addEventListener('click', () => logoInput.click());

        logoInput.addEventListener('change', (e) => {
            if (logoInput.files.length) {
                updateThumbnail(logoInput.files[0]);
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drop-zone--over');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZone.addEventListener(type, () => {
                dropZone.classList.remove('drop-zone--over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                logoInput.files = e.dataTransfer.files;
                updateThumbnail(e.dataTransfer.files[0]);
            }
            dropZone.classList.remove('drop-zone--over');
        });
    }

    function updateThumbnail(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                previewImg.src = reader.result;
                imagePreview.style.display = 'block';
                dropZone.style.display = 'none';
                analysisResults.style.display = 'none';
            };
        }
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            analyzeBtn.textContent = 'Loading Model...';
            analyzeBtn.disabled = true;

            try {
                if (!model) await initModel();
                
                analyzeBtn.textContent = 'Analyzing...';
                const prediction = await model.predict(previewImg);
                
                // Sort predictions by probability
                prediction.sort((a, b) => b.probability - a.probability);
                
                displayResults(prediction);
            } catch (error) {
                console.error("Analysis failed:", error);
                alert("Model analysis failed. Please try again.");
            } finally {
                analyzeBtn.textContent = 'Analyze Logo';
                analyzeBtn.disabled = false;
            }
        });
    }

    function displayResults(predictions) {
        resultsGrid.innerHTML = '';
        analysisResults.style.display = 'block';
        
        // 상위 4개의 결과만 표시
        predictions.slice(0, 4).forEach(p => {
            const probability = (p.probability * 100).toFixed(1);
            if (probability > 0) { // 확률이 0인 것은 제외
                const div = document.createElement('div');
                div.classList.add('result-item');
                div.innerHTML = `
                    <div style="font-size: 1.2rem; margin-bottom: 10px;">🏷️</div>
                    <span style="font-size: 1rem; color: var(--primary-color);">${p.className}</span>
                    <span style="font-size: 0.8rem; opacity: 0.7;">Match: ${probability}%</span>
                `;
                resultsGrid.appendChild(div);
            }
        });
    }
});

// Animation Keyframes
const styleSheet = document.styleSheets[0];
const keyframes = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
