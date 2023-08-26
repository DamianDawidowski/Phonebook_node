const app = require("./app");

const { createFolderIsNotExist, uploadDir } = require("./service/fileUpload");
  
const PORT = 3000;

app.listen(PORT, async () => {
  createFolderIsNotExist(uploadDir); 
  console.log(
    `Server running. Use our API on http://localhost:${PORT}/api/contacts/`) 
});