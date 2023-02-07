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

import './style.css';

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasks);

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

  tasks.push({
    id: `${Date.now()}-${tasks.length}`,
    description: userInput,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

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
  console.log(localStorage.getItem("tasks"));
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

  listItem.appendChild(makeButtons());

  return listItem;
}

function makeButtons() {
  const icons = { edit: '📝', delete: '🗑️' };
  const buttonsDiv = document.createElement("div");
  for (const key in icons) {
    const button = document.createElement('button');
    button.setAttribute('name', key);
    button.textContent = icons[key];
    button.addEventListener("click", taskButtonClickHandler);
    buttonsDiv.appendChild(button);
  }
  return buttonsDiv;
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
  const taskId = e.target.parentElement.parentElement.id;
  console.log(`TODO: delete task #${taskId}`);
  tasks = tasks.filter(task => task.id !== taskId);
  console.log(tasks);
  updateTasksList();
}

function editButtonClickHandler(e) {
  const taskEditor = makeTaskEditor(e);
  const taskItem = e.target.parentElement.parentElement;
  taskItem.innerHTML = "";
  taskItem.appendChild(taskEditor);

  taskEditor.addEventListener("submit", editTask);
}

function makeTaskEditor(e) {
  const span = e.target.parentElement.previousElementSibling;
  const taskDescription = span.textContent;

  const inputElement = document.createElement("input");
  inputElement.setAttribute("id", "edit-task");
  inputElement.value = taskDescription;

  const taskEditor = document.createElement("form");
  const editorLabel = document.createElement("label");
  editorLabel.setAttribute("for", "edit-task");
  editorLabel.textContent = "Modifier: "
  const editorButton = document.createElement("button");
  editorButton.textContent = "💾";

  taskEditor.appendChild(editorLabel);
  taskEditor.appendChild(inputElement);
  taskEditor.appendChild(editorButton);

  return taskEditor;
}
