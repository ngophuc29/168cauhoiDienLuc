import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null); // câu đang thao tác
  const [selectedOptions, setSelectedOptions] = useState({}); // đáp án được chọn cho mỗi câu
  const [showAllAnswers, setShowAllAnswers] = useState(false); // hiển thị tất cả đáp án đúng

  useEffect(() => {
    fetch("/Dien ke Cup hoi Kiem tra 2025.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (qNumber, key) => {
    // Khi chọn ở câu khác => giữ kết quả cũ, chỉ cập nhật câu mới
    setSelectedOptions((prev) => ({ ...prev, [qNumber]: key }));
    setActiveQuestion(qNumber);
  };

  const getCorrectKey = (q) => {
    const keys = Object.keys(q.options);
    const correctIndex = parseInt(q.answer, 10) - 1;
    return keys[correctIndex];
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>
        🧩 Trắc nghiệm Điện kế - Cúp hơi - Kiểm tra
      </h1>

      <button
        onClick={() => setShowAllAnswers(!showAllAnswers)}
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        {showAllAnswers ? "Ẩn tất cả đáp án" : "Hiển thị tất cả đáp án"}
      </button>

      {questions.map((q) => {
        const isActive = activeQuestion === q.number;
        const correctKey = getCorrectKey(q);
        const selectedKey = selectedOptions[q.number];
        const isCorrect = selectedKey === correctKey;

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
                  checked={selectedKey === key}
                  onChange={() => handleSelect(q.number, key)}
                  style={{ marginRight: 6 }}
                />
                {text}
              </label>
            ))}

            {/* Hiển thị kết quả nếu đã chọn hoặc đang hiển thị tất cả */}
            {(selectedKey || showAllAnswers) && (
              <div style={{ marginTop: 8 }}>
                {selectedKey ? (
                  isCorrect ? (
                    <span style={{ color: "green" }}>✅ Đáp án đúng</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      ❌ Sai. Đáp án đúng là:{" "}
                      <b style={{ color: "green" }}>
                        {correctKey}. {q.options[correctKey]}
                      </b>
                    </span>
                  )
                ) : (
                  <span>
                    Đáp án đúng là:{" "}
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
