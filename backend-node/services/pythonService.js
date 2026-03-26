const axios = require("axios");

const PYTHON_URL = "http://localhost:5000";

exports.decide = async (state) => {
    const res = await axios.post(`${PYTHON_URL}/decide`, state);
    return res.data;
};

exports.train = async (episodes) => {
    const res = await axios.post(`${PYTHON_URL}/train`, { episodes });
    return res.data;
};