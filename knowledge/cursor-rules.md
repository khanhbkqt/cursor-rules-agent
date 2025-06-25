# Tài liệu Chi tiết về Cursor Rules

**Cursor Rules** là cách bạn dạy cho Cursor Agent các quy tắc, quy ước và kiến thức cụ thể của dự án hoặc của cá nhân bạn. Việc này giúp Agent đưa ra các đề xuất phù hợp hơn, nhất quán hơn và giảm thiểu việc bạn phải lặp lại các chỉ dẫn.

Nguồn tham khảo: [Tài liệu chính thức của Cursor về Rules](https://docs.cursor.com/context/rules)

---

### 1. Tại sao Rules lại Quan trọng?

Các mô hình ngôn ngữ lớn (LLM) không có "trí nhớ" giữa các yêu cầu. Mỗi lần bạn gửi một prompt, nó là một phiên làm việc mới. Rules giải quyết vấn đề này bằng cách tự động chèn các chỉ dẫn của bạn vào đầu mỗi yêu cầu, đảm bảo Agent luôn có ngữ cảnh cần thiết.

---

### 2. Project Rules (Quy tắc Dự án)

Đây là loại quy tắc mạnh mẽ và linh hoạt nhất, được lưu trữ cùng với mã nguồn của bạn trong thư mục `.cursor/rules`.

#### a. Cấu trúc

*   Mỗi quy tắc là một tệp có phần mở rộng `.mdc` (Markdown with Components).
*   Các quy tắc này được quản lý phiên bản cùng với code (ví dụ: qua Git).
*   Bạn có thể có các thư mục `.cursor/rules` lồng nhau. Ví dụ: một thư mục cho frontend và một cho backend, giúp các quy tắc được áp dụng đúng phạm vi.

    ```
    project/
      .cursor/rules/        # Quy tắc toàn dự án
      backend/
        .cursor/rules/    # Quy tắc chỉ cho backend
      frontend/
        .cursor/rules/      # Quy tắc chỉ cho frontend
    ```

#### b. Cấu trúc tệp `.mdc`

Một tệp quy tắc `.mdc` bao gồm hai phần: metadata (siêu dữ liệu) và content (nội dung).

```yaml
---
# --- Phần Metadata ---
description: "Mô tả ngắn gọn về quy tắc này để Agent hiểu."
alwaysApply: false # hoặc true
globs: # (Tùy chọn) Mẫu tệp để kích hoạt quy tắc tự động
  - "src/services/**/*.ts"
  - "src/controllers/**/*.ts"
---

# --- Phần Nội dung ---
Đây là nội dung của quy tắc. Viết bằng ngôn ngữ tự nhiên.

- Khi tạo một service mới, luôn kế thừa từ lớp `BaseService`.
- Các phương thức phải có kiểu trả về rõ ràng.
- Sử dụng logger của chúng ta để ghi lại lỗi, không dùng `console.error`.

# Bạn cũng có thể tham chiếu đến một tệp mẫu
@../../templates/service-template.ts
```

#### c. Các loại Quy tắc Dự án (Rule Types)

Loại quy tắc được xác định bởi metadata:

1.  **Always (`alwaysApply: true`)**
    *   **Khi nào dùng:** Khi quy tắc này cực kỳ quan trọng và phải được áp dụng cho MỌI yêu cầu trong phạm vi của nó.
    *   **Ví dụ:** "Luôn sử dụng TypeScript strict mode."

2.  **Auto Attached (`globs: [...]`)**
    *   **Khi nào dùng:** Khi quy tắc chỉ liên quan đến một phần cụ thể của codebase.
    *   **Công dụng:** Quy tắc sẽ tự động được đính kèm vào ngữ cảnh khi bạn `@-mention` một tệp khớp với mẫu trong `globs`.
    *   **Ví dụ:** Một quy tắc về cách viết component React (`globs: ["src/components/**/*.tsx"]`) sẽ được kích hoạt khi bạn làm việc với một component.

3.  **Agent Requested (`description: "..."`)**
    *   **Khi nào dùng:** Quy tắc không phải lúc nào cũng cần, nhưng Agent có thể tự quyết định sử dụng nó nếu thấy liên quan.
    *   **Công dụng:** `description` là chìa khóa. Agent sẽ đọc mô tả này để quyết định xem có nên tải toàn bộ nội dung quy tắc vào ngữ cảnh hay không.
    *   **Ví dụ:** `description: "Hướng dẫn về cách kết nối và truy vấn cơ sở dữ liệu."`

4.  **Manual (`@<tên_quy_tắc>`)**
    *   **Khi nào dùng:** Khi bạn muốn kích hoạt một quy tắc một cách thủ công.
    *   **Công dụng:** Quy tắc sẽ chỉ được áp dụng nếu bạn gọi nó một cách tường minh trong prompt.

---

### 3. User Rules (Quy tắc Người dùng)

*   **Phạm vi:** Toàn cục, áp dụng cho mọi dự án của bạn.
*   **Định dạng:** Chỉ là văn bản thuần túy (plain text).
*   **Vị trí:** Được định nghĩa trong `Cursor Settings > Rules`.
*   **Khi nào dùng:** Để thiết lập các sở thích cá nhân không phụ thuộc vào dự án.
*   **Ví dụ:**
    > "Hãy luôn trả lời bằng tiếng Việt. Giải thích các khái niệm phức tạp một cách đơn giản và đi thẳng vào vấn đề."

---

### 4. Memories (Ký ức)

*   **Phạm vi:** Theo từng kho Git (repository).
*   **Cách tạo:** Tự động. Cursor sẽ phân tích các cuộc trò chuyện của bạn và nếu nó nhận thấy một chỉ dẫn hoặc sở thích được lặp lại, nó sẽ đề nghị lưu lại thành một "Memory".
*   **Công dụng:** Là một cách tự động để tạo ra các quy tắc mà bạn có thể không nhận ra là mình cần.
*   **Quản lý:** Bạn có thể xem và xóa Memories trong `Cursor Settings > Rules`.

Bằng cách kết hợp các loại quy tắc này, bạn có thể tạo ra một môi trường làm việc thông minh và hiệu quả, nơi Agent thực sự hiểu và tuân thủ các quy trình của bạn. 