const express = require('express');
const app = express();
const PORT = 3000;

const crypto = require('crypto');

const fs = require('fs-extra');
const path = require('path');

const taskPath = path.join(__dirname, './data/tasks.json');

const status = require('./data/status.js');


async function readTask(){
    return await fs.readJson(taskPath);
}

async function createTask(task){
    await fs.writeJson(taskPath, task);
}

app.use(express.json());


app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await readTask();
        res.json(tasks);
    } catch (error) {
        res.status(404).send('Opgaver kunne ikke indlæses');
        console.error(error);
    }
});

app.post('/api/tasks', (req, res) => {
    //Får input fra bruger
    const newTask = {
        id: crypto.randomUUID(),
        text: req.body.text,
        status: status.BACKLOG
    };

    if (newTask.text === '') {
        res.status(400).send('Indskriv venligst en opgave');
    }

    try {
        createTask(newTask);
    } catch (error){
        res.status(500).send('Kunne ikke oprette opgave');
        console.log(error);
    }

    res.status(201).json({
        message: 'Opgave oprettet',
        task: newTask
    });
});

app.delete('/api/tasks/:id', (req, res) => {

});


app.listen(PORT, () => {
    console.log(`Taskmaster kører på http://localhost:${PORT}`);
});