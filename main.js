/* 
Réaliser une application de type to-do list en JavaScript. 

Objectif principal : 
L'application doit permettre à l'utilisateur de rentrer des nouvelles tâches via un champ input et de consulter les tâches en cours. 

Objectifs supplémentaires : 
- Avoir un bouton pour dire que la tâche a été effectuée
- Avoir un bouton la supprimer
- Pouvoir éditer la tâche

Vous pouvez utiliser Bootstrap (modifié)
 */

import '@picocss/pico';
import './style.css';

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const tasksList = document.querySelector("#tasks-list");
updateTasksList();

const addTaskForm = document.querySelector('#add-task');
addTaskForm.addEventListener('submit', addTask);

function addTask(e) {
  e.preventDefault();
  const taskInput = e.target.elements['task'];
  const userInput = taskInput.value.trim();
  if (userInput === "") {
    return;
  }
  taskInput.value = "";

  // update localStorage
  tasks.push({
    id: `${Date.now()}-${tasks.length}`,
    description: userInput,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // update display
  updateTasksList();
  for (const task of tasks) {
    console.log(task.id);
  }
}

function editTask(e) {
  e.preventDefault();
  const taskItem = e.target.parentElement;

  const taskInput = e.target.elements['edit-task'];
  const userInput = taskInput.value.trim();
  if (userInput === "") {
    return;
  }
  taskItem.innerHTML = "";

  const updatedTask = tasks.find(task => task.id === taskItem.id);
  updatedTask.description = userInput;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateTasksList();
}

function updateTasksList() {
  tasksList.innerHTML = "";
  for (const task of tasks) {
    const listItem = makeTaskListItem(task);
    tasksList.appendChild(listItem);
  }
}

function makeTaskListItem(task) {
  const listItem = document.createElement('li');
  listItem.setAttribute("id", task.id);

  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  listItem.appendChild(checkBox);

  const taskDescription = document.createElement("span");
  taskDescription.textContent = task.description;
  listItem.appendChild(taskDescription);

  makeButtons().forEach(button => listItem.appendChild(button));

  return listItem;
}

function makeButtons() {
  const icons = { edit: '📝', delete: '🗑️' };
  const buttons = [];
  for (const key in icons) {
    const button = document.createElement('button');
    button.setAttribute('name', key);
    // Pico CSS 
    button.setAttribute("role", "button");
    button.classList.add("secondary", "outline");
    button.textContent = icons[key];
    button.addEventListener("click", taskButtonClickHandler);
    buttons.push(button);
  }
  return buttons;
}

function taskButtonClickHandler(e) {
  if (e.target.name === "delete") {
    return deleteButtonClickHandler(e);
  }
  if (e.target.name === "edit") {
    return editButtonClickHandler(e);
  }
}

function deleteButtonClickHandler(e) {
  const taskId = e.target.parentElement.id;
  console.log(`TODO: delete task #${taskId}`);
  tasks = tasks.filter(task => task.id !== taskId);
  console.log(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateTasksList();
}

function editButtonClickHandler(e) {
  const taskEditor = makeTaskEditor(e);
  const taskItem = e.target.parentElement;
  taskItem.innerHTML = "";
  taskItem.appendChild(taskEditor);

  taskEditor.addEventListener("submit", editTask);
}

function makeTaskEditor(e) {
  const span = e.target.previousElementSibling;
  const taskDescription = span.textContent;

  const inputElement = document.createElement("input");
  inputElement.setAttribute("id", "edit-task");
  inputElement.value = taskDescription;
  inputElement.style.width = "90%";

  const taskEditor = document.createElement("form");
  const editorLabel = document.createElement("label");
  editorLabel.setAttribute("for", "edit-task");
  editorLabel.textContent = "Modifier: ";
  const editorButton = document.createElement("button");
  editorButton.textContent = "💾";
  editorButton.setAttribute("role", "button");
  editorButton.classList.add("secondary", "outline");

  taskEditor.appendChild(editorLabel);
  taskEditor.appendChild(inputElement);
  taskEditor.appendChild(editorButton);

  return taskEditor;
}
