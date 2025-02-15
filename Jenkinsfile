pipeline {
    agent any
    environment {
        CI = 'true'  // Optimize npm behavior for CI environments
    }
    options {
        disableConcurrentBuilds() // Prevents multiple builds interfering
    }
    tools {
        nodejs 'Node_V18' // Use the name from Global Tool Configuration
    }
    stages {
        stage('Stop Previous Server') {
            steps {
               sh "pkill -f 'node index.js' || true" // Stops old server if running
                echo 'Stopped The running Server'
            }
        }
        
        stage('Checkout Backend Repo') {
            steps {
                // Checkout the Node.js backend code from GitHub repository
                git branch : 'master', credentialsId: 'github', url: 'https://github.com/joypro/Education-Exam-Web-Node.git'
            }
        }

        stage('Install Dependencies (Node.js Backend)') {
            steps { 
                script {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Tests (Backend)') {
            steps {
                script {
                    sh 'nohup node server.js &'
                }
            }
        }

    }

    post {
        always {
            // Clean up or notifications
            echo 'Pipeline finished'
        }
        success {
            echo 'Build and deploy successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}