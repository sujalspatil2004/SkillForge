import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/pathways' });

export const generatePathway = (technology) => API.post('/generate', { technology });
