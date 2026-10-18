const task = document.getElementById("task").innerHTML;
const button = document.getElementById("button");
const tasklist = document.getElementById("tasklist");

async function loadTasks(){
    try {
        const response = await fetch('api/tasks');
        const tasks = await response.json();
        tasklist.innerHTML = tasks;
        console.log(tasks);
    } catch (error){
        console.log(error);
    }
}

async function addTask(task){
    try {
        const response = await fetch('api/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    } catch (error){
        console.log(error);
    }
}

button.addEventListener("submit", (event) =>{
    fetch('api/tasks', {
        method: 'POST',
        body: JSON.stringify({task})
    }).catch(error => console.log(error));
} );