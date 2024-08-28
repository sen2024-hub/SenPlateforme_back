const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware')
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
require('dotenv').config(); // Chargement des variables d'environnement
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


// Connexion à la base de données
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '@ch1dA',
  database: 'projet1',
  port: 5432
});

// Fonction pour obtenir la connexion à la base de données
const getDbConnection = () => pool;

// Middleware pour gérer les erreurs
const handleError = (error, res) => {
  console.error('Erreur :', error);
  res.status(500).json({ message: 'Erreur interne du serveur' });
};

// Route d'enregistrement (signup)
app.post('/signup', async (req, res) => {
  const { nom, prenom,date_de_naissance,lieu_de_naissance,email,numero, password } = req.body;
  const id = uuidv4();
  const saltRounds = 10;
  const create_at = new Date();
  const update_at = new Date();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO utilisateur (id, nom, prenom, date_de_naissance, lieu_de_naissance, email, numero, password, create_at, update_at) VALUES ($1, $2, $3,$4, $5, $6,$7, $8, $9, $10) RETURNING id';
  const values = [id, nom,prenom,date_de_naissance,lieu_de_naissance, email,numero, hashedPassword,create_at,update_at];
  try {
    const dbConnection = getDbConnection();
    const { rows } = await dbConnection.query(query, values);
    const createdUserId = rows[0].id;
    
    res.status(201).json({ message: 'Utilisateur créé avec succès',  createdUserId });
  } catch (error) {
    handleError(error, res);
  }
  
});
//inscription de l'administrateur

