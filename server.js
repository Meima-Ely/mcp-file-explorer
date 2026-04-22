import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const server = new McpServer({
  name: "analyseur-fichier",
  version: "2.0.0"
});

// Dossiers autorisés — SÉCURITÉ !
const DOSSIERS_AUTORISES = [
  "C:\\Users\\hp\\Desktop\\Analyseur_Fichier",
  "C:\\Users\\hp\\Desktop"
];

// Fonction de sécurité
function verifierChemin(chemin) {
  const cheminAbsolu = path.resolve(chemin);
  const autorise = DOSSIERS_AUTORISES.some(dossier => 
    cheminAbsolu.startsWith(dossier)
  );
  if (!autorise) {
    throw new Error(`Accès refusé : ${chemin} n'est pas autorisé !`);
  }
  return cheminAbsolu;
}

// OUTIL 1 — Lire fichier avec sécurité + gestion erreurs
server.tool(
  "lire_fichier",
  "Lit le contenu d'un fichier .txt, .csv ou .md",
  {
    chemin: z.string().describe("Chemin complet du fichier à lire")
  },
  async ({ chemin }) => {
    try {
      const cheminSecurise = verifierChemin(chemin);
      const contenu = await fs.readFile(cheminSecurise, "utf-8");
      return { content: [{ type: "text", text: contenu }] };
    } catch (error) {
      return { 
        content: [{ 
          type: "text", 
          text: `ERREUR : ${error.message}` 
        }] 
      };
    }
  }
);

// OUTIL 2 — Écrire fichier (NOUVEAU !)
server.tool(
  "ecrire_fichier",
  "Écrit du contenu dans un fichier",
  {
    chemin: z.string().describe("Chemin du fichier à créer"),
    contenu: z.string().describe("Contenu à écrire dans le fichier")
  },
  async ({ chemin, contenu }) => {
    try {
      const cheminSecurise = verifierChemin(chemin);
      await fs.writeFile(cheminSecurise, contenu, "utf-8");
      return { 
        content: [{ 
          type: "text", 
          text: `Fichier créé avec succès : ${cheminSecurise}` 
        }] 
      };
    } catch (error) {
      return { 
        content: [{ 
          type: "text", 
          text: `ERREUR : ${error.message}` 
        }] 
      };
    }
  }
);

// OUTIL 3 — Lister fichiers (NOUVEAU !)
server.tool(
  "lister_fichiers",
  "Liste tous les fichiers dans un dossier",
  {
    dossier: z.string().describe("Chemin du dossier à explorer")
  },
  async ({ dossier }) => {
    try {
      const dossierSecurise = verifierChemin(dossier);
      const fichiers = await fs.readdir(dossierSecurise);
      const texte = fichiers.join("\n");
      return { content: [{ type: "text", text: texte }] };
    } catch (error) {
      return { 
        content: [{ 
          type: "text", 
          text: `ERREUR : ${error.message}` 
        }] 
      };
    }
  }
);

// OUTIL 4 — Chercher dans fichiers (NOUVEAU !)
server.tool(
  "chercher_dans_fichier",
  "Cherche un mot ou une phrase dans un fichier",
  {
    chemin: z.string().describe("Chemin du fichier"),
    mot: z.string().describe("Mot à chercher")
  },
  async ({ chemin, mot }) => {
    try {
      const cheminSecurise = verifierChemin(chemin);
      const contenu = await fs.readFile(cheminSecurise, "utf-8");
      const lignes = contenu.split("\n");
      const resultats = lignes
        .filter(ligne => ligne.toLowerCase().includes(mot.toLowerCase()))
        .map((ligne, i) => `Ligne ${i + 1}: ${ligne}`);
      
      if (resultats.length === 0) {
        return { content: [{ type: "text", text: `"${mot}" non trouvé !` }] };
      }
      return { content: [{ type: "text", text: resultats.join("\n") }] };
    } catch (error) {
      return { 
        content: [{ 
          type: "text", 
          text: `ERREUR : ${error.message}` 
        }] 
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);