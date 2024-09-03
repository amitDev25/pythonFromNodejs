const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 4000;

let pythonProcess = null;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the /start-python endpoint
app.get('/start-python', (req, res) => {
    if (pythonProcess) {
        res.send('Python script is already running.');
        return;
    }

    pythonProcess = spawn('python', ['webcam.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        pythonProcess = null;
    });

    res.send('Python script started!!');
});

// Define the /stop-python endpoint
app.get('/stop-python', (req, res) => {
    if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
        res.send('Python script stopped.');
    } else {
        res.send('Python script is not running.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