app.post('/admin', async (req, res) => {
  const { nom, prenom,email,numero, password } = req.body;
  const id = uuidv4();
  const saltRounds = 8;
  const create_at = new Date();
  const update_at = new Date();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO administrateur (id, nom, prenom, email, numero, mot_de_passe, create_at, update_at) VALUES ($1, $2, $3,$4, $5, $6,$7, $8) RETURNING id';
  const values = [id, nom,prenom, email,numero, hashedPassword,create_at,update_at];
  try {
    const dbConnection = getDbConnection();
    const { rows } = await dbConnection.query(query, values);
    const createdUserId = rows[0].id;
    
    res.status(201).json({ message: 'Administrateur  créé avec succès',  createdUserId });
  } catch (error) {
    handleError(error, res);
  }
  
});
//connexion de l'administrateur
app.post('/login_admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT id, mot_de_passe FROM administrateur WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 1) {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.json({ token, userId: user.id });
      } else {
        res.status(401).json({ message: 'Mot de passe incorrect' });
      }
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    handleError(error, res);
  }
});
//afficher toute les formations
app.get('/formations', async (req, res) => {
  try {
    const query = 'SELECT nom, description, capacite, create_at, update_at FROM formations';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
//envoie des commentaires
app.post('/comment', async (req, res) => {
  const { nom, prenom,email,objet, message} = req.body;
  const id = uuidv4();
  const saltRounds = 8;
  const create_at = new Date();
  const update_at = new Date();
  // const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO commentaire (id, nom, prenom,email, objet, message, create_at, update_at) VALUES ($1, $2, $3,$4, $5, $6,$7, $8) RETURNING id';
  const values = [id, nom,prenom,email,objet,message,create_at,update_at];
  try {
    const dbConnection = getDbConnection();
    const { rows } = await dbConnection.query(query, values);
    const createdUserId = rows[0].id;
    
    res.status(201).json({ message: 'message envoyé avec succès', id});
  } catch (error) {
    handleError(error, res);
  }
  
});

app.get('/classe', async (req, res) => {
  try {
      const query = 'SELECT * FROM classe';
      const result = await pool.query(query);
      const type_fs = result.rows;
      res.status(200).json(type_fs);
  } catch (error) {
      console.error('Erreur lors de la récupération des type  :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
//ajouter un etudiant
app.post('/addnew', async (req, res) => {
  const { nom, prenom,date_de_naissance,lieu_de_naissance,email,numero, password } = req.body;
  const id = uuidv4();
  const saltRounds = 10;
  const create_at = new Date();
  const update_at = new Date();
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO utilisateur (id, nom, prenom, date_de_naissance, lieu_de_naissance, email, numero, password, create_at, update_at) VALUES ($1, $2, $3,$4, $5, $6,$7, $8, $9, $10) RETURNING id';
  const values = [id, nom,prenom,date_de_naissance,lieu_de_naissance, email,numero, hashedPassword,create_at,update_at];
  try {
    const dbConnection = getDbConnection();
    const { rows } = await dbConnection.query(query, values);
    const createdUserId = rows[0].id;
    
    res.status(201).json({ message: 'Utilisateur créé avec succès',  createdUserId });
  } catch (error) {
    handleError(error, res);
  }
  
});
//afficher tous les utilisateurs
app.get('/user', async (req, res) => {
  try {
      const query = 'SELECT nom,prenom,email,date_de_naissance,lieu_de_naissance,numero,create_at,update_at FROM utilisateur';
      const result = await pool.query(query);
      const type_fs = result.rows;
      res.status(200).json(type_fs);
  } catch (error) {
      console.error('Erreur lors de la récupération des type  :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


//recuperation des donnees d'un utilisateur a partir de son email


app.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const query = {
      text: 'SELECT * FROM utilisateur WHERE email = $1', // Requête modifiée
      values: [email],
    };
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Renvoyer toutes les données de l'utilisateur
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
//recuperation et envoie des modifications dans la bd
app.patch('/users/:email', async (req, res) => {
  try {
    const userId = req.params.email;
    const { nom, prenom, email, date_de_naissance, lieu_de_naissance, numero } = req.body;
    const query = 'UPDATE utilisateur SET nom = $1, prenom = $2,email = $3, date_de_naissance = $4, lieu_de_naissance = $5, numero = $6 WHERE email = $7 RETURNING *';
    const values = [nom, prenom,email, date_de_naissance, lieu_de_naissance, numero, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'L/utilisateur n/est pas trouvé' });
    }

    res.status(200).json({ message: 'Modification reussi', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur' });
  }
});
//suppression des utilisateurs dans la bd
// Endpoint pour supprimer un utilisateur
app.delete('/users/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Début de la transaction
    const client = await pool.connect();
    await client.query('BEGIN');

    // Suppression de l'utilisateur
    const result = await client.query(
      'DELETE FROM utilisateur WHERE email = $1 RETURNING *',
      [userEmail]
    );

    if (result.rowCount === 0) {
      // Aucun utilisateur trouvé
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const deletedUser = result.rows[0];

    // Validation de la transaction
    await client.query('COMMIT');

    // Libération de la connexion
    client.release();

    // Réponse avec l'utilisateur supprimé
    res.json({ message: 'Utilisateur supprimé'});
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

//inscription aux formations
app.post('/formation', async (req, res) => {
   const { id_utilisateur, id_classe } = req.body;

  const id = uuidv4(); // Générer un nouvel ID unique
  const update_at = new Date();
  const create_at = new Date();

  const query = 'INSERT INTO inscription (id,id_utilisateur,id_classe, create_at, update_at) VALUES ($1, $2, $3, $4, $5)';
  const values = [id,id_utilisateur,id_classe, create_at, update_at];

  try {
      await pool.query(query, values);
      res.status(201).json({ message: 'inscription reussie' });
  } catch (error) {
      console.error('Erreur lors de l\ inscription :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
// Route de connexion (login)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM utilisateur WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 1) {
      const user = rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id }, '77181753');
        const userId = user.id;
        console.log(userId);
        

        res.json({ token , userId});
      } else {
        res.status(401).json({ message: 'Mot de passe incorrect' });
      }
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    handleError(error, res);
  }
});
//creation des formations
app.post('/creer_formation', async (req, res) => {
  const { nom,description,capacite } = req.body;
  const id = uuidv4();
  const saltRounds = 6;
  const create_at = new Date();
  const update_at = new Date();
  // const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = 'INSERT INTO formations (id, nom,description,capacite ,create_at, update_at) VALUES ($1, $2, $3,$4, $5, $6) RETURNING id';
  const values = [id, nom,description,capacite,create_at,update_at];
  try {
    const dbConnection = getDbConnection();
    const { rows } = await dbConnection.query(query, values);
    const createdUserId = rows[0].id;
    
    res.status(201).json({ message: 'classe  créé avec succès',  createdUserId });
  } catch (error) {
    handleError(error, res);
  }
  
});
// Route de commentaire (comment)
app.post('/comment', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  const id = uuidv4();
  const created_at = new Date();

  try {
    const query = 'INSERT INTO comments (id, content, user_id, created_at) VALUES ($1, $2, $3, $4)'

    const values = [id, content, userId, created_at];

    const dbConnection = getDbConnection();
    await dbConnection.query(query, values);

    res.status(201).json({ message: 'Commentaire créé avec succès', id, content });
  } catch (error) {
    handleError(error, res);
  }
});
// Route protégée
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Route protégée accessible avec succès', user: req.user });
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
//envoie des commentaires
