// deleteAllDocuments.js - Supprime tous les objets de la classe "Document" dans Weaviate

import axios from 'axios';

const WEAVIATE_URL = 'http://localhost:8080';

async function deleteAllDocuments() {
  try {
    console.log('🔍 Récupération des objets de la classe Document...');

    // Étape 1 : Récupération des IDs
    const query = {
      query: `
        {
          Get {
            Document {
              _additional {
                id
              }
            }
          }
        }
      `
    };

    const response = await axios.post(`${WEAVIATE_URL}/v1/graphql`, query, {
      headers: { 'Content-Type': 'application/json' }
    });

    const documents = response.data?.data?.Get?.Document || [];
    if (documents.length === 0) {
      console.log("✅ Aucun objet à supprimer.");
      return;
    }

    // Étape 2 : Suppression un par un
    for (const doc of documents) {
      const id = doc._additional.id;
      await axios.delete(`${WEAVIATE_URL}/v1/objects/Document/${id}`);
      console.log(`🗑️ Supprimé : ${id}`);
    }

    console.log("✅ Tous les documents ont été supprimés.");
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err.response?.data || err.message);
  }
}

deleteAllDocuments();
