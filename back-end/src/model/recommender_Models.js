// Hàm cosine similarity
function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function recommendContentBased(items, userHistory, topN = 5) {
    if (!userHistory.length) return [];

    // Tính trung bình feature vector của user
    const userFeatures = Array(items[0].features.length).fill(0);
    userHistory.forEach(pid => {
        const prod = items.find(p => p.id === pid);
        if (!prod) return;
        prod.features.forEach((v, i) => userFeatures[i] += v);
    });
    userFeatures.forEach((v, i) => userFeatures[i] /= userHistory.length);

    // Tính similarity với các item chưa mua
    const recommended = items
        .filter(i => !userHistory.includes(i.id))
        .map(i => ({ id: i.id, name: i.name, score: cosineSimilarity(userFeatures, i.features) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);

    return recommended;
}

module.exports = { cosineSimilarity, recommendContentBased };
