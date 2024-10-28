const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware para permitir CORS
app.use(cors());  // Isso habilita o CORS para todas as rotas

app.use(bodyParser.json());

// Importação das rotas
const historicoManutencaoRoutes = require('./routes/historicoManutencao'); 
const novoChamadoRoutes = require('./routes/novoChamado');
const relatarProblemaRoutes = require('./routes/relatarProblema');
const cadastroTecnicoRoutes = require('./routes/cadastroTecnico');
const cadastroManutencaoRoutes = require('./routes/cadastroManutencao');

// Usar as rotas
app.use('/api/historicoManutencao', historicoManutencaoRoutes); 
app.use('/api/novoChamado', novoChamadoRoutes);
app.use('/api/relatarProblema', relatarProblemaRoutes);
app.use('/api/cadastroTecnico', cadastroTecnicoRoutes);
app.use('/api/cadastroManutencao', cadastroManutencaoRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
