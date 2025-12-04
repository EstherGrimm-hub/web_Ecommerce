import instance from "./axios.cusomize";

const elasticSearchApi = (keyword) => {
    const URL = `/api/search?keyword=${encodeURIComponent(keyword)}`;
    return instance.get(URL);
}

export { elasticSearchApi };