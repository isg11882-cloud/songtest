
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.getElementById('lotto-numbers');

    const colors = [
        '#ff6b6b', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa', '#339af0',
        '#22b8cf', '#20c997', '#51cf66', '#94d82d', '#fcc419', '#ff922b'
    ];

    generateBtn.addEventListener('click', () => {
        lottoNumbersContainer.innerHTML = ''; // Clear previous numbers
        const lottoNumbers = generateUniqueNumbers();

        lottoNumbers.forEach((number, index) => {
            const circle = document.createElement('div');
            circle.classList.add('lotto-number');
            circle.textContent = number;
            
            // Assign a unique color from the palette
            circle.style.backgroundColor = colors[index % colors.length];

            // Staggered animation
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
});

// Add keyframe animation to style.css for the fadeInUp effect
const styleSheet = document.styleSheets[0];
const keyframes = 
`@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
