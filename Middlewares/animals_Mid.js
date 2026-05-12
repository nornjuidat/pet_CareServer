let tableName="animals";


async function GetAllItems(req, res, next) {
    let values = [];
    let Query = `SELECT * FROM ${tableName}`;
    Query += " ORDER BY animal_id DESC";

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
        data_by_id[row.animal_id] = row.name;
    }

    res.ok = true;
    req.ItemsData = {
        list: rows,
        data_by_id: data_by_id
    };

    next();
}




async function AddItem(req,res,next)
{

     let  name       =      req.body.name  || "" ;
     let  species    =      req.body.species  || "" ;
     let  age        =      req.body.age  || -1 ;
     let  photo_url  =      req.body.photo_url  || "" ;
     let  owner_id   =      req.body.owner_id  || -1 ;
     let  vet_id     =      req.body.vet_id  || -1;


    res.ok=false;
    res.err="";


     if(name === "" || species === "" || age === -1 || photo_url === "" || owner_id === -1 || vet_id === -1 ){
        res.err="wrong parameters";
        return next();
    }

    
    const Query = `INSERT INTO ${tableName} (name,species,age,photo_url,owner_id,vet_id) VALUES (?,?,?,?,?,?)`;
    let values = [name,species,age,photo_url,owner_id,vet_id];
    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);

      if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;
    res.insertId = rows.insertId;

    next();

}


async function DeleteItem(req,res,next)
{

  let animal_id   =      req.body.animal_id     || -1;

    res.ok=false;

     if(animal_id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }

    let Query = `DELETE FROM ${tableName}  `;
    Query += ` WHERE animal_id=? ` ;
    let values = [animal_id];


    let rows= await GenObj_Mid.QueryExecSimpleReply(Query,values);
    if(rows === false){
        res.err="חלה תקלה, נא לנסות שנית";
        return res.status(500).json({status:"ERROR",Query: Query,err:res.err,values:values});
    }
    res.ok=true;

    next();


}

async function UpdateItem(req,res,next)
{

     let animal_id   =      req.params.animal_id     || -1;
     let  name       =      req.body.name  || "" ;
     let  species    =      req.body.species  || "" ;
     let  age        =      req.body.age  || -1 ;
     let  photo_url  =      req.body.photo_url  || "" ;
     let  owner_id   =      req.body.owner_id  || -1 ;
     let  vet_id     =      req.body.vet_id  || -1;


    res.ok=false;
    res.err="";

    if(animal_id<0){
        return res.status(500).json({status:"ERROR",message: "id is not valid"});
    }
    if(name === "" || species === "" || age === -1 || photo_url === "" || owner_id === -1 || vet_id === -1 ){
        res.err="wrong parameters";
        return next();
    }

     let Query = `UPDATE ${tableName} SET `;
    Query += `name       = ?,   `;
    Query += `species    = ?,   `;
    Query += `age        = ?,   `;
    Query += `photo_url     = ?,   `;
    Query += `owner_id      = ?,   `;
    Query += `vet_id        = ?   `;
    Query += `WHERE animal_id=?` ;

     let values = [name,species,age,photo_url,owner_id,vet_id,animal_id];

     
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