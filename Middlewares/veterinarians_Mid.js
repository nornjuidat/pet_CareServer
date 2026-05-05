
let tableName="veterinarians";



async function GetAllItems(req, res, next) {
    let values = [];
    let Query = `SELECT * FROM ${tableName}`;
    Query += " ORDER BY vet_id DESC";

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
        data_by_id[row.vet_id] = row.full_name;
    }

    res.ok = true;
    req.ItemsData = {
        list: rows,
        data_by_id: data_by_id
    };

    next();
}


async function AddItem(req,res,next){
    let full_name          = req.body.full_name       || "";
    let license_number     = req.body.license_number  || "";
    let phone              = req.body.phone        || "";
    let email              = req.body.email           || "";


    res.ok=false;
    res.err="";

    if(full_name === "" || license_number === "" || phone === ""  || email === ""   ){
        res.err="wrong parameters";
        return next();
    }


    const Query =  `INSERT INTO ${tableName} (full_name,license_number,phone,email) VALUES (?,?,?,?)`;
    let values = [full_name,license_number,phone,email];
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
    let vet_id      = req.body.vet_id  || -1 ;
    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE vet_id=? ` ;
    let values = [vet_id];

    res.ok=false;
    if(vet_id<0){
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
    let vet_id = req.params.vet_id || -1;
    let full_name = req.body.full_name || "";
    let license_number = req.body.license_number || "";
    let phone = req.body.phone || "";
    let email = req.body.email || "";

    res.ok = false;
    res.err = "";

    if(vet_id < 0){
        return res.status(500).json({status:"ERROR", message:"id is not valid"});
    }

    if(full_name === "" || license_number === ""|| phone === ""|| email === "" ){
        res.err = "wrong parameters";
        return next();
    }

   

    let Query = `UPDATE ${tableName} SET `;
    Query += `full_name = ?, `;
    Query += `license_number = ?, `;
    Query += `phone = ?, `;
    Query += `email = ? `;
    Query += `WHERE vet_id = ?`;

    let values = [full_name, license_number, phone, email, vet_id];

    let rows = await GenObj_Mid.QueryExecSimpleReply(Query, values);

    if(rows === false){
        res.err = "חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR", Query, err:res.err, values});
    }

    res.ok = true;
    next();
}



module.exports = {
    GetAllItems,
    AddItem,
    DeleteItem,
    UpdateItem
};