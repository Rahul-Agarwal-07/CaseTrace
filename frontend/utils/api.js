import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor → attach session token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ unified key

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor → handle auth errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Session expired or unauthorized");

      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error);
  }
);

/* ===================== AUTH ===================== */

export const loginUser = async (userId, password) => {
  try {
    const res = await api.post("/auth/login", {
      userId,
      password,
    });

    // Store session token
    if (res.data?.sessionToken) {
      localStorage.setItem("token", res.data.sessionToken);
    }

    return res.data;
  } catch (err) {
    console.error("Login API error:", err);
    throw err;
  }
};

export const createAdmin = async (name, email, password) => {
  try {
    const res = await api.post("/auth/create-admin", {
      name,
      email,
      password,
    });

    return res.data;
  } catch (err) {
    console.error("Create Admin API error:", err);
    throw err;
  }
};

/* ===================== CASES ===================== */

export const addCase = async (caseData) => {
  try {
    const res = await api.post("/cases/create", caseData);
    return res.data;
  } catch (err) {
    console.error("Add case error:", err);
    throw err;
  }
};

/* ===================== EVIDENCE ===================== */

export const uploadEvidence = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/evidence/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Upload evidence error:", err);
    throw err;
  }
};


export const accessEvidence = async (index) => {
  try {
    const res = await api.get(`/evidence/access/${index}`);
    return res.data;
  } catch (err) {
    console.error("Access evidence error:", err);
    throw err;
  }
};


export const verifyEvidence = async (index) => {
  try {
    const res = await api.post("/evidence/verify", {
      index,
    });

    return res.data;
  } catch (err) {
    console.error("Verify evidence error:", err);
    throw err;
  }
};


export const getEvidenceCount = async () => {
  try {
    const res = await api.get("/evidence/count");
    return res.data; // { caseId, count }
  } catch (err) {
    console.error("Get evidence count error:", err);
    throw err;
  }
};

// Get audit trail
export const getAuditTrail = async () => {
  try {
    const res = await api.get("/evidence/audit");
    return res.data; // array of logs
  } catch (err) {
    console.error("Get audit trail error:", err);
    throw err;
  }
};


export default api;
