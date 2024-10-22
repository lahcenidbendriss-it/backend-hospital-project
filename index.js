import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "sql10.freemysqlhosting.net",  
    user: process.env.DB_USER || "sql10739927",                
    password: process.env.DB_PASSWORD || "vRi7qdKwIL",       
    database: process.env.DB_NAME || "sql10739927",            
    port: process.env.DB_PORT || 3306,                        
    dateStrings: "date"
});


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
app.post('/create', (req, res) => {
    const sql = "INSERT INTO conge_form (ppr,nom,prenom,grade,type_conge,date_de_conge,statu,service) VALUES (?) ";
    const values =[
        req.body.ppr,
        req.body.nom,
        req.body.prenom,
        req.body.grade,
        req.body.type_conge,
        req.body.date_de_conge,
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




app.listen(3030, () => {
    console.log("Server is running on port 3030 || ");
});


