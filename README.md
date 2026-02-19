# 🚀 Teste de Velocidade - Speed Test

Um medidor de velocidade de internet moderno com visual neon, similar ao LibreSpeed.

![Preview](https://img.shields.io/badge/Status-Funcionando-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Funcionalidades

- ✅ Teste de **Download** (velocidade de download em Mbps)
- ✅ Teste de **Upload** (velocidade de upload em Mbps)
- ✅ Medição de **Latência/Ping** (em milissegundos)
- ✅ Medição de **Jitter/Variação** (em milissegundos)
- ✅ Interface moderna com tema neon azul
- ✅ Barras de progresso animadas
- ✅ 100% em Português

## 🛠️ Tecnologias Utilizadas

| Frontend | Backend |
|----------|---------|
| React 19 | Python 3.x |
| Tailwind CSS | FastAPI |
| Framer Motion | Uvicorn |

---

## 📦 Instalação

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **Python** (versão 3.8 ou superior) - [Download](https://python.org/)
- **Yarn** (gerenciador de pacotes) - Instale com: `npm install -g yarn`

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/teste-velocidade.git
cd teste-velocidade
```

### Passo 2: Instalar Dependências do Backend

```bash
cd backend
pip install -r requirements.txt
```

**Conteúdo do `requirements.txt`:**
```
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
```

### Passo 3: Instalar Dependências do Frontend

```bash
cd ../frontend
yarn install
```

---

## 🚀 Como Executar

### Opção 1: Desenvolvimento Local (Recomendado para testar)

**Terminal 1 - Iniciar o Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Iniciar o Frontend:**
```bash
cd frontend
yarn start
```

Acesse: **http://localhost:3000**

---

### Opção 2: Rodar no XAMPP

#### Passo 1: Preparar o Build do Frontend

```bash
cd frontend
yarn build
```

Isso criará uma pasta `build/` com os arquivos estáticos.

#### Passo 2: Copiar para o XAMPP

1. Copie todo o conteúdo da pasta `build/` para:
   - **Windows:** `C:\xampp\htdocs\speedtest\`
   - **Linux:** `/opt/lampp/htdocs/speedtest/`
   - **Mac:** `/Applications/XAMPP/htdocs/speedtest/`

#### Passo 3: Configurar o Backend

O backend precisa rodar separadamente. Crie um script para iniciar:

**Windows - `iniciar_backend.bat`:**
```batch
@echo off
cd /d "C:\caminho\para\backend"
python -m uvicorn server:app --host 0.0.0.0 --port 8001
pause
```

**Linux/Mac - `iniciar_backend.sh`:**
```bash
#!/bin/bash
cd /caminho/para/backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
```

#### Passo 4: Configurar URL do Backend

Antes de fazer o build, edite o arquivo `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### Passo 5: Acessar

1. Inicie o XAMPP (Apache)
2. Execute o script do backend
3. Acesse: **http://localhost/speedtest**

---

### Opção 3: Rodar no NGINX

#### Passo 1: Preparar o Build

```bash
cd frontend
yarn build
```

#### Passo 2: Copiar arquivos para o NGINX

```bash
sudo cp -r build/* /var/www/html/speedtest/
```

#### Passo 3: Configurar o NGINX

Edite o arquivo de configuração do NGINX:

```bash
sudo nano /etc/nginx/sites-available/speedtest
```

Cole esta configuração:

```nginx
server {
    listen 80;
    server_name localhost;  # ou seu domínio

    # Frontend (arquivos estáticos)
    location / {
        root /var/www/html/speedtest;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (proxy reverso)
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        
        # Importante para o teste de download
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

#### Passo 4: Ativar o site

```bash
sudo ln -s /etc/nginx/sites-available/speedtest /etc/nginx/sites-enabled/
sudo nginx -t  # Testar configuração
sudo systemctl reload nginx
```

#### Passo 5: Configurar Backend como Serviço (Opcional)

Crie um serviço systemd para o backend:

```bash
sudo nano /etc/systemd/system/speedtest-backend.service
```

Cole:

```ini
[Unit]
Description=SpeedTest Backend API
After=network.target

[Service]
User=www-data
WorkingDirectory=/caminho/para/backend
ExecStart=/usr/bin/python3 -m uvicorn server:app --host 127.0.0.1 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

Ativar o serviço:

```bash
sudo systemctl daemon-reload
sudo systemctl enable speedtest-backend
sudo systemctl start speedtest-backend
```

#### Passo 6: Acessar

Acesse: **http://localhost** ou **http://seu-dominio.com**

---

## 📁 Estrutura do Projeto

```
teste-velocidade/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── requirements.txt   # Dependências Python
│   └── .env              # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   ├── components/
│   │   │   ├── ProgressBars.jsx
│   │   │   └── ResultCard.jsx
│   │   └── hooks/
│   │       └── useSpeedTest.js
│   ├── package.json
│   └── .env              # URL do backend
│
└── README.md
```

---

## ⚙️ Configuração de Ambiente

### Frontend (`frontend/.env`)

```env
# URL do backend (altere conforme seu ambiente)
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Backend (`backend/.env`)

```env
# Origens permitidas para CORS (use * para permitir todas)
CORS_ORIGINS=*
```

---

## 🔧 Solução de Problemas

### Erro: "CORS policy blocked"

**Solução:** Verifique se a URL do backend no `frontend/.env` está correta e se o backend está rodando.

### Erro: "Connection refused"

**Solução:** Certifique-se de que o backend está rodando na porta 8001:
```bash
curl http://localhost:8001/api/ping
```

### Teste de velocidade mostrando 0 Mbps

**Solução:** Isso pode acontecer se o backend não estiver acessível. Verifique:
1. O backend está rodando
2. A URL no `.env` está correta
3. Não há firewall bloqueando a porta 8001

### Build do frontend falha

**Solução:** Limpe o cache e reinstale:
```bash
cd frontend
rm -rf node_modules
yarn install
yarn build
```

---

## 📝 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ping` | Retorna timestamp para medir latência |
| GET | `/api/download` | Stream de dados para teste de download |
| POST | `/api/upload-test` | Recebe dados para teste de upload |

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ 

---

## 🌟 Agradecimentos

- Inspirado no projeto [LibreSpeed](https://github.com/librespeed/speedtest)
- Interface com tema Neon/Cyberpunk
