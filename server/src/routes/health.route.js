import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(200).json({ status: "OK" , message: "Server API is running"});
})

export default router;