import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs/promises";

// 1. Création du serveur
const server = new McpServer({
  name: "analyseur-fichier",
  version: "1.0.0"
});

// 2. Outil pour lire un fichier
server.tool(
  "lire_fichier",
  "Lit le contenu d'un fichier sur l'ordinateur",
  { chemin: z.string().describe("Le chemin du fichier à lire") },
  async ({ chemin }) => {
    const contenu = await fs.readFile(chemin, "utf-8");
    return { content: [{ type: "text", text: contenu }] };
  }
);

// 3. Démarrage du serveur
const transport = new StdioServerTransport();
await server.connect(transport);