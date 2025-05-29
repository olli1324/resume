// Quiz data and functionality

// Quiz state
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizStarted = false;
let quizCompleted = false;

// DOM elements
let quizContainer;
let questionContainer;
let optionsContainer;
let progressBar;
let progressFill;
let scoreDisplay;
let nextButton;
let restartButton;
let finalScoreDisplay;

// Initialize the quiz when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch questions from questions.json
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Failed to load questions');
        quizQuestions = await response.json();
        
        initializeQuiz();
        
        // Update initial question count display
        const totalQuestionsSpan = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (totalQuestionsSpan) {
            totalQuestionsSpan.textContent = quizQuestions.length;
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        // Show error message to user
        const introContainer = document.getElementById('intro-container');
        if (introContainer) {
            introContainer.innerHTML += `
                <div style="color: red; background: #ffeeee; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h3>Error Loading Questions</h3>
                    <p>There was a problem loading the quiz questions. Please try again later.</p>
                </div>
            `;
        }
    }
});

function initializeQuiz() {
    // Get DOM elements
    quizContainer = document.getElementById('quiz-container');
    questionContainer = document.getElementById('question-container');
    optionsContainer = document.getElementById('options-container');
    progressBar = document.getElementById('progress-bar');
    progressFill = document.getElementById('progress-fill');
    scoreDisplay = document.getElementById('score-display');
    nextButton = document.getElementById('next-button');
    restartButton = document.getElementById('restart-button');
    finalScoreDisplay = document.getElementById('final-score');

    // Set up event listeners
    document.getElementById('start-quiz-button').addEventListener('click', startQuiz);
    nextButton.addEventListener('click', showNextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // Update UI elements
    updateProgressBar();
    updateScore();
}

function startQuiz() {
    quizStarted = true;
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    
    // Update total questions display
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = quizQuestions.length;
    
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    // Get the current question
    const question = quizQuestions[index];
    
    // Update the question text
    questionContainer.innerHTML = `
        <h4>Question ${index + 1} of ${quizQuestions.length}: ${question.question}</h4>
    `;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add new options
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.dataset.index = i;
        optionElement.addEventListener('click', checkAnswer);
        optionsContainer.appendChild(optionElement);
    });
    
    // Hide explanation if it was shown for previous question
    const explanationElement = document.getElementById('explanation');
    if (explanationElement) {
        explanationElement.style.display = 'none';
    }
    
    // Update progress bar
    updateProgressBar();
    
    // Disable next button until an answer is selected
    nextButton.disabled = true;
}

function checkAnswer(event) {
    // Get the selected option
    const selectedOption = event.target;
    const selectedAnswerIndex = parseInt(selectedOption.dataset.index);
    
    // Get the current question
    const question = quizQuestions[currentQuestionIndex];
    
    // Check if the answer is correct
    const isCorrect = selectedAnswerIndex === question.correctAnswer;
    
    // Mark all options as answered to prevent further selection
    const options = optionsContainer.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.add('answered');
        
        // Mark the correct and incorrect options
        const optionIndex = parseInt(option.dataset.index);
        if (optionIndex === question.correctAnswer) {
            option.classList.add('correct');
        } else if (optionIndex === selectedAnswerIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Show explanation
    let explanationElement = document.getElementById('explanation');
    if (!explanationElement) {
        explanationElement = document.createElement('div');
        explanationElement.id = 'explanation';
        explanationElement.className = 'explanation';
        questionContainer.appendChild(explanationElement);
    }
    
    explanationElement.innerHTML = `
        <p><strong>${isCorrect ? 'Correct!' : 'Incorrect!'}</strong> ${question.explanation}</p>
        <button id="detail-button" class="read-more-btn">Read More</button>
        <div id="detailed-explanation" class="detailed-explanation">${question.detailedExplanation}</div>
    `;
    explanationElement.style.display = 'block';
    
    // Add event listener to the "Read More" button
    document.getElementById('detail-button').addEventListener('click', function() {
        const detailedExplanation = document.getElementById('detailed-explanation');
        if (detailedExplanation.style.display === 'block') {
            detailedExplanation.style.display = 'none';
            this.textContent = 'Read More';
        } else {
            detailedExplanation.style.display = 'block';
            this.textContent = 'Read Less';
        }
    });
    
    // Update score if correct
    if (isCorrect) {
        score++;
        updateScore();
    }
    
    // Enable next button
    nextButton.disabled = false;
}

function showNextQuestion() {
    currentQuestionIndex++;
    
    // Check if we've reached the end of the quiz
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        // Show final score
        finishQuiz();
    }
}

function finishQuiz() {
    quizCompleted = true;
    
    // Hide quiz content
    document.getElementById('quiz-section').style.display = 'none';
    
    // Show final score section
    finalScoreDisplay.style.display = 'block';
    finalScoreDisplay.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} out of ${quizQuestions.length}</p>
        <p>Percentage: ${Math.round((score / quizQuestions.length) * 100)}%</p>
    `;
    
    // Show restart button
    restartButton.style.display = 'block';
}

function restartQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    
    // Hide final score and restart button
    finalScoreDisplay.style.display = 'none';
    restartButton.style.display = 'none';
    
    // Show quiz section
    document.getElementById('quiz-section').style.display = 'block';
    
    // Show first question
    showQuestion(currentQuestionIndex);
    
    // Update UI
    updateProgressBar();
    updateScore();
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressFill.style.width = `${Math.min(progress, 100)}%`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}/${quizQuestions.length}`;
}
