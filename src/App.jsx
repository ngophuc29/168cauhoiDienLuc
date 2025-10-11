import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null); // câu đang thao tác
  const [selectedOption, setSelectedOption] = useState(null); // đáp án được chọn

  useEffect(() => {
    fetch("/ghi_dien_thu_ngan_giao_dich_2025.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (qNumber, key) => {
    // Khi chọn ở câu khác => clear hết kết quả cũ, chỉ giữ câu mới
    setActiveQuestion(qNumber);
    setSelectedOption(key);
  };

  const getCorrectKey = (q) => {
    const keys = Object.keys(q.options);
    const correctIndex = parseInt(q.answer, 10) - 1;
    return keys[correctIndex];
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>
        🧩 Trắc nghiệm Ghi điện & Thu ngân 2025
      </h1>

      {questions.map((q) => {
        const isActive = activeQuestion === q.number;
        const correctKey = getCorrectKey(q);
        const isCorrect = selectedOption === correctKey;

        return (
          <div
            key={q.number}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              background: isActive ? "#f9f9f9" : "white",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              {q.number}. {q.question}
            </p>

            {Object.entries(q.options).map(([key, text]) => (
              <label key={key} style={{ display: "block", marginBottom: 5 }}>
                <input
                  type="radio"
                  name={`q-${q.number}`}
                  value={key}
                  checked={isActive && selectedOption === key}
                  onChange={() => handleSelect(q.number, key)}
                  style={{ marginRight: 6 }}
                />
                {text}
              </label>
            ))}

            {/* Chỉ hiển thị kết quả cho câu đang hoạt động */}
            {isActive && selectedOption && (
              <div style={{ marginTop: 8 }}>
                {isCorrect ? (
                  <span style={{ color: "green" }}>✅ Đáp án đúng</span>
                ) : (
                  <span style={{ color: "red" }}>
                    ❌ Sai. Đáp án đúng là:{" "}
                    <b style={{ color: "green" }}>
                      {correctKey}. {q.options[correctKey]}
                    </b>
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
