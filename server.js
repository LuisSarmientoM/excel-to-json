var express = require('express');
var app = express();
var xlsx = require('xlsx');
const fs = require('fs');
// configuration
app.use(express.static(__dirname + '/public'));

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.post('/api/xlstojson', async function (req, res) {
 const workbook = xlsx.readFile('excel-to-json.xlsx', { type: 'binary' });
 const first_sheet_name = workbook.SheetNames[0];
 const worksheet = workbook.Sheets[first_sheet_name];
 const json = xlsx.utils.sheet_to_json(worksheet, { raw: true });

 //  console.log(JSON.stringify(json));
 fs.writeFileSync('output.json', JSON.stringify(json));
});

app.get('', () => {
 const file = JSON.parse(fs.readFileSync('./output.json'));

 var newFile = [];
 file.map((product) => {
  newFile.push({
   name: product['DETALLE'],
   shortName: String(product['DETALLE']).substring(0, 27),
   acquisitionPrice: product['PRECIO COMPRA '],
   salePrice: product['PRECIO COMPRA '],
   quantity: product['total'],
   tax: 0,
   subtotalInventory: product['TOTAL'],
  });
 });

 fs.writeFileSync('new output.json', JSON.stringify(newFile));
});
app.listen(4000);
