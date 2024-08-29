import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { totalPhoneBill } from './totalPhoneBill.js';  

const app = express();
const PORT = process.env.PORT || 1111;
app.use(express.static('public'))
app.use(express.json())
app.listen(PORT, () => console.log(`Server started ${PORT}`))

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();

// Endpoint to calculate total phone bill
app.post('/api/phonebill/', async (req, res) => {
    const { price_plan, actions } = req.body;

    const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

    if (!plan) {
        return res.status(404).json({ error: 'Price plan not found' });
    }

    try {
        const total = totalPhoneBill(actions, plan);
        res.json({ total });
    } catch (error) {
        res.status(400).json({ error: `Invalid action: ${error.message}` });
    }
});

// Endpoint to get all price plans
app.get('/api/price_plans/', async (req, res) => {
    const pricePlans = await db.all('SELECT * FROM price_plan');
    res.json(pricePlans);
});

// Endpoint to create a new price plan
app.post('/api/price_plan/create', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)', [name, call_cost, sms_cost]);
    res.status(201).json({ message: 'Price plan created successfully' });
});

// Endpoint to update a price plan
app.post('/api/price_plan/update', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?', [call_cost, sms_cost, name]);
    res.json({ message: 'Price plan updated successfully' });
});

// Endpoint to delete a price plan
app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    await db.run('DELETE FROM price_plan WHERE id = ?', [id]);
    res.json({ message: 'Price plan deleted successfully' });
});