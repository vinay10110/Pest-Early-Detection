# 🌱 Pest Early Detection
  An intelligent agricultural assistant that helps farmers identify and manage crop pests and diseases using AI-powered image analysis and multilingual chat support.
 
## 🚀 Features

- **AI-Powered Pest Detection**: Uses Vision Transformer (ViT) model for accurate pest and disease identification
- **Multilingual Support**: Chat interface supports English, Hindi, Tamil, and Telugu
- **Image Analysis**: Upload crop images for instant pest detection and recommendations
- **Expert Recommendations**: Get farming advice, treatment suggestions, and preventive measures
- **Mobile-Friendly**: React Native frontend for easy field use
- **REST API**: Flask backend with comprehensive API endpoints
  
## 🧰 Tech Stack

  - Backend:
    - Python 3.8+
    - Flask (REST API)
    - python-dotenv, requests
  
  - AI and ML:
    - PyTorch, TorchVision
    - Transformers (Hugging Face)
    - Vision Transformer (ViT) - google/vit-base-patch16-224
    - Together AI Python SDK
  
  - Frontend:
    - React Native 0.79.5, React 19
    - Expo 53 (Expo Router 5)
    - React Navigation
    - i18next, react-i18next
    - TypeScript
  
  - Tooling:
    - Node.js 16+
    - Expo CLI
  
## 🏗️ Project Structure

  ```
pest-early-detection/
    ├── frontend/                 # React Native mobile app
    │   ├── app/                 # App screens and components
    │   ├── assets/              # Images, fonts, and static assets
    │   └── translations/        # Multilingual support files
    ├── model/                   # Pre-trained ViT model files
    │   ├── config.json
    │   ├── model.safetensors
    │   └── preprocessor_config.json
    ├── app.py                   # Flask API server
    ├── llm.py                   # LLM integration (Together AI)
    ├── vision_model.py          # Image classification logic
    ├── requirements.txt         # Python dependencies
    └── .env                     # Environment variables
  ```
  
## 🛠️ Backend Setup

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "pest early detection"
   ```
2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   TOGETHER_API_KEY=your_together_ai_api_key_here
   ```

5. **Run the Flask server**
   ```bash
   python app.py
   ```
   Server will start at `http://localhost:5000`

## 📱 Frontend Setup

### Prerequisites
- Node.js 16+
- Expo CLI
- React Native development environment

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or use iOS Simulator / Android Emulator

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### POST `/predict`
Analyze images and/or text for pest detection and agricultural advice.

**Request Body:**
```json
{
  "message": "What's wrong with my tomato plants?",
  "image": "base64_encoded_image_string",
  "language": "en"
}
```

**Parameters:**
- `message` (string, optional): Text query about agricultural issues
- `image` (string, optional): Base64 encoded image of crop/plant
- `language` (string, optional): Response language (`en`, `hi`, `ta`, `te`). Default: `en`

**Response:**
```json
{
  "response": "Based on the image analysis, your tomato plants show signs of early blight disease..."
}
```

**Use Cases:**
1. **Text only**: Ask agricultural questions
2. **Image only**: Upload crop image for pest detection
3. **Text + Image**: Combine image analysis with specific questions

## 🌍 Supported Languages

- **English** (`en`) - English
- **Hindi** (`hi`) - हिंदी
- **Tamil** (`ta`) - தமிழ்
- **Telugu** (`te`) - తెలుగు

## 🤖 AI Models

### Vision Model
- **Architecture**: Vision Transformer (ViT)
- **Base Model**: google/vit-base-patch16-224
- **Purpose**: Plant disease and pest classification
- **Input**: RGB images (224x224)
- **Output**: Top-5 predictions with confidence scores
- **Classes**: 15 different plant diseases and healthy states

### Language Model
- **Provider**: Together AI
- **Model**: Meta-Llama-3.1-8B-Instruct-Turbo
- **Purpose**: Agricultural advice and multilingual responses
- **Capabilities**: Pest management, farming practices, treatment recommendations

## 🧠 Model Training

The Vision Transformer model was fine-tuned using the process documented in `PestDetection.ipynb`. This notebook contains:

### Training Process
- **Dataset**: PlantVillage dataset (20,638 images) from `ButterChicken98/plantvillage-image-text-pairs`
- **Base Model**: Pre-trained `google/vit-base-patch16-224` from Hugging Face
- **Training Split**: 80% training (16,510 images), 20% validation (4,128 images)
- **Classes**: 15 plant disease categories including healthy states

### Training Configuration
- **Epochs**: 3
- **Batch Size**: 16 per device
- **Learning Rate**: 2e-5
- **Optimizer**: AdamW with warmup steps
- **Evaluation**: Accuracy and F1-score metrics

### Model Output
The trained model is saved in the `./model/` directory with:
- `config.json` - Model configuration
- `model.safetensors` - Model weights
- `preprocessor_config.json` - Image preprocessing settings

To retrain or modify the model, run the `PestDetection.ipynb` notebook in a Jupyter environment with GPU support.

## 📋 Usage Examples

### 1. Text Query
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How to prevent aphids on my crops?",
    "language": "en"
  }'
```

### 2. Image Analysis
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "language": "hi"
  }'
```

### 3. Combined Query
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is this disease serious?",
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "language": "ta"
  }'
```

## 🙏 Acknowledgments

- Developed during the Capital One Launchpad 2025 Hackathon

