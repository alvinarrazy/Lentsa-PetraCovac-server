const path = require('path');
const express = require('express');


//Contoh
 exports.test = function(req,res){
     console.log(__dirname);
    res.sendFile((path.join(__dirname + "/public/Picture2.png")));
 }