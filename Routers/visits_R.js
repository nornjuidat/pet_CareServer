const express = require('express');
const router = express.Router();
module.exports = router;

const visits_Mid = require("../Middlewares/visits_Mid");

router.get("/List", [visits_Mid.GetAllItems], (req, res) => {
    if(res.ok) {
        res.status(200).json(req.ItemsData);
    }
    else
        return res.status(500).json({message: res.err});
});


router.post("/Add", [visits_Mid.AddItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK", Last_Id:res.insertId});
    else
        return res.status(500).json({message: res.err});
});


router.delete("/Delete", [visits_Mid.DeleteItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK"});
    else
        return res.status(500).json({message: res.err});
});


router.put("/Update/:visit_id", [visits_Mid.UpdateItem], (req, res) => {
    if(res.ok)
        res.status(200).json({message:"OK"});
    else
        return res.status(500).json({message: res.err});
});

