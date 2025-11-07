import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import configDefault from "../config/config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configDefault[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    dialectOptions: config.dialectOptions || {},
  }
);

const db = {};

// Read all model files and import them
const modelsPath = __dirname;

// Get all model files
const modelFiles = fs.readdirSync(modelsPath).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
  );
});

// Import all models dynamically
for (const file of modelFiles) {
  const modelPath = path.join(modelsPath, file);
  const modelUrl = pathToFileURL(modelPath).href;
  const modelModule = await import(modelUrl);
  const modelFunction = modelModule.default || modelModule;
  const model = modelFunction(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Run associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
