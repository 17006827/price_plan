import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = process.env.PORT || 4011;

app.use(express.static('public'));
app.use(express.json());

// Setup SQLite Database and Migrations
const setupDatabase = async () => {
    const db = await sqlite.open({
        filename: './data_plan.db',
        driver: sqlite3.Database
    });

    await db.migrate();

    // Define API Endpoints
    app.post('/api/phonebill', async (req, res) => {
        const { price_plan, actions } = req.body;

        const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

        if (!plan) {
            return res.status(404).json({ error: 'Price plan not found' });
        }

        const actionsArray = actions.split(', ');
        let total = 0;

        actionsArray.forEach(action => {
            if (action === 'sms') total += plan.sms_price;
            if (action === 'call') total += plan.call_price;
        });

        res.json({ total: total.toFixed(2) });
    });

    app.get('/api/price_plans', async (req, res) => {
        const plans = await db.all('SELECT * FROM price_plan');
        res.json(plans);
    });

    app.post('/api/price_plan/create', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)', [name, call_cost, sms_cost]);

        res.json({ message: 'Price plan created successfully' });
    });

    app.post('/api/price_plan/update', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        await db.run('UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?', [call_cost, sms_cost, name]);

        res.json({ message: 'Price plan updated successfully' });
    });

    app.post('/api/price_plan/delete', async (req, res) => {
        const { id } = req.body;

        await db.run('DELETE FROM price_plan WHERE id = ?', [id]);

        res.json({ message: 'Price plan deleted successfully' });
    });

    // Start Express Server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

// Initialize Database and Server
setupDatabase().catch(err => console.error(err));

// AlpineJS Widget Integration (in public/index.html)
