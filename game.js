const questionMain = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));

const questionCounterHUD = document.getElementById('question-counter');
const scoreHUD = document.getElementById('score');

const API_URL = 'https://opentdb.com/api.php?amount=10&category=11&type=multiple';

let availableQuestions = [];
let currentQuestion = {};
let questionCounter = 0;
let acceptAnswers = false;
let score = 0;

// let questions = [
//     {
//         question: 'Inside which HTML element do we put the JavaScript??',
//         choice1: '<script>',
//         choice2: '<javascript>',
//         choice3: '<js>',
//         choice4: '<scripting>',
//         answer: 1,
//     },
//     {
//         question:
//             "What is the correct syntax for referring to an external script called 'xxx.js'?",
//         choice1: "<script href='xxx.js'>",
//         choice2: "<script name='xxx.js'>",
//         choice3: "<script src='xxx.js'>",
//         choice4: "<script file='xxx.js'>",
//         answer: 3,
//     },
//     {
//         question: " How do you write 'Hello World' in an alert box?",
//         choice1: "msgBox('Hello World');",
//         choice2: "alertBox('Hello World');",
//         choice3: "msg('Hello World');",
//         choice4: "alert('Hello World');",
//         answer: 4,
//     },
// ];

// Constants
const correct = 0;
let maxQuestions = 0;


async function fetchQuestions() {
    const res = await fetch(API_URL);
    const data = await res.json();

    startGame(data);
}

fetchQuestions();

// Functions
startGame = (data) => {
    questionCounter = 0;
    score = 0;

    finalData = data.results;
    availableQuestions = [...finalData];
    maxQuestions = finalData.length;

    console.log(availableQuestions);
    getNewQuestion();
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
        return window.location.assign('/end.html');
    }

    questionCounter++;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    const { question, correct_answer, incorrect_answers } = availableQuestions[questionIndex];
    currentQuestion = availableQuestions[questionIndex];

    const formattedQuestion = {
        'question': question,
        'options': [
            incorrect_answers[0],
            incorrect_answers[1],
            incorrect_answers[2],
            correct_answer
        ].sort(() => Math.random() - 0.5),
        'answer': correct_answer
    }

    console.log(correct_answer);

    questionMain.innerHTML = formattedQuestion.question;
    choices.forEach((choice, index) => {
        choice.innerHTML = formattedQuestion.options[index];
    })

    // HUD
    questionCounterHUD.innerText = `${questionCounter} of ${maxQuestions}`;

    availableQuestions.splice(questionIndex, 1);
    acceptAnswers = true;

    // Event listener
    formattedQuestion.options.forEach((option, index) => {
        choices[index].addEventListener('click', (e) => {
            if (!acceptAnswers) return;

            acceptAnswers = false;

            const selectedChoice = e.target;
            const selectedDataset = selectedChoice.innerHTML;

            let classStyle = 'incorrect';
            if (selectedDataset == currentQuestion.correct_answer) {
                classStyle = 'correct';
                selectedChoice.parentElement.classList.add(classStyle);
            } else {
                selectedChoice.parentElement.classList.add(classStyle);
            }

            if (classStyle === 'correct') {
                incrementScore(1);
            }

            console.log(selectedDataset);

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classStyle);
                getNewQuestion();
            }, 1000);
        })
    })
}

incrementScore = (num) => {
    score += num;
    scoreHUD.innerText = score;
}





