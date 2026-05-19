let tableName="vaccines";


async function GetAllItems(req, res, next) {
    let values = [];
    let Query = `SELECT * FROM ${tableName}`;
    Query += " ORDER BY vaccine_id DESC";

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
        data_by_id[row.vaccine_id] = row.animal_id;
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
    let type         = req.body.type       || "";
    let date_given     = req.body.date_given   || "";
    let next_due      = req.body.next_due    || "";
    let vet_id      = req.body.vet_id    || -1;
   

    res.ok=false;
    res.err="";

    if(animal_id === -1 || type === "" || date_given === ""|| next_due === "" ||vet_id === -1 ){
        res.err="wrong parameters";
        return next();
    }

    const Query = `INSERT INTO ${tableName} (animal_id,type,date_given,next_due,vet_id) VALUES (?,?,?,?,?)`;
    let values = [animal_id,type,date_given,next_due,vet_id];
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
    let vaccine_id      = req.body.vaccine_id    || -1;
    
    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE vaccine_id=? ` ;
    let values = [vaccine_id];

    res.ok=false;
    if(vaccine_id<0){
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
    let vaccine_id       = req.params.vaccine_id   || -1;
    let animal_id      = req.body.animal_id    || -1;
    let type         = req.body.type       || "";
    let date_given     = req.body.date_given   || "";
    let next_due      = req.body.next_due    || "";
    let vet_id      = req.body.vet_id    || -1;
   

    let Query = `UPDATE ${tableName} SET `;
    Query += `animal_id      = ?,   `;
    Query += `type         = ?,   `;
    Query += `date_given     = ?,   `;
    Query += `next_due     = ?,   `;
    Query += `vet_id      = ?     `;
    Query += ` WHERE vaccine_id=?    ` ;

    let values = [animal_id,type,date_given,next_due,vet_id,vaccine_id];

    res.ok=false;
    res.err="";
    if(vaccine_id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    if(animal_id === -1 || vet_id === -1 || type === "" || date_given === ""|| next_due === "" ){
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
