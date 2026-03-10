// ============================================
// index.html과 style.css를 참고해서
// 할 일 목록 앱을 완성하세요.
//
// 요구사항:
// - 페이지 로드 시 서버에서 할 일 목록을 불러와 화면에 표시
// - 폼 제출 시 새 할 일을 서버에 추가
// - 토글 버튼 클릭 시 완료 상태를 서버에서 변경
// - 삭제 버튼 클릭 시 서버에서 할 일을 삭제
// ============================================

// ==========================
// 설정
// ==========================
const BASE_URL = "http://localhost:4000/todos";

// ==========================
// DOM 요소
// ==========================
const todoFormElement = document.querySelector("#todo-form");
const todoInputElement = document.querySelector("#todo-input");
const todoListElement = document.querySelector("#todo-list");

// ==========================
// App Init
// ==========================
addEventListener("DOMContentLoaded", initApp);

// 앱 초기화: 할 일 목록을 조회하고 랜더링
async function initApp() {
  try {
    const todos = await getTodos();

    if (todos.length === 0) {
      todoListElement.innerHTML =
        '<p class="empty-message">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>';
    } else {
      renderTodoList(todos);
    }
  } catch (error) {
    alert(error.message + " 잠시 후 다시 시도해주세요.");
  }
}

// ==========================
// API
// ==========================

// 서버에서 할 일 목록 조회
async function getTodos() {
  const response = await fetch(BASE_URL);
  if (!response.ok)
    throw new Error("할 일 목록을 불러오는 중 오류가 발생했습니다.");
  return response.json();
}

// 서버에 할 일 추가
async function addTodo(title) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, completed: false }),
  });

  if (!response.ok) throw new Error("할 일을 추가하던 중 오류가 발생했습니다.");

  return response.json();
}

// 서버의 할 일 완료 상태 토글
async function toggleTodo(id, completed) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: completed }),
  });

  if (!response.ok)
    throw new Error("할 일의 완료 상태를 변경하던 중 오류가 발생했습니다.");
  return response.json();
}

// 서버에서 할 일 삭제
async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok)
    throw new Error("할 일 삭제를 하던 중 오류가 발생했습니다.");

  return true;
}

// ==========================
// Render
// ==========================
// 단일 todo 렌더링
function renderTodo(todo) {
  const todoItemElement = document.createElement("div");
  todoItemElement.classList.add("todo-item");
  if (todo.completed) todoItemElement.classList.add("completed");

  const todoTitleElement = document.createElement("h3");
  todoTitleElement.classList.add("title");
  todoTitleElement.textContent = todo.title;

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.classList.add("btn-toggle");
  toggleButton.textContent = todo.completed ? "완료" : "미완료";

  toggleButton.addEventListener("click", async () => {
    try {
      const updatedTodo = await toggleTodo(todo.id, !todo.completed);

      todoItemElement.classList.toggle("completed", updatedTodo.completed);
      toggleButton.textContent = updatedTodo.completed ? "완료됨" : "미완료";
    } catch (error) {
      alert(error.message + " 잠시 후 다시 시도해주세요.");
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("btn-delete");
  deleteButton.textContent = "삭제";

  deleteButton.addEventListener("click", async () => {
    try {
      const success = await deleteTodo(todo.id);
      if (success) todoItemElement.remove();
    } catch (error) {
      alert(error.message + " 잠시 후 다시 시도해주세요.");
    }
  });

  todoItemElement.append(todoTitleElement, toggleButton, deleteButton);

  return todoItemElement;
}

// 전체 todo 목록 렌더링
function renderTodoList(todos) {
  todoListElement.innerHTML = "";

  todos.forEach((todo) => {
    const todoItemElement = renderTodo(todo);
    todoListElement.append(todoItemElement);
  });
}

// ==========================
// Event Listeners
// ==========================
todoFormElement.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = todoInputElement.value.trim();
  if (!title) return;

  try {
    const newTodo = await addTodo(title);

    const newTodoElement = renderTodo(newTodo);
    todoListElement.append(newTodoElement);
  } catch (error) {
    alert(error.message + " 잠시 후 다시 시도해주세요.");
  }

  todoInputElement.value = "";
});
