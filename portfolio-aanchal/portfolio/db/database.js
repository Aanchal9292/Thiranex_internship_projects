const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'portfolio.db');

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      tech_stack TEXT,
      github_url TEXT,
      live_url TEXT,
      category TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 80
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed initial data if empty
  const projectCount = db.exec("SELECT COUNT(*) as count FROM projects")[0];
  if (projectCount.values[0][0] === 0) {
    seedData();
  }

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function seedData() {
  // Projects
  const projects = [
    {
      title: 'AI Health Companion',
      description: 'A full-stack web app featuring a FastAPI backend with a trained RandomForest ML model for symptom analysis, NLP-based symptom extraction, severity assessment, and medication reminder management.',
      tech_stack: 'Python,FastAPI,React,Vite,scikit-learn,NLP',
      github_url: 'https://github.com/Aanchal9292',
      live_url: '',
      category: 'Machine Learning',
      featured: 1
    },
    {
      title: 'Bank Management System',
      description: 'A comprehensive Bank Management System with secure database connections, transaction management, deposit/withdrawal operations, and account management using OOP principles.',
      tech_stack: 'Java,MySQL,JDBC,OOP',
      github_url: 'https://github.com/Aanchal9292',
      live_url: '',
      category: 'Backend',
      featured: 1
    },
    {
      title: 'Personal Portfolio Website',
      description: 'A full-stack portfolio website with Node.js/Express backend, SQLite database, and a clean animated frontend to showcase projects and skills.',
      tech_stack: 'HTML,CSS,JavaScript,Node.js,Express.js,SQLite',
      github_url: 'https://github.com/Aanchal9292',
      live_url: '',
      category: 'Full Stack',
      featured: 1
    }
  ];

  projects.forEach(p => {
    db.run(
      `INSERT INTO projects (title, description, tech_stack, github_url, live_url, category, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.title, p.description, p.tech_stack, p.github_url, p.live_url, p.category, p.featured]
    );
  });

  // Skills
  const skills = [
    { name: 'Java', category: 'Languages', proficiency: 85 },
    { name: 'JavaScript', category: 'Languages', proficiency: 80 },
    { name: 'Python', category: 'Languages', proficiency: 78 },
    { name: 'HTML', category: 'Web', proficiency: 90 },
    { name: 'CSS', category: 'Web', proficiency: 88 },
    { name: 'React.js', category: 'Frameworks', proficiency: 75 },
    { name: 'Node.js', category: 'Frameworks', proficiency: 72 },
    { name: 'Express.js', category: 'Frameworks', proficiency: 70 },
    { name: 'FastAPI', category: 'Frameworks', proficiency: 70 },
    { name: 'MySQL', category: 'Databases', proficiency: 80 },
    { name: 'SQLite', category: 'Databases', proficiency: 75 },
    { name: 'scikit-learn', category: 'ML/AI', proficiency: 72 },
    { name: 'Git', category: 'Tools', proficiency: 78 },
    { name: 'Azure', category: 'Tools', proficiency: 65 }
  ];

  skills.forEach(s => {
    db.run(
      `INSERT INTO skills (name, category, proficiency) VALUES (?, ?, ?)`,
      [s.name, s.category, s.proficiency]
    );
  });
}

module.exports = { getDb, saveDb };
