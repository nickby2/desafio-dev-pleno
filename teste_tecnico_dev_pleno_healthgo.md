# 🚀 HealthGo | Monitoramento de Pacientes

Bem-vindo ao HealthGo, uma aplicação web full-stack desenvolvida como solução para o desafio técnico de Desenvolvedor(a) Web. O sistema permite o upload de dados de sinais vitais de pacientes via arquivos CSV, armazena essas informações num banco de dados e as exibe de forma organizada e interativa.


---

## Video de Apresentação

[Apresentação](https://www.youtube.com/watch?v=L-2vZM_H5hs)


## ✨ Funcionalidades Implementadas

O projeto implementa todas as funcionalidades esperadas e os diferenciais opcionais:

* **Upload de CSV:** Envio de arquivos `.csv` com dados de pacientes.
* **Persistência de Dados:** As informações são salvas numa base de dados PostgreSQL.
* **Visualização em Tabela:** Exibição clara dos dados, com destaque visual para registros com status `ALERTA`.
* **Filtro por Paciente:** Seleção de um paciente específico para visualização.
* **Download de Dados:** Botão para baixar os dados do paciente em formato `.csv`.
* **🌟 Gráfico Interativo:** Visualização da evolução dos sinais vitais (Freq. Cardíaca, SpO2, Temperatura) ao longo do tempo.
* **🌟 Filtro por Tempo:** Campos para filtrar os dados por um intervalo de horário específico (início e fim).
* **🌟 Download Filtrado:** O download exporta apenas os dados que correspondem aos filtros aplicados.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando uma stack de tecnologias modernas e robustas:

* **Frontend:**
    * [**React.js**](https://reactjs.org/): Biblioteca para construção da interface de utilizador.
    * [**Chart.js**](https://www.chartjs.org/): Para a criação do gráfico interativo.
* **Backend:**
    * [**Python 3.9**](https://www.python.org/)
    * [**FastAPI**](https://fastapi.tiangolo.com/): Framework web de alta performance para a construção da API.
    * [**SQLAlchemy**](https://www.sqlalchemy.org/): ORM para interação com a base de dados.
    * [**Pandas**](https://pandas.pydata.org/): Para manipulação e processamento eficiente dos dados do CSV.
* **Base de Dados:**
    * [**PostgreSQL**](https://www.postgresql.org/): Sistema de gestão de base de dados relacional.
* **DevOps:**
    * [**Docker & Docker Compose**](https://www.docker.com/): Para a containerização e orquestração de toda a aplicação.
    * [**Nginx**](https://www.nginx.com/): Servidor web para servir a aplicação React em produção.

---

## 📋 Pré-requisitos

Antes de começar, garanta que você tem as seguintes tecnologias instaladas na sua máquina.

| Tecnologia        | Descrição                                      | Link para Download                                                              |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| **Git** | Sistema de controlo de versões para clonar o projeto.   | [git-scm.com/downloads](https://git-scm.com/downloads)                          |
| **Docker Engine** | A plataforma principal para criar e correr os contêineres. | [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)     |
| **Docker Compose**| Ferramenta para definir e gerir aplicações Docker com múltiplos contêineres. | [docs.docker.com/compose/install](https://docs.docker.com/compose/install/) |

*Nota: Se você instalar o **Docker Desktop** (para Windows ou macOS), ele já inclui o Docker Engine e o Docker Compose.*

---

## ✅ Como Executar o Projeto

Siga os passos abaixo para colocar a aplicação a funcionar localmente.

#### 1. Clonar o Repositório

Abra o seu terminal e clone este repositório para a sua máquina.
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
```

#### 2. Navegar para a Pasta do Projeto

```bash
cd NOME_DO_REPOSITORIO
```

#### 3. Configurar o Ambiente do Frontend

O frontend precisa de saber onde encontrar o backend. Crie um ficheiro de ambiente para isso.

* Crie um novo ficheiro chamado `.env` dentro da pasta `frontend/`.
* Adicione o seguinte conteúdo a ele:
    ```
    REACT_APP_API_URL=http://localhost:8000
    ```

#### 4. Construir e Iniciar os Contêineres

s.

```bash
docker-compose up --build
```



#### 5. Aceder à Aplicação

Depois que os contêineres estiverem em execução, abra o seu navegador e aceda aos seguintes endereços:

* **🚀 Aplicação Frontend:** [**http://localhost:3001**](http://localhost:3001)
* **📄 Documentação da API (Backend):** [**http://localhost:8000/docs**](http://localhost:8000/docs)

---

## ⏹️ Como Parar a Aplicação

Para parar todos os contêineres, vá para o terminal onde a aplicação está a correr e pressione `Ctrl + C`.

Se quiser remover os contêineres e **apagar a base de dados**, use o comando:
```bash
docker-compose down -v
```