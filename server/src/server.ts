import dotenv from "dotenv";
import express from "express";

/* -------------------------------------------------------------------------- */
/*                                 Environment                                */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/*                              App Configuration                             */
/* -------------------------------------------------------------------------- */
const app = express();

/* -------------------------------------------------------------------------- */
/*                                     GET                                    */
/* -------------------------------------------------------------------------- */
/* ------------------------------- Hello Word ------------------------------- */
app.get("/", async (req, res) => {
    res.send({ message: "Hello Word!" });
});

/* -------------------------------------------------------------------------- */
/*                                   Listen                                   */
/* -------------------------------------------------------------------------- */
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT} ...`);
});
