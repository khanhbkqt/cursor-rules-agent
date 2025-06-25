# Tài liệu Chi tiết về Cursor Agent

**Cursor Agent** là trái tim của trải nghiệm trò chuyện trong Cursor. Đây không chỉ là một chatbot thông thường, mà là một trợ lý lập trình AI có khả năng tương tác sâu với mã nguồn của bạn để thực hiện các tác vụ từ đơn giản đến phức tạp.

---

### 1. Nguyên tắc Hoạt động Cốt lõi

Agent hoạt động dựa trên một vòng lặp: **Hiểu -> Lập kế hoạch -> Hành động**.

1.  **Hiểu (Understand):** Agent phân tích yêu cầu của bạn (prompt) và ngữ cảnh được cung cấp (ví dụ: các tệp bạn đã `@-mention`).
2.  **Lập kế hoạch (Plan):** Đối với các yêu cầu phức tạp, Agent sẽ tự vạch ra một kế hoạch gồm nhiều bước. Ví dụ: "Đầu tiên, đọc tệp A. Sau đó, tìm cách triển khai B. Cuối cùng, áp dụng logic từ B vào A."
3.  **Hành động (Act):** Agent thực thi kế hoạch bằng cách sử dụng một bộ công cụ nội bộ:
    *   Đọc tệp.
    *   Ghi hoặc chỉnh sửa tệp.
    *   Tìm kiếm trong codebase.
    *   Tra cứu tài liệu (`@Docs`).
    *   Tìm kiếm trên web (`@Web`).
    *   Thực thi lệnh terminal.

Bạn có thể thấy quá trình này diễn ra trực tiếp trong giao diện trò chuyện.

---

### 2. Cung cấp Ngữ cảnh cho Agent (`@-mentions`)

Đây là tính năng mạnh mẽ nhất để làm việc với Agent. Bằng cách sử dụng ký hiệu `@`, bạn có thể "đưa" các phần của codebase vào cuộc trò chuyện.

*   **`@<tên_tệp>`:**
    *   **Ví dụ:** `@src/components/Button.tsx`
    *   **Công dụng:** Yêu cầu Agent tập trung vào nội dung của tệp cụ thể này. Agent sẽ đọc toàn bộ tệp để có ngữ cảnh đầy đủ.

*   **`@<tên_thư_mục>/`:**
    *   **Ví dụ:** `@src/api/`
    *   **Công dụng:** Cung cấp ngữ cảnh về toàn bộ cấu trúc và các tệp bên trong một thư mục. Hữu ích khi bạn muốn thực hiện các thay đổi trên nhiều tệp hoặc cần Agent hiểu về kiến trúc của một module.

*   **`@<tên_biểu_tượng>` (Symbol):**
    *   **Ví dụ:** `@MyFunction`, `@UserService`
    *   **Công dụng:** Cho phép Agent nhanh chóng điều hướng đến định nghĩa của một hàm, lớp, hoặc biến cụ thể mà không cần đọc toàn bộ tệp. Đây là cách hiệu quả để hỏi về logic của một phần mã cụ thể.

---

### 3. Các Ví dụ Thực tế

#### a. Tạo mã mới (Code Generation)

*   **Prompt:**
    > `@src/components/ hãy tạo một component React mới tên là `UserProfileCard.tsx`. Component này nên nhận vào một đối tượng `user` với các thuộc tính `name`, `avatarUrl`, và `bio`. Sử dụng Tailwind CSS để tạo kiểu.

*   **Cách Agent hoạt động:**
    1.  Nhận diện yêu cầu tạo tệp mới trong thư mục `@src/components/`.
    2.  Tạo mã cho component `UserProfileCard` theo mô tả (props, JSX, styling).
    3.  Tạo tệp `src/components/UserProfileCard.tsx` và chèn mã vào.

#### b. Tái cấu trúc mã (Refactoring)

*   **Prompt:**
    > `@src/utils/api.ts Hãy tái cấu trúc hàm `fetchData`. Thay vì sử dụng `.then().catch()`, hãy chuyển sang sử dụng `async/await` với khối `try...catch` để xử lý lỗi.

*   **Cách Agent hoạt động:**
    1.  Đọc tệp `src/utils/api.ts`.
    2.  Xác định vị trí của hàm `fetchData`.
    3.  Phân tích logic hiện tại.
    4.  Viết lại hàm sử dụng `async/await`.
    5.  Đề xuất chỉnh sửa thay thế mã cũ bằng mã mới.

#### c. Debugging

*   **Prompt:**
    > `@App.tsx Tôi gặp lỗi "Cannot read properties of undefined" khi component này render. Hãy xem xét và tìm nguyên nhân tại sao state `currentUser` lại là undefined.

*   **Cách Agent hoạt động:**
    1.  Đọc `App.tsx`.
    2.  Kiểm tra cách `currentUser` được khởi tạo và cập nhật.
    3.  Truy vết luồng dữ liệu, có thể phát hiện ra một lời gọi API chưa hoàn thành hoặc một prop chưa được truyền.
    4.  Giải thích nguyên nhân và đề xuất cách khắc phục.

---

### 4. Tương tác với Công cụ Bên ngoài

*   **`@Docs <thư_viện> <câu_hỏi>`:**
    *   **Ví dụ:** `@Docs Next.js làm thế nào để thiết lập dynamic routes?`
    *   **Công dụng:** Tra cứu tài liệu chính thức và đáng tin cậy để trả lời các câu hỏi về API, cách sử dụng, và các phương pháp tốt nhất.

*   **`@Web <câu_hỏi>`:**
    *   **Ví dụ:** `@Web so sánh ưu và nhược điểm của Redux và Zustand cho quản lý state trong React`
    *   **Công dụng:** Tìm kiếm trên internet để lấy thông tin mới nhất, các bài viết so sánh, hướng dẫn từ cộng đồng. 