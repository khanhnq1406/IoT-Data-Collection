export const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "https://data-collection-system-backend.onrender.com/";

// export const apiUrl = "https://data-collection-system-backend.onrender.com";
export const LOCAL_STORAGE_TOKEN_NAME = "learnit-mern";
