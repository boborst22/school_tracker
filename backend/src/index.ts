import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3275;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCHOOL_DATA_FILE = path.join(DATA_DIR, 'schoolData.json');

// Pomocné funkce pro čtení a zápis dat
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

const writeUsers = (data: any) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
};

const readSchoolData = () => {
    try {
        const data = fs.readFileSync(SCHOOL_DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { subjects: [], exams: [] };
    }
};

const writeSchoolData = (data: any) => {
    fs.writeFileSync(SCHOOL_DATA_FILE, JSON.stringify(data, null, 2));
};

// Middleware pro ověření JWT tokenu
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Přístup odepřen: chybí token' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Neplatný token' });
        req.user = user;
        next();
    });
};

// Login API endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find((u: any) => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Neplatné jméno nebo heslo' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
        return res.status(401).json({ message: 'Neplatné jméno nebo heslo' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token
    });
});

// Registrace API endpoint
app.post('/api/auth/register', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Vyplňte všechna pole' });
    }

    const users = readUsers();
    
    if (users.find((u: any) => u.username === username)) {
        return res.status(409).json({ message: 'Uživatelské jméno již existuje' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now(),
        username,
        firstName,
        lastName,
        passwordHash
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        token
    });
});

// Získání dat pro chráněné stránky
app.get('/api/data', authenticateToken, (req, res) => {
    const data = readSchoolData();
    res.json(data);
});

// Uložení dat
app.post('/api/data', authenticateToken, (req, res) => {
    const { subjects, exams } = req.body;
    if (!subjects || !exams) {
        return res.status(400).json({ message: 'Chybí data ke zpracování' });
    }
    writeSchoolData({ subjects, exams });
    res.json({ success: true, message: 'Data byla úspěšně uložena' });
});

app.listen(PORT,"127.0.0.1", () => {
    console.log(`Server běží na portu ${PORT}`);
});
