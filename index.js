import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import axios from 'axios';

// const bcrypt = require('bcrypt');
// const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());

// connexion to my phpmyadmin and server side 
const db = mysql.createConnection({
    host: "localhost",          
    user: "root",               
    password: "@2003",               
    database: "crud",           
    port: 3306,                  
    dateStrings: "date"
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});


// show data for all congee do them the admin inserted on dashboard table
app.get('/', (req, res) => {
    const sql = "SELECT * FROM conge_form ";
   


    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error thes info canot get:", err);
            return res.json({ error: "An error employee Not add" });
        }
        return res.json(data);
    });
});


// admin create new data for congee 
app.post('/create', (req, res) => {
    const sql = "INSERT INTO conge_form (ppr,nom,prenom,grade,type_conge,date_de_conge,date_de_fin,statu,service) VALUES (?) ";
    const values =[
        req.body.ppr,
        req.body.nom,
        req.body.prenom,
        req.body.grade,
        req.body.type_conge,
        req.body.date_de_conge,
        req.body.date_de_fin,
        req.body.statu,
        req.body.service
        
    ]


    db.query(sql,[values], (err, data) => {
        if (err) {
            console.error("Error adding employee:", err);
            return res.json({ error: "An error occurred while adding the employee" });
        }
        return res.json(data);
    });
});


// signup for employee to register and create account to show his data
app.post('/signup', async(req, res) => {
try{
    const hashedPassword = await bcrypt.hash(req.body.passwordR, 10);
    const sql = "INSERT INTO employes_dms (emailR,usernameR,passwordR) VALUES (?) ";
    const values =[
        req.body.emailR,
        req.body.usernameR,
        hashedPassword
        
             
    ]

    db.query(sql,[values], (err, data) => {
        if (err) {
            console.error("Error adding employee:", err);
            return res.json({ error: "An error occurred while adding the employee" });
        }
        return res.json(data);
    });

}catch(error){
    return res.status(500).json({ error: "Error hashing password" });

}
});

// Login for employee to authenticate and show his data
app.post('/login', (req, res) => {
    const { emailR, passwordR } = req.body;
    const sql = "SELECT * FROM employes_dms WHERE emailR = ?";

    db.query(sql, [emailR], async (err, results) => {
        if (err) {
            console.error("Error finding employee:", err);
            return res.status(500).json({ error: "An error occurred while finding the employee" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "User not registered" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(passwordR, user.passwordR);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        return res.json({ message: "Login successful", user });
    });
});

// route for all congee on table conge_form count [SELECT COUNT(ID) FROM conge_form ] to stock number on variable

app.get('/count-conge-form', (req, res) => {
    const sql = "SELECT COUNT(ppr) AS count FROM conge_form";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error counting rows:", err);
            return res.status(500).json({ error: "An error occurred while counting the rows" });
        }

        const count = results[0].count;
        return res.json({ count });
    });
});

// route for all user created account

app.get('/count-register-form', (req, res) => {
    const sql = "SELECT COUNT(ID) AS count FROM employes_dms";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error counting rows:", err);
            return res.status(500).json({ error: "An error occurred while counting the rows" });
        }

        const count = results[0].count;
        return res.json({ count });
    });
});





app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

















// delete employe bu his ppr the primary key on data base 
app.delete('/delete/:ppr', (req, res) => {
    const ppr = req.params.ppr;
    const sql = "DELETE FROM conge_form WHERE ppr = ?";

    db.query(sql, [ppr], (err, result) => {
        if (err) {
            console.error("Error deleting employee:", err);
            return res.status(500).json({ error: "An error occurred while deleting the employee" });
        }
        return res.json({ message: "Employee deleted successfully" });
    });
});





// upadte info data after i get the data 
app.put('/update/:ppr', (req, res) => {
    const ppr = req.params.ppr;
    const { nom, prenom, grade, type_conge, date_de_conge, statu, service } = req.body;
    const sql = "UPDATE conge_form SET nom = ?, prenom = ?, grade = ?, type_conge = ?, date_de_conge = ?, statu = ?, service = ? WHERE ppr = ?";

    db.query(sql, [nom, prenom, grade, type_conge, date_de_conge, statu, service, ppr], (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ error: "An error occurred while updating the employee" });
        }
        return res.json({ message: "Employee updated successfully" });
    });
});






// get info of employe for update 

app.get('/getrecord/:ppr', (req, res) => {
    const ppr = req.params.ppr;
    const sql = "SELECT * FROM conge_form WHERE ppr = ?";
    
    db.query(sql, [ppr], (err, data) => {
        if (err) {
            console.error("Error fetching record:", err);
            return res.status(500).json({ error: "An error occurred while fetching record" });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "No record found for the provided PPR" });
        }
        
        const recordArray = Array.from(data);
        return res.json(recordArray);
    });
});



// check if server running clearly 
app.listen(3030, () => {
    console.log("Server is running on port 3030 || ");
});


