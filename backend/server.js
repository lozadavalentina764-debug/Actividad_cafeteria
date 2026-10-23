const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Conexión a XAMPP (MySQL Local)
const dbLocal = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cafeteria_local_db'
});

// 2. Conexión a Azure Database for MySQL (con SSL requerido)
const dbAzure = mysql.createPool({
    host: 'taller.mysql.database.azure.com', // Cambia por tu host real de Azure
    user: 'Emelly',
    password: 'Emelly123',
    database: 'cafeteria_azure',
    ssl: { rejectUnauthorized: false }
});

// 3. Conexión a Supabase (PostgreSQL)
const supabaseUrl = 'https://zwahwvnytravamqfnwhy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YWh3dm55dHJhdmFtcWZud2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2OTk2NDgsImV4cCI6MjEwODI3NTY0OH0.kY5j8GCZAl15IxBwvHngz6bL_sBZPhjwrc0gdAerLkk';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ENDPOINTS GET (Lectura) ---
app.get('/api/pos-local', (req, res) => {
    dbLocal.query('SELECT * FROM tbl_productos_local', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/ventas-local', (req, res) => {
    dbLocal.query('SELECT * FROM tbl_ventas_diarias', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/clientes-azure', (req, res) => {
    dbAzure.query('SELECT * FROM tbl_aprendices_clientes', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/empleados-azure', (req, res) => {
    dbAzure.query('SELECT * FROM tbl_empleados', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- ENDPOINTS SUPABASE CON DEPURACIÓN ---
app.get('/api/alertas-supabase', async (req, res) => {
    try {
        const { data, error } = await supabase.from('tbl_alertas_inventario').select('*');
        
        if (error) {
            console.error("❌ ERROR DIRECTO DE SUPABASE (Alertas):", error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log("✅ Datos obtenidos de tbl_alertas_inventario:", data);
        res.json(data || []);
    } catch (err) {
        console.error("❌ Excepción en servidor (Alertas):", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pqr-supabase', async (req, res) => {
    try {
        const { data, error } = await supabase.from('tbl_sugerencias_pqr').select('*');
        
        if (error) {
            console.error("❌ ERROR DIRECTO DE SUPABASE (PQR):", error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log("✅ Datos obtenidos de tbl_sugerencias_pqr:", data);
        res.json(data || []);
    } catch (err) {
        console.error("❌ Excepción en servidor (PQR):", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- ENDPOINTS POST (Inserciones) ---
app.post('/api/pos-local', (req, res) => {
    const { nombre_producto, stock_actual, precio } = req.body;
    const query = 'INSERT INTO tbl_productos_local (nombre_producto, stock_actual, precio) VALUES (?, ?, ?)';
    dbLocal.query(query, [nombre_producto, stock_actual, precio], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto agregado exitosamente', id: result.insertId });
    });
});

// NUEVO: POST para Azure (Agregar aprendices/clientes a la nube)
app.post('/api/clientes-azure', (req, res) => {
    const { nombres, documento, programa_formacion, saldo_tarjeta } = req.body;
    const query = 'INSERT INTO tbl_aprendices_clientes (nombres, documento, programa_formacion, saldo_tarjeta) VALUES (?, ?, ?, ?)';
    dbAzure.query(query, [nombres, documento, programa_formacion, saldo_tarjeta], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cliente registrado en Azure con éxito', id: result.insertId });
    });
});

app.post('/api/pqr-supabase', async (req, res) => {
    const { tipo, comentario } = req.body;
    const { data, error } = await supabase
        .from('tbl_sugerencias_pqr')
        .insert([{ tipo, comentario }]);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'PQR registrado exitosamente', data });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});