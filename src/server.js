const express = require('express');
const app = express();
const PORT = 3000;

const crypto = require('crypto');

const fs = require('fs-extra');
const path = require('path');

const taskPath = path.join(__dirname, './data/tasks.json');


async function readTasks(){
    return await fs.readJson(taskPath);
}

async function createTask(task){
    const tasks = await readTasks();
    tasks.push(task);
    return await fs.writeJson(taskPath, tasks, { spaces: 2 });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await readTasks();
        res.json(tasks);
    } catch (error) {
        res.status(404).send('Opgaver kunne ikke indlæses');
        console.error(error);
    }
});

app.post('/api/tasks', async(req, res) => {
    //Får input fra bruger
    const newTask = {
        id: crypto.randomUUID(),
        text: req.body.text,
        status: false
    };

    if (newTask.text.trim() === '') {
        return res.status(400).send('Indskriv venligst en opgave');
    }

    try {
        await createTask(newTask);
    } catch (error){
        res.status(500).send('Kunne ikke oprette opgave');
        console.log(error);
    }

    res.status(201).json({
        message: 'Opgave oprettet',
        task: newTask
    });
});


app.patch('/api/tasks/:id', async(req, res) => {
    try {
        const tasks = await readTasks();
        const updatedTask = tasks.find(task => task.id === req.params.id);

        if (!updatedTask) {
            return res.status(404).send('Opgave ikke fundet');
        }

        updatedTask.status = !updatedTask.status;

        await fs.writeJson(taskPath, tasks, { spaces: 2 });
        res.json({
            message: 'Opgave status opdateret',
            task: updatedTask
        });

    } catch (error){
        res.status(500).send('Kunne ikke opdatere opgave');
        console.log(error);
    }
});



app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const tasks = await readTasks();
        const updatedTasks = tasks.filter(task => task.id !== req.params.id);

        if (updatedTasks.length === tasks.length) {
            return res.status(404).send('Opgave ikke fundet');
        }

        await fs.writeJson(taskPath, updatedTasks, { spaces: 2 });
        res.status(200).json({ message: 'Opgave slettet' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Kunne ikke slette opgave');
    }
});


app.listen(PORT, () => {
    console.log(`Taskmaster kører på http://localhost:${PORT}`);
});