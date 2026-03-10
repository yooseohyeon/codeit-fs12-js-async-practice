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
  const todos = await getTodos();
  console.log("전체 할 일 목록:", todos);
  renderTodoList(todos);
}

// ==========================
// API
// ==========================

// 서버에서 할 일 목록 조회
async function getTodos() {
  const response = await fetch(BASE_URL);
  const todos = await response.json();
  return todos;
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

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("btn-delete");
  deleteButton.textContent = "삭제";

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
