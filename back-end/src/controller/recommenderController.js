const { getItemsWithFeatures, getUserHistory } = require("../service/recommenderService");
const { recommendContentBased } = require("../model/recommender_Models");

const recommendForUser =  async (userId) =>  {
    try {
        console.log("UserId:", userId);

        const items = await getItemsWithFeatures();
        console.log("Items from DB:", items.map(i => ({ id: i.id, name: i.name })));

        const history = await getUserHistory(userId);
        console.log("User history item IDs:", history);

        const recommended = recommendContentBased(items, history, 10);
        console.log("Recommended:", recommended);

        return recommended;
    } catch (err) {
        console.error("Error in recommendForUser:", err);
        return [];
    }
}

module.exports = { recommendForUser };
