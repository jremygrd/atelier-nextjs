import { useState, useEffect } from 'react';

// The Home component is the default export of this file, making it the main component for this page.
export default function Home({ data }) {
  // useState is a React hook that lets you add state to function components.
  // Here, various states are initialized to manage the quiz functionality.

  // State to hold the shuffled questions.
  const [questions, setQuestions] = useState([]); 

  // State to keep track of the current question index.
  const [questionCursor, setQuestionCursor] = useState(0);

  // State to determine if an answer has been selected.
  const [answerAnswered, setAnswerAnswered] = useState(false);

  // State to count the number of correct answers.
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // State to determine if the quiz has ended.
  const [endQuiz, setEndQuiz] = useState(false);

  // Function to shuffle answers to ensure randomness.
  function shuffleAnswers(answers) {
    return answers.sort(() => Math.random() - 0.5);
  }

  // useEffect is a React hook that runs side-effects in function components.
  // Here, it's used to shuffle the quiz data when the component mounts.
  useEffect(() => {
    const shuffledData = data.map(question => ({
      ...question,
      answers: shuffleAnswers([question.correctAnswer, ...question.incorrectAnswers]),
    }));
    setQuestions(shuffledData);
  }, [data]); // Dependency array includes 'data' to ensure effect runs when 'data' changes.

  // Function to handle the 'Next Question' action.
  function nextQuestion() {
    setAnswerAnswered(false);
    if (questionCursor < questions.length - 1) {
      setQuestionCursor(questionCursor + 1);
    } else {
      setEndQuiz(true);
    }
  }

  // Function to handle answer selection and update the score.
  function handleAnswer(isCorrect) {
    if (!endQuiz) {
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
      setAnswerAnswered(true);
    }
  }

  // Get the current question based on the questionCursor.
  const currentQuestion = questions[questionCursor];

  // Render a loading state if there's no current question.
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  // Main render method of the component.
  return (
    <main className="flex min-h-screen flex-col items-center mt-24 px-24">
      <div className='flex flex-row justify-between w-full max-w-5xl'>
        <p className="mb-12">Notre Quiz</p>
        <p>{questionCursor + 1} sur {questions.length}</p>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className='bg-blue-200 w-full rounded-md flex flex-col p-4 gap-y-12'>
          <p className="text-center text-lg">{currentQuestion.question.text}</p>
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                className={`bg-blue-300 p-6 rounded-md text-lg ${answerAnswered && answer === currentQuestion.correctAnswer ? "bg-green-400" : answerAnswered ? "bg-red-200" : "hover:bg-blue-400"}`}
                onClick={() => handleAnswer(answer === currentQuestion.correctAnswer)}
                disabled={answerAnswered}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
      {
        answerAnswered && !endQuiz && (
          <button
            className='bg-blue-500 text-white p-4 rounded-md mt-6 cursor-pointer'
            onClick={nextQuestion}>Next Question</button>
        )
      }

      {
        endQuiz && (
          <div className='mt-6 p-4 bg-green-200 rounded-md'>
            <p>Vous avez répondu correctement à {correctAnswers} questions sur {questions.length}</p>
          </div>
        )
      }
    </main>
  );
}

// getServerSideProps is a Next.js function that fetches data on each request, used for server-side rendering.
export async function getServerSideProps() {
  // Fetching quiz data from the API.
  const res = await fetch('http://localhost:3000/api/trivia');
  const data = await res.json();

  // The fetched data is passed as props to the Home component.
  return {
    props: { data },
  };
}
