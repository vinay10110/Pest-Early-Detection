from flask import Flask, request, jsonify
import base64
import logging

# Import your functions
from llm import ask_agri
from vision_model import load_and_predict

# Flask app setup
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse input
        data = request.get_json() if request.is_json else {}
        user_message = data.get("message", "")
        user_language = data.get("language", "en")
        image_data = data.get("image")

        llm_response = None
        vision_result = None

        # Case 1: Only message
        if user_message and not image_data:
            query = f"{user_message}\nReturn the response in {user_language} language."
            llm_response = ask_agri(query)

        # Case 2: Only image
        elif image_data and not user_message:
            # If image is base64 encoded string
            try:
                image_bytes = base64.b64decode(image_data)
                with open("temp_image.png", "wb") as f:
                    f.write(image_bytes)
                vision_result = load_and_predict("temp_image.png", model_dir="./model", top_k=5)
            except Exception as e:
                logger.error(f"Image processing failed: {e}")
                return jsonify({"error": "Invalid image data"}), 400

            query = (
                f"This is a result of an image after predicting:\n{vision_result}\n"
                f"Please recommend some suggestions and return the response in {user_language} language."
            )
            llm_response = ask_agri(query)

        # Case 3: Both image + message
        elif image_data and user_message:
            try:
                image_bytes = base64.b64decode(image_data)
                with open("temp_image.png", "wb") as f:
                    f.write(image_bytes)
                vision_result = load_and_predict("temp_image.png", model_dir="./model", top_k=5)
            except Exception as e:
                logger.error(f"Image processing failed: {e}")
                return jsonify({"error": "Invalid image data"}), 400

            query = (
                f"User message: {user_message}\n"
                f"Image prediction result: {vision_result}\n"
                f"Return the response in {user_language} language."
            )
            llm_response = ask_agri(query)

        else:
            return jsonify({"error": "No message or image provided"}), 400

        return jsonify({
            "response": llm_response
        })

    except Exception as e:
        logger.exception("Error in /predict route")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
