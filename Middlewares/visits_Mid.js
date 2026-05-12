let tableName="visits";


async function GetAllItems(req, res, next) {
    let values = [];
    let Query = `SELECT * FROM ${tableName}`;
    Query += " ORDER BY visit_id DESC";

    res.ok = false;
    res.err = "";

    let rows = await GenObj_Mid.QueryExecSimpleReply(Query, values);

    if (rows === false) {
        res.err = "חלה תקלה, נא לנסות שנית";
        return res.status(500).json({
            status: "ERROR",
            Query: Query,
            err: res.err,
            values: values
        });
    }

    let data_by_id = [];
    for (let row of rows) {
        data_by_id[row.visit_id] = row.animal_id;
    }

    res.ok = true;
    req.ItemsData = {
        list: rows,
        data_by_id: data_by_id
    };

    next();
}


async function AddItem(req,res,next){
    let animal_id      = req.body.animal_id    || -1;
    let vet_id         = req.body.vet_id       || -1;
    let visit_date     = req.body.visit_date   || "";
    let diagnosis      = req.body.diagnosis    || "";
    let treatment      = req.body.treatment    || "";
    let vet_notes      = req.body.vet_notes    || "";

    res.ok=false;
    res.err="";

    if(animal_id === -1 || vet_id === -1 || visit_date === "" || diagnosis === ""|| treatment === "" ||vet_notes === "" ){
        res.err="wrong parameters";
        return next();
    }

    const Query = `INSERT INTO ${tableName} (animal_id,vet_id,visit_date,diagnosis,treatment,vet_notes) VALUES (?,?,?,?,?,?)`;
    let values = [animal_id,vet_id,visit_date,diagnosis,treatment,vet_notes];
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);

    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;
    res.insertId = rows.insertId;

    next();
}

async function DeleteItem(req,res,next){
    let visit_id      = req.body.visit_id    || -1;
    
    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE visit_id=? ` ;
    let values = [visit_id];

    res.ok=false;
    if(visit_id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;

    next();
}


async function UpdateItem(req,res,next){
    let visit_id       = req.params.visit_id   || -1;
    let animal_id      = req.body.animal_id    || -1;
    let vet_id         = req.body.vet_id       || -1;
    let visit_date     = req.body.visit_date   || "";
    let diagnosis      = req.body.diagnosis    || "";
    let treatment      = req.body.treatment    || "";
    let vet_notes      = req.body.vet_notes    || "";

    let Query = `UPDATE ${tableName} SET `;
    Query += `animal_id      = ?,   `;
    Query += `vet_id         = ?,   `;
    Query += `visit_date     = ?,   `;
    Query += `diagnosis     = ?,   `;
    Query += `treatment      = ?,    `;
    Query += `vet_notes     = ?   `;
    Query += ` WHERE visit_id=?    ` ;

    let values = [animal_id,vet_id,visit_date,diagnosis,treatment,vet_notes,visit_id];

    res.ok=false;
    res.err="";
    if(visit_id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    if(animal_id === -1 || vet_id === -1 || visit_date === "" || diagnosis === ""|| treatment === "" ||vet_notes === "" ){
        res.err="wrong parameters";
        return next();
    }
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;

    next();
}


module.exports={
    GetAllItems,
    AddItem,
    DeleteItem,
    UpdateItem,
}