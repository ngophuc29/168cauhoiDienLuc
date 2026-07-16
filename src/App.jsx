import React, { useEffect, useMemo, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null); // câu đang thao tác
  const [selectedOptions, setSelectedOptions] = useState({}); // đáp án được chọn cho mỗi câu
  const [showAllAnswers, setShowAllAnswers] = useState(false); // hiển thị tất cả đáp án đúng
  const [searchQuery, setSearchQuery] = useState(""); // tìm theo nội dung câu hỏi
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetch("/Dien ke Cup hoi Kiem tra 2025.json")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được dữ liệu câu hỏi");
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoadError(null);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Không tải được danh sách câu hỏi. Vui lòng thử lại.");
      });
  }, []);

  const isSearching = searchQuery.trim().length > 0;

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((item) => {
      const inQuestion = item.question.toLowerCase().includes(q);
      const inNumber = String(item.number).includes(q);
      const inOptions = Object.values(item.options).some((text) =>
        String(text).toLowerCase().includes(q)
      );
      return inQuestion || inNumber || inOptions;
    });
  }, [questions, searchQuery]);

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
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>
        🧩 Trắc nghiệm Điện kế - Cúp hơi - Kiểm tra
      </h1>

      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="question-search"
          style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
        >
          Tìm kiếm câu hỏi
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id="question-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập từ khóa trong câu hỏi hoặc đáp án…"
            aria-describedby="search-hint"
            style={{
              flex: "1 1 220px",
              minWidth: 0,
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 5,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          {isSearching && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Xóa từ khóa tìm kiếm"
              style={{
                padding: "10px 16px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Xóa
            </button>
          )}
        </div>
        <p id="search-hint" style={{ margin: "6px 0 0", color: "#555", fontSize: 14 }}>
          {isSearching
            ? `Đang hiện ${filteredQuestions.length} kết quả kèm đáp án đúng.`
            : "Khi tìm kiếm, đáp án đúng sẽ hiện ngay dưới mỗi câu khớp."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowAllAnswers(!showAllAnswers)}
        disabled={isSearching}
        title={
          isSearching
            ? "Đang tìm kiếm — đáp án đã hiện sẵn, không cần bật nút này"
            : undefined
        }
        style={{
          display: "block",
          margin: "0 auto 20px",
          padding: "10px 20px",
          background: isSearching ? "#adb5bd" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: isSearching ? "not-allowed" : "pointer",
        }}
      >
        {showAllAnswers ? "Ẩn tất cả đáp án" : "Hiển thị tất cả đáp án"}
      </button>

      {loadError && (
        <p role="alert" style={{ color: "#c00", textAlign: "center" }}>
          {loadError}
        </p>
      )}

      {!loadError && questions.length === 0 && (
        <p style={{ textAlign: "center", color: "#555" }}>Đang tải câu hỏi…</p>
      )}

      {!loadError && questions.length > 0 && isSearching && filteredQuestions.length === 0 && (
        <div
          role="status"
          style={{
            border: "1px dashed #ccc",
            borderRadius: 10,
            padding: 20,
            textAlign: "center",
            background: "#fafafa",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Không tìm thấy câu hỏi nào</p>
          <p style={{ margin: 0, color: "#555" }}>
            Thử từ khóa khác hoặc{" "}
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                fontSize: "inherit",
              }}
            >
              xóa tìm kiếm
            </button>
            .
          </p>
        </div>
      )}

      {filteredQuestions.map((q) => {
        const isActive = activeQuestion === q.number;
        const correctKey = getCorrectKey(q);
        const selectedKey = selectedOptions[q.number];
        const isCorrect = selectedKey === correctKey;
        // Khi đang tìm kiếm: luôn hiện đáp án đúng ngay
        const revealAnswer = isSearching || selectedKey || showAllAnswers;

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

            {revealAnswer && (
              <div style={{ marginTop: 8 }}>
                {isSearching ? (
                  <span>
                    Đáp án đúng là:{" "}
                    <b style={{ color: "green" }}>
                      {correctKey}. {q.options[correctKey]}
                    </b>
                  </span>
                ) : selectedKey ? (
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
