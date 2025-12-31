# B2 English Learning Platform 🎓

[English Version](#english-documentation) | [Versión en Español](#documentación-en-español)

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

### 🚀 Overview
The **B2 English Learning Platform** is a gamified application designed to help users master English verbs and tenses at a B2 level. It features a modern, interactive interface (Millionaire-style quizzes, classic practice) backed by a robust API.

### 🛠️ Tech Stack
- **Backend:** FastAPI (Python), SQLAlchemy, PostgreSQL.
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand.
- **Infrastructure:** Docker, Docker Compose.

### 📋 Prerequisites
- **Docker & Docker Compose** (Recommended)
- *Or for manual setup:* Python 3.10+, Node.js 18+, PostgreSQL.

### ⚡ Quick Start (Docker)
The easiest way to run the project is using Docker.

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd b2english
    ```

2.  **Environment Setup**:
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: The default values in `.env.example` are configured for the Docker setup.*

3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:8000](http://localhost:8000)
    - **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 🕹️ Features
- **Practice Mode**:
    - **Classic:** Free practice with randomized question pools (Warmup, Main, Boss).
    - **Millionaire:** High-stakes mode with lifelines (50/50, +Time, Double XP).
- **Dashboard:** Track daily streaks, XP progress, and level.
- **Verb Dictionary:** Search and study verb forms and examples.

---

<a name="documentación-en-español"></a>
## 🇪🇸 Documentación en Español

### 🚀 Visión General
La **Plataforma de Aprendizaje de Inglés B2** es una aplicación gamificada diseñada para ayudar a los usuarios a dominar verbos y tiempos verbales en inglés (nivel B2). Cuenta con una interfaz moderna e interactiva (quizzes estilo "Quién quiere ser millonario", práctica clásica) respaldada por una API robusta.

### 🛠️ Tecnologías
- **Backend:** FastAPI (Python), SQLAlchemy, PostgreSQL.
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand.
- **Infraestructura:** Docker, Docker Compose.

### 📋 Requisitos Previos
- **Docker y Docker Compose** (Recomendado)
- *O para instalación manual:* Python 3.10+, Node.js 18+, PostgreSQL.

### ⚡ Inicio Rápido (Docker)
La forma más sencilla de ejecutar el proyecto es usando Docker.

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd b2english
    ```

2.  **Configuración de Entorno**:
    Copia el archivo de ejemplo de variables de entorno:
    ```bash
    cp .env.example .env
    ```
    *Nota: Los valores por defecto en `.env.example` están configurados para el entorno Docker.*

3.  **Ejecutar con Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:8000](http://localhost:8000)
    - **Documentación API:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 🕹️ Funcionalidades
- **Modo Práctica**:
    - **Clásico:** Práctica libre con pools de preguntas aleatorios (Calentamiento, Principal, Jefe).
    - **Millonario:** Modo de alto riesgo con comodines (50/50, +Tiempo, Doble XP).
- **Dashboard:** Sigue tus rachas diarias (streaks), progreso de XP y nivel.
- **Diccionario de Verbos:** Busca y estudia formas verbales y ejemplos.
