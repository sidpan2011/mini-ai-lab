import dotenv from "dotenv";

// IMPORTANT: Load environment variables BEFORE any other imports
dotenv.config();

import { createApp } from "./app";

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
