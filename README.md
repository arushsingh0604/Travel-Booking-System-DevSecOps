# 🚀 TravelEase – Secure Travel Booking Platform (DevSecOps CI/CD)

TravelEase is a **full-stack travel booking application** designed and delivered using **modern DevSecOps principles**.  
This project demonstrates **end-to-end CI/CD automation**, **containerization**, **security-first pipelines**, and **cloud-ready deployment**, making it ideal for showcasing real-world DevSecOps skills to recruiters.

---

## 📌 Project Objective

To build and deploy a **secure, scalable travel booking platform** with:
- Automated CI/CD pipelines
- Embedded security checks (Shift-Left Security)
- Containerized application delivery
- Infrastructure-ready deployment using Kubernetes

---

## 🧠 Key Highlights (Recruiter Focus)

- ✅ End-to-end **DevSecOps pipeline** using Jenkins
- ✅ **Dockerized frontend & backend**
- ✅ **Security integrated into CI/CD** (SAST, dependency & container scanning)
- ✅ **Infrastructure-as-Code ready**
- ✅ **Kubernetes deployment manifests**
- ✅ Real-world **enterprise-grade pipeline design**

---

## 🛠 Application Features

- User registration & authentication
- Flight, hotel, and travel package booking
- User profile & wallet management
- Responsive frontend interface
- Modular backend APIs
- Scalable microservice-ready structure

---

## 🔐 DevSecOps Pipeline Overview

The CI/CD pipeline is designed with **security at every stage**:

### Pipeline Stages
1. **Code Checkout**
2. **Build & Dependency Installation**
3. **Static Code Analysis (SAST)**
4. **Dependency Vulnerability Scanning**
5. **Docker Image Build**
6. **Container Image Security Scan**
7. **Kubernetes Manifest Validation**
8. **Automated Deployment**

🔁 Any security failure **blocks the pipeline**, enforcing strict quality gates.

---

## 📁 Project Structure
```bash
Travel-Booking-System-DevSecOps/
├── backend/ # Backend services & APIs
├── frontend/ # Frontend application
├── k8s/ # Kubernetes manifests
│ ├── namespace.yaml
│ ├── deployment.yaml
│ ├── service.yaml
│ └── ingress.yaml
├── docker-compose.yaml # Local container orchestration
├── Jenkinsfile # CI/CD pipeline definition
├── .env.example # Environment variables template
└── README.md # Project documentation
```

---

## 🧰 Technology Stack

| Category | Tools & Technologies |
|--------|---------------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| CI/CD | Jenkins |
| Containers | Docker |
| Orchestration | Kubernetes |
| Security | SAST, Dependency Scanning, Image Scanning |
| DevSecOps | Shift-Left Security, Automated Gates |

---

## ⚙️ How to Run Locally

### Prerequisites
- Docker
- Docker Compose
- Node.js
- Jenkins (optional for pipeline execution)

---

### 🔧 Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/arushsingh0604/Travel-Booking-System-DevSecOps.git
   cd Travel-Booking-System-DevSecOps
   ```
   
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Run the application**
   ```bash
   docker-compose up --build
   ```
4. **Access the application**
   ```bash
   http://localhost:3000
   ```

## ☸ Kubernetes Deployment

The project includes Kubernetes manifests for:

1. Namespace isolation  
2. Frontend & backend deployments  
3. ClusterIP services for internal communication  
4. Ingress for external access  

### Deployment Command
```bash
kubectl apply -f k8s/
```



## 🔍 Security Practices Implemented

1.Static Application Security Testing (SAST)

2.Dependency vulnerability scanning

3.Container image security scanning

4.Pipeline security gates

5.Secure credential handling in Jenkins

6.Shift-Left security enforcement

## 📈 Why This Project Matters

This project reflects real enterprise DevSecOps workflows, not toy examples.

It demonstrates:

1.Secure software delivery

2.Automation at scale

3.Production-ready CI/CD pipelines

4.Security-driven engineering mindset

Perfect for DevOps / DevSecOps / Cloud Engineer roles.

## 🚧 Future Enhancements

Dynamic Application Security Testing (DAST)

Cloud deployment (AWS EKS / Azure AKS)

Monitoring with Prometheus & Grafana

## 🧑‍💻 Author

Arush Singh
DevSecOps | Cloud | CI/CD | Kubernetes

🔗 GitHub: https://github.com/arushsingh0604


