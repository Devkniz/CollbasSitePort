const { Sequelize } = require ('sequelize');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Logs SQL désactivés pour visibilité
    dialectOptions: {
        ssl: {
          require: true, // Supabase nécessite SSL pour les connexions distantes
          rejectUnauthorized: false, // Option pour éviter certains problèmes de certificats
        },
      },
    });

sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;