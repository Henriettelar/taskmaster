const task = document.getElementById("task");
const button = document.getElementById("button");
const tasklist = document.getElementById("tasklist");
const taskform = document.getElementById("taskform");

async function loadTasks(){
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            throw new Error('Kunne ikke indlæse opgaver');
        }

        const tasks = await response.json();

        tasklist.replaceChildren();

        tasks.forEach(task => {
            const li = document.createElement("li");
            const text = document.createElement("span");
            const status = document.createElement("span");
            const deleteButton = document.createElement("button");

            text.textContent = task.text;
            status.textContent = task.status;
            deleteButton.textContent = 'Slet opgave';

            status.classList.add(task.status.toLowerCase());

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            li.append(text, status, deleteButton);
            tasklist.appendChild(li);
        });

        //Mere til backend for at se at det skal virke
        console.log(tasks);
    } catch (error){
        console.log(error);
    }
}

async function addTask(taskText){
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text : taskText})
        });

        if (!response.ok) {
            throw new Error('Kunne ikke oprette opgave');
        }

        task.value = "";
        await loadTasks();

    } catch (error){
        console.log(error);
    }
}

async function deleteTask(id){
    try {
        const response = await fetch(`/api/tasks/${id}`,
            {method: 'DELETE'}
        );

        if (!response.ok) {
            throw new Error('Kunne ikke slette opgave');
        }

        await loadTasks();


    } catch (error){
        console.log(error);
    }
}

taskform.addEventListener("submit", (event) =>{
    event.preventDefault();

    const taskText = task.value.trim();

    if (!taskText) {
        return;
    }

    addTask(taskText);
});


loadTasks();