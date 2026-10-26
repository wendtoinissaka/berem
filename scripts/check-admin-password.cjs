require("dotenv").config();
const bcrypt = require("bcryptjs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Mot de passe administrateur à vérifier : ", async (password) => {
  try {
    const hash = process.env.ADMIN_PASSWORD_HASH;

    if (!hash) {
      console.log("ADMIN_PASSWORD_HASH est absente.");
      rl.close();
      return;
    }

    const matches = await bcrypt.compare(password, hash);

    console.log("Le mot de passe correspond au hash :", matches);
  } catch (error) {
    console.error("Erreur pendant la vérification du hash.");
  } finally {
    rl.close();
  }
});
