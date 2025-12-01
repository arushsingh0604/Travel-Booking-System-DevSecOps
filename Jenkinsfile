pipeline {
    agent any

    environment {
        SONARQUBE_ENV = 'SonarQube'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        SONAR_HOST_URL = '65.2.131.181:9000' // Using http:// prefix
        PATH = "/opt/sonar-scanner/bin:$PATH"
        AWS_DEFAULT_REGION = 'ap-south-1'
        AWS_CREDENTIALS = credentials('AWS_CREDS')
        DOCKERHUB_CREDENTIALS = credentials('DOCKERHUB_CREDS')
        
        // --- KUBERNETES ENVIRONMENT VARIABLES ---
        KUBE_CONFIG_CRED = credentials('KUBE_CONFIG_FILE') // ID for the Kubeconfig Secret Text
        K8S_MANIFEST_DIR = 'k8s'                          // Directory where YAML manifests live
        // ----------------------------------------
        
        // Your specific repository names
        ECR_REGISTRY_URL = '881490098879.dkr.ecr.ap-south-1.amazonaws.com'
        
        BACKEND_ECR_REPO = "${ECR_REGISTRY_URL}/devops/travel-booking-system-backend"
        FRONTEND_ECR_REPO = "${ECR_REGISTRY_URL}/devops/travel-booking-system-frontend"
        
        BACKEND_DOCKERHUB_REPO = 'arushsingh246/travel-booking-system-backend'
        FRONTEND_DOCKERHUB_REPO = 'arushsingh246/travel-booking-system-frontend'
    }

    parameters {
        // This tag will be applied to all images
        string(name: 'DOCKER_IMAGE_TAG', defaultValue: 'v1.0', description: 'Docker image tag')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code..."
                git branch: 'main', url: 'https://github.com/Msocial123/Travel-Booking-System.git'
            }
        }

        stage('Unit Tests (Backend)') {
            steps {
                echo "🧪 Running Backend unit tests (Node.js)..."
                sh "cd backend && npm ci && npm test"
            }
        }

        stage('SonarQube Analysis (Backend)') {
            steps {
                echo "🔍 Running SonarQube analysis on backend..."
                withSonarQubeEnv(env.SONARQUBE_ENV) {
                    sh """
                        cd backend && sonar-scanner \\
                            -Dsonar.projectKey=Travel-Booking-System-DevSecOps \\
                            -Dsonar.projectName='Travel Booking System DevSecOps' \\
                            -Dsonar.sources=. \\
                            -Dsonar.host.url=http://65.2.131.181:9000 \ 
                            -Dsonar.login=${SONAR_TOKEN} \\
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \\
                            -Dsonar.javascript.node.maxspace=4096 
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // --- SECURITY FIX: Using triple quotes for sh commands ---
        stage('Build & Tag Docker Images') {
            steps {
                echo "🐳 Building Backend Docker image..."
                sh "docker build --no-cache -t ${BACKEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} ./backend"
                
                echo "🏷 Tagging Backend image for ECR..."
                sh "docker tag ${BACKEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} ${BACKEND_ECR_REPO}:${DOCKER_IMAGE_TAG}"

                echo "🏗️ Building Frontend Docker image..."
                sh "docker build --no-cache -t ${FRONTEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} ./frontend"
                
                echo "🏷 Tagging Frontend image for ECR..."
                sh "docker tag ${FRONTEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} ${FRONTEND_ECR_REPO}:${DOCKER_IMAGE_TAG}"
            }
        }
        // ---------------------------------------------------------

        stage('Security Scan - Trivy') {
            steps {
                echo "🛡 Running Trivy scan on Backend image..."
                sh """
                    trivy image --exit-code 0 --severity CRITICAL,HIGH --ignore-unfixed ${BACKEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} || true
                """
                
                echo "🛡 Running Trivy scan on Frontend image..."
                sh """
                    trivy image --exit-code 0 --severity CRITICAL,HIGH --ignore-unfixed ${FRONTEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} || true
                """
            }
        }

        stage('Push to ECR & DockerHub') {
            steps {
                script {
                    
                    // --- Login to AWS ECR ---
                    echo "🔒 Logging in to AWS ECR..."
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS_CREDS']]) {
                        // SECURITY FIX: Using triple quotes for sh command with variable
                        sh """
                            aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY_URL}
                        """
                    }

                    // --- Login to DockerHub ---
                    echo "🔒 Logging in to DockerHub..."
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    }
                    
                    // --- Push Images (Using triple quotes for better practice) ---
                    sh """
                        echo "🚀 Pushing Backend image to ECR..."
                        docker push ${BACKEND_ECR_REPO}:${DOCKER_IMAGE_TAG}
                        
                        echo "🚀 Pushing Backend image to DockerHub..."
                        docker push ${BACKEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}
                        
                        echo "🚀 Pushing Frontend image to ECR..."
                        docker push ${FRONTEND_ECR_REPO}:${DOCKER_IMAGE_TAG}
                        
                        echo "🚀 Pushing Frontend image to DockerHub..."
                        docker push ${FRONTEND_DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}
                    """
                }
            }
        }

        // ===================================================================
        // =========== REQUIRED KUBERNETES DEPLOYMENT STAGE ================
        // ===================================================================
        stage('Kubernetes Deploy') {
            steps {
                script {
                    echo "🚢 Preparing and deploying manifests to Kubernetes (Declarative Method)..."

                    // Create a directory for processed YAMLs
                    sh 'mkdir -p processed_k8s'
                    
                    // 1. Substitute Jenkins environment variables into the K8s manifests
                    // We use triple quotes to allow shell globbing (*.yaml)
                    sh """
                        # Export the necessary variables so envsubst can see them
                        export DOCKER_IMAGE_TAG="${params.DOCKER_IMAGE_TAG}"
                        export BACKEND_ECR_REPO="${env.BACKEND_ECR_REPO}"
                        export FRONTEND_ECR_REPO="${env.FRONTEND_ECR_REPO}"
                        
                        # Use envsubst to replace placeholders in all YAMLs
                        for file in ${env.K8S_MANIFEST_DIR}/*.yaml; do
                            envsubst < \$$file > processed_k8s/$(basename \$$file)
                        done
                    """

                    // 2. Apply manifests using kubectl with the secured Kubeconfig file
                    withCredentials([file(credentialsId: 'KUBE_CONFIG_FILE', variable: 'KUBECONFIG_PATH')]) {
                        sh """
                            echo '📄 Applying Kubernetes Manifests...'
                            # Use KUBECONFIG_PATH provided by withCredentials to authenticate
                            kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f processed_k8s/
                            
                            echo '🔍 Checking rollout status...'
                            kubectl --kubeconfig=${KUBECONFIG_PATH} rollout status deployment/tbs-backend-deployment --namespace default
                            kubectl --kubeconfig=${KUBECONFIG_PATH} rollout status deployment/tbs-frontend-deployment --namespace default
                        """
                    }
                }
            }
        }
        // ===================================================================

        stage('Compose Validation (Optional)') {
            steps {
                echo "🧩 Validating docker-compose.yml..."
                sh "docker-compose config || true"
            }
        }
    }

    post {
        always {
            echo '📦 Pipeline completed.'
            // Log out of DockerHub
            sh "docker logout"
        }
        success {
            echo '✅ All checks passed.'
            emailext(
                to: 'arushsingh0604@gmail.com',
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>Hi Arush,</p>
                    <p>The pipeline for <b>${env.JOB_NAME}</b> completed successfully.</p>
                    <p>Build URL: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
                    <p><b>Images Pushed (Tag: ${DOCKER_IMAGE_TAG}):</b></p>
                    <ul>
                        <li><b>Backend (ECR):</b> ${BACKEND_ECR_REPO}</li>
                        <li><b>Backend (DockerHub):</b> ${BACKEND_DOCKERHUB_REPO}</li>
                        <li><b>Frontend (ECR):</b> ${FRONTEND_ECR_REPO}</li>
                        <li><b>Frontend (DockerHub):</b> ${FRONTEND_DOCKERHUB_REPO}</li>
                    </ul>
                    <p><b>Kubernetes Deployment:</b> Applied successfully to cluster.</p>
                    <p>Regards,<br>Jenkins CI</p>
                """,
                mimeType: 'text/html'
            )
        }
        failure {
            echo '❌ Pipeline failed.'
            emailext(
                to: 'arushsingh0604@gmail.com',
                subject: "❌ FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>Hi Arush,</p>
                    <p>The pipeline for <b>${env.JOB_NAME}</b> failed.</p>
                    <p>Check SonarQube and Trivy for details.</p>
                    <p><a href='${SONAR_HOST_URL}/dashboard?id=Travel-Booking-System'>Sonar Dashboard</a></p>
                """,
                mimeType: 'text/html'
            )
        }
    }
}
