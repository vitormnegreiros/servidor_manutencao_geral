require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const authenticateToken = require('../middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Função para verificar e definir rotas a partir do .env
function getRoute(routeEnvVar, defaultRoute) {
    return process.env[routeEnvVar] || defaultRoute;
}

// Importação das rotas
const historicoManutencaoRoutes = require('./routes/historicoManutencao'); 
const novoChamadoRoutes = require('./routes/novoChamado');
const relatarProblemaRoutes = require('./routes/relatarProblema');
const cadastroTecnicoRoutes = require('./routes/cadastroTecnico');
const cadastroManutencaoRoutes = require('./routes/cadastroManutencao');
const cadastrarusuarioRoutes = require('./routes/cadastrarusuario');
const loginRoutes = require('./routes/login');

// Usar as rotas com valores do .env ou rota padrão
app.use('/api/historicoManutencao', historicoManutencaoRoutes); 
app.use('/api/novoChamado', novoChamadoRoutes);
app.use('/api/relatarProblema', relatarProblemaRoutes);
app.use('/api/cadastroTecnico', cadastroTecnicoRoutes);
app.use('/api/cadastroManutencao', cadastroManutencaoRoutes);
app.use('/api/cadastrarusuario', cadastrarusuarioRoutes);
app.use('/api/login', loginRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
