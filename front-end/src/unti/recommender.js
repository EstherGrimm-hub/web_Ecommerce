import instance from "./axios.cusomize";   // <-- SỬA ĐÚNG CHỮ customize

const recommenderApi = async (userId) => {
  try {
    const URL = `/api/user/${userId}`;
    // Note: axios instance response interceptor returns response.data directly
    const data = await instance.get(URL);

    // API may return either an array, or an object like { recommended: [...] }
    if (data && Array.isArray(data.recommended)) {
      return data.recommended;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error("Error calling recommender API:", error);
    return [];
  }
};

export { recommenderApi };
