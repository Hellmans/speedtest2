# 🚀 Teste de Velocidade - Speed Test

Um medidor de velocidade de internet moderno com visual neon, similar ao LibreSpeed.

![Preview](https://img.shields.io/badge/Status-Funcionando-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Funcionalidades

- ✅ Teste de **Download** (velocidade de download em Mbps)
- ✅ Teste de **Upload** (velocidade de upload em Mbps)
- ✅ Medição de **Latência/Ping** (em milissegundos)
- ✅ Medição de **Jitter** (em milissegundos)
- ✅ Interface moderna com tema neon azul
- ✅ Animações suaves
- ✅ 100% em Português

## 🛠️ Tecnologias Utilizadas

| Frontend | Backend |
|----------|---------|
| React 19 | Python 3.x |
| Tailwind CSS | FastAPI |
| Framer Motion | Uvicorn |

---

## 📦 Instalação Passo a Passo

### Pré-requisitos

1. **Node.js** (versão 18+) - [Baixar aqui](https://nodejs.org/)
2. **Python** (versão 3.8+) - [Baixar aqui](https://python.org/)

### Passo 1: Baixar o Projeto

```bash
git clone https://github.com/seu-usuario/teste-velocidade.git
cd teste-velocidade
```

### Passo 2: Instalar Dependências do Backend

```bash
cd backend
pip install fastapi uvicorn python-dotenv
```

### Passo 3: Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Como Executar

### Você precisa abrir 2 terminais!

---

### Terminal 1 - Backend (API)

```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

✅ Deve aparecer: `Uvicorn running on http://0.0.0.0:8001`

---

### Terminal 2 - Frontend (Interface)

```bash
cd frontend
npm start
```

✅ O navegador vai abrir automaticamente em: **http://localhost:3000**

---

## ⚠️ Problemas Comuns

### Erro: "Module not found"

```bash
cd frontend
rm -rf node_modules
npm install
```

### Erro: "CORS policy blocked"

O backend não está rodando. Inicie o backend primeiro (Terminal 1).

### Erro: "'python' não é reconhecido"

- Windows: Reinstale Python marcando "Add to PATH"
- Linux/Mac: Use `python3` ao invés de `python`

---

## 🔧 Configuração para Produção (XAMPP/NGINX)

### Passo 1: Criar Build do Frontend

```bash
cd frontend
npm run build
```

Isso cria uma pasta `build/` com os arquivos estáticos.

### Passo 2: Configurar URL do Backend

Antes do build, edite `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://SEU-IP-OU-DOMINIO:8001
```

### Para XAMPP:

1. Copie a pasta `build/` para `C:\xampp\htdocs\speedtest\`
2. Rode o backend separadamente
3. Acesse: `http://localhost/speedtest`

### Para NGINX:

1. Copie a pasta `build/` para `/var/www/html/speedtest/`
2. Configure proxy reverso para `/api/` apontar para porta 8001
3. Rode o backend como serviço

---

## 📁 Estrutura do Projeto

```
teste-velocidade/
├── backend/
│   ├── server.py          # API do servidor
│   ├── requirements.txt   # Dependências Python
│   └── .env              # Configurações
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   └── components/   # Componentes React
│   ├── package.json      # Dependências Node
│   └── .env              # URL do backend
│
└── README.md
```

---

## 📝 Resumo Rápido

```bash
# 1. Instalar backend
cd backend
pip install fastapi uvicorn python-dotenv

# 2. Instalar frontend  
cd ../frontend
npm install

# 3. Rodar backend (Terminal 1)
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001

# 4. Rodar frontend (Terminal 2)
cd frontend
npm start
```

---

## 📄 Licença

MIT License - Livre para usar e modificar.
