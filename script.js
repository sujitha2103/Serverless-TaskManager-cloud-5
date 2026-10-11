const API_URL = "";
let tasks = [];


/* ---------------- LOAD TASKS ---------------- */

function loadTasks() {
    const savedTasks = localStorage.getItem("serverlessTasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
}


/* ---------------- SAVE TASKS ---------------- */

function saveTasks() {
    localStorage.setItem(
        "serverlessTasks",
        JSON.stringify(tasks)
    );
}


/* ---------------- ADD TASK ---------------- */

function addTask() {

    const input =
        document.getElementById("taskInput");

    const taskName =
        input.value.trim();

    if (taskName === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    input.value = "";

    renderTasks();
}


/* ---------------- COMPLETE TASK ---------------- */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


/* ---------------- DELETE TASK ---------------- */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


/* ---------------- DISPLAY TASKS ---------------- */

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                No tasks available
            </div>
        `;

        updateStats();

        return;
    }

    taskList.innerHTML = tasks.map(task => `

        <div class="task">

            <div class="task-info">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-name ${
                    task.completed ? "completed" : ""
                }">
                    ${task.name}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        </div>

    `).join("");

    updateStats();
}


/* ---------------- STATISTICS ---------------- */

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    document.getElementById("totalTasks")
        .textContent = total;

    document.getElementById("completedTasks")
        .textContent = completed;

    document.getElementById("pendingTasks")
        .textContent = pending;
}


/* ---------------- ENTER KEY ---------------- */

document
    .getElementById("taskInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    });


/* ---------------- INITIAL LOAD ---------------- */

loadTasks();