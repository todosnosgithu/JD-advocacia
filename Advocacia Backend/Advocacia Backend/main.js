const EntrarEmContactoTbl = require('./Connections/EntrarEm_Contacto.js');  const Candidaturas = require('./Connections/Candidatura.js'); 
const {adminRoute,publicRoute} = require("./Routes/galeriaRouter");         const tblAdvogados = require('./Connections/Advogados.js');    
const GaleriaTbl = require('./Connections/Galeria.js');                     const Servico = require('./Connections/Servico.js');
const tblUsers = require('./Connections/Users.js');                         const allRoutes = require('./Routes/allRoutes');
const Equipe = require('./Connections/Equipa.js');                          const db = require('./Connections/Database.js');
const { default: helmet} = require("helmet");                               const express = require("express");
const path = require('path');                                               const cors = require("cors");
const fs = require("fs");                                                   const Port = 3000;
const app = express();          


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({origin:"*", credentials:true}));

app.get("/equipa", (req, res) => {
  const pasta = path.join(__dirname, "uploads/equipa");

  fs.readdir(pasta, (err, arquivos) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler arquivos" });
    }

    res.json(arquivos);
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/galeria" , publicRoute)
app.use("/admin/galeria", adminRoute);

app.use(allRoutes)

async function createAllTables() {
    try {
        tblUsers.Init(db);
        tblAdvogados.Init(db);
        EntrarEmContactoTbl.Init(db);
        Servico.Init(db);
        Equipe.Init(db);
        Candidaturas.Init(db);
        GaleriaTbl.Init(db)

        console.log('Banco PostgreSQL inicializado');
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}
createAllTables();

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "uploads/400-bad-request.png"))
});

app.listen(Port , () => {
    console.log('Servidor rodando na porta '+Port);
});