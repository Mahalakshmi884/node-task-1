const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const folderPath = path.join(__dirname, 'files');

// Middleware to parse JSON
app.use(express.json());

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Endpoint to create a text file with current timestamp as content
app.post('/create-file', (req, res) => {
    const timestamp = new Date();
    const formattedDate = timestamp.toISOString().replace(/[:.]/g, '-');
    const fileName = `${formattedDate}.txt`;
    const filePath = path.join(folderPath, fileName);
    
    fs.writeFile(filePath, timestamp.toString(), (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).send('Error creating file');
        }
        res.status(201).send(`File created: ${fileName}`);
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }
        res.status(200).json(files);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
