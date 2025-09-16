import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answersStatus, setAnswersStatus] = useState({}); // {0: "correct", 1: "wrong"}

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        // Parse lại dữ liệu từ file JSON gốc sang dạng UI đang dùng
        const parsed = data.map((q, idx) => ({
          question_number: idx + 1,
          question_text: q.question,
          answers: q.options.map((opt, i) => ({
            option: String.fromCharCode(65 + i), // A, B, C, D...
            text: opt.replace(/^[A-D]\.\s*|^\//, '').trim(), // loại bỏ ký tự đầu nếu có
            is_correct: i === q.correctAnswer,
          })),
          correct_answer: String.fromCharCode(65 + q.correctAnswer),
        }));
        setQuestions(parsed);
      });
  }, []);

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);

    const currentQuestion = questions[currentQuestionIndex];
    const result = option === currentQuestion.correct_answer;
    setIsCorrect(result);

    setAnswersStatus((prev) => ({
      ...prev,
      [currentQuestionIndex]: result ? "correct" : "wrong",
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(null);
    setIsCorrect(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!questions.length)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Đang tải câu hỏi...
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#dbeafe,#fff,#fce7f3)",
      }}
    >
      {/* LEFT SIDE - Câu hỏi */}
      <div style={{ flex: 3, padding: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "1px solid #bfdbfe",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              textAlign: "center",
              color: "#1e3a8a",
              marginBottom: "24px",
            }}
          >
            {currentQuestion.question_number}: {currentQuestion.question_text}
          </h1>

          {/* Answers */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.option;
              const isCorrectAnswer = answer.is_correct;

              let styleBtn = {
                padding: "16px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                border: "2px solid #d1d5db",
                backgroundColor: "#fff",
                cursor: selectedAnswer ? "default" : "pointer",
                textAlign: "left",
              };

              if (selectedAnswer) {
                if (isCorrectAnswer) {
                  styleBtn = {
                    ...styleBtn,
                    backgroundColor: "#22c55e",
                    color: "#fff",
                    fontWeight: "bold",
                    borderColor: "#15803d",
                  };
                }
                if (isSelected && !isCorrectAnswer) {
                  styleBtn = {
                    ...styleBtn,
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    fontWeight: "bold",
                    borderColor: "#b91c1c",
                  };
                }
              }

              return (
                <button
                  key={answer.option}
                  style={styleBtn}
                  onClick={() => handleAnswerClick(answer.option)}
                  disabled={!!selectedAnswer}
                >
                  <b>{answer.option}.</b> {answer.text}
                </button>
              );
            })}
          </div>

          {/* Result + Next */}
          <AnimatePresence>
            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: isCorrect ? "#15803d" : "#b91c1c",
                  }}
                >
                  {isCorrect
                    ? "🎉 Chính xác!"
                    : "❌ Sai rồi! Xem đáp án đúng được tô xanh."}
                </p>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "12px 24px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: "bold",
                  }}
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Hoàn thành 🎯"
                    : "Câu tiếp theo ➡️"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* RIGHT SIDE - Danh sách câu hỏi */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f1f5f9",
          borderLeft: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowX: "auto"
        }}
      >
        <h3 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}>
          Danh sách câu hỏi
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            justifyContent: 'space-around'
          }}
        >
          {questions.map((q, idx) => {
            let bg = "#fff";
            if (answersStatus[idx] === "correct") bg = "#22c55e";
            if (answersStatus[idx] === "wrong") bg = "#ef4444";

            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(idx)}
                style={{
                  width: "70px",
                  height: "45px",
                  borderRadius: "8px",
                  backgroundColor: idx === currentQuestionIndex ? "#2563eb" : bg,
                  color: idx === currentQuestionIndex ? "#fff" : "#111",
                  fontWeight: "bold",
                  border: "1px solid #d1d5db",
                  textAlign: "center",
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
