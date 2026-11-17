let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "All";
let editId = null;

// Display current date and time
function updateClock() {

    let now = new Date();

    document.getElementById("currentDate").innerText =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    document.getElementById("currentTime").innerText =
        now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();


// Add or Update Task
function addTask() {

    let name = document.getElementById("taskInput").value.trim();
    let date = document.getElementById("taskDate").value;
    let time = document.getElementById("taskTime").value;
    let priority = document.getElementById("priority").value;

    if (name === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {

        let task = tasks.find(t => t.id === editId);

        task.name = name;
        task.date = date;
        task.time = time;
        task.priority = priority;

        editId = null;

        document.getElementById("addButton").innerText =
            "Add Task";

    } else {

        let newTask = {
            id: Date.now(),
            name: name,
            date: date,
            time: time,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);

    }

    saveTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("priority").value = "Low";

}


// Save Tasks
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();

}


// Display Tasks
function displayTasks() {

    let list = document.getElementById("taskList");

    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "Pending") {
            return !task.completed;
        }

        if (currentFilter === "Completed") {
            return task.completed;
        }

        return true;

    });

    if (filteredTasks.length === 0) {

        list.innerHTML =
            '<p class="empty">No tasks available!</p>';

    }

    filteredTasks.forEach(task => {

        let div = document.createElement("div");

        div.className = "task " + task.priority;

        if (task.completed) {
            div.classList.add("completed");
        }

        let dateTime = task.date ?
            task.date + " " + (task.time || "") :
            "No deadline";

        let isOverdue = false;

        if (task.date && !task.completed) {

            let deadline = new Date(
                task.date + "T" + (task.time || "23:59")
            );

            isOverdue = deadline < new Date();

        }

        div.innerHTML = `
            <div class="task-info">

                <h3></h3>

                <p>📅 ${dateTime}</p>

                <p>Priority: ${task.priority}</p>

                <p class="${isOverdue ? 'overdue' : ''}">
                    ${isOverdue ? '⚠ Overdue' : ''}
                </p>

            </div>

            <div class="actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>

            </div>
        `;

        div.querySelector("h3").textContent = task.name;

        div.querySelector(".complete-btn").onclick = () =>
            completeTask(task.id);

        div.querySelector(".edit-btn").onclick = () =>
            editTask(task.id);

        div.querySelector(".delete-btn").onclick = () =>
            deleteTask(task.id);

        list.appendChild(div);

    });

    updateSummary();

}


// Complete Task
function completeTask(id) {

    let task = tasks.find(t => t.id === id);

    task.completed = !task.completed;

    saveTasks();

}


// Edit Task
function editTask(id) {

    let task = tasks.find(t => t.id === id);

    document.getElementById("taskInput").value = task.name;
    document.getElementById("taskDate").value = task.date;
    document.getElementById("taskTime").value = task.time;
    document.getElementById("priority").value = task.priority;

    editId = id;

    document.getElementById("addButton").innerText =
        "Update Task";

}


// Delete Task
function deleteTask(id) {

    if (confirm("Are you sure you want to delete this task?")) {

        tasks = tasks.filter(t => t.id !== id);

        saveTasks();

    }

}


// Filter Tasks
function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();

}


// Update Summary
function updateSummary() {

    document.getElementById("totalTasks").innerText =
        tasks.length;

    document.getElementById("pendingTasks").innerText =
        tasks.filter(t => !t.completed).length;

    document.getElementById("completedTasks").innerText =
        tasks.filter(t => t.completed).length;

}


// Initial Display
displayTasks();
