// ==========================================
// TASKFLOW - TASK MANAGEMENT APPLICATION
// ==========================================


// ==========================================
// TASK DATA
// ==========================================

// Load saved tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const categoryInput = document.getElementById("categoryInput");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");

const activeTasks = document.getElementById("activeTasks");

const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// Current filter
let currentFilter = "all";


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ADD TASK
// ==========================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const taskText = taskInput.value.trim();

    const category = categoryInput.value;


    // Validation
    if (taskText === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    // Create task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        category: category,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save task
    saveTasks();


    // Clear input
    taskInput.value = "";

    taskInput.focus();


    // Display tasks
    displayTasks();

});


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    // Apply filter
    if (currentFilter === "active") {

        filteredTasks = filteredTasks.filter(function (task) {

            return task.completed === false;

        });

    }


    if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(function (task) {

            return task.completed === true;

        });

    }


    // Apply search
    const searchText = searchInput.value
        .trim()
        .toLowerCase();


    if (searchText !== "") {

        filteredTasks = filteredTasks.filter(function (task) {

            return (
                task.text.toLowerCase().includes(searchText) ||
                task.category.toLowerCase().includes(searchText)
            );

        });

    }


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create task cards
    filteredTasks.forEach(function (task) {


        const taskCard = document.createElement("div");


        taskCard.className = "task-card";


        // Add completed class
        if (task.completed) {

            taskCard.classList.add("completed");

        }


        taskCard.innerHTML = `

            <div class="task-info">

                <h3>
                    ${task.text}
                </h3>

                <p>
                    Category: ${task.category}
                </p>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="completeTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskCard);

    });


    // Update statistics
    updateCounters();

}


// ==========================================
// COMPLETE / UNDO TASK
// ==========================================

function completeTask(id) {


    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (task) {

        task.completed = !task.completed;

    }


    saveTasks();

    displayTasks();

}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {


    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text = newText.trim();

        saveTasks();

        displayTasks();

    }

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {


    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {

        return;

    }


    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// ==========================================
// SEARCH TASKS
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        displayTasks();

    }
);


// ==========================================
// FILTER TASKS
// ==========================================

filterButtons.forEach(function (button) {


    button.addEventListener(
        "click",
        function () {


            // Remove active class
            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            // Add active class
            button.classList.add("active");


            // Get selected filter
            currentFilter = button.dataset.filter;


            // Display filtered tasks
            displayTasks();

        }
    );

});


// ==========================================
// UPDATE COUNTERS
// ==========================================

function updateCounters() {


    const total = tasks.length;


    const completed = tasks.filter(
        function (task) {

            return task.completed === true;

        }
    ).length;


    const active = total - completed;


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;

}


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayTasks();