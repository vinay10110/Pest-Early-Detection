import torch
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image

def load_and_predict(image_path: str, model_dir: str = "./model", top_k: int = 5) -> str:
    """
    Load a fine-tuned ViT model and predict plant disease from an image.

    Args:
        image_path (str): Path to the image file
        model_dir (str): Path where the model and config files are stored
        top_k (int): Number of top predictions to return

    Returns:
        str: A formatted string with predictions and confidence scores
    """
    try:
        # Load model and processor
        model = ViTForImageClassification.from_pretrained(
            model_dir,
            local_files_only=True,
            ignore_mismatched_sizes=True
        )
        processor = ViTImageProcessor.from_pretrained(
            model_dir,
            local_files_only=True
        )

        # Load and preprocess image
        image = Image.open(image_path).convert("RGB")
        inputs = processor(image, return_tensors="pt")

        # Run prediction
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

        # Get top-k predictions
        top_predictions = torch.topk(predictions, top_k)

        # Build result string
        output_str = "\n🎯 Prediction Results:\n"
        for i in range(top_k):
            class_idx = top_predictions.indices[0][i].item()
            confidence = top_predictions.values[0][i].item()
            class_name = model.config.id2label[class_idx]
            output_str += f"{i+1}. {class_name} ({confidence*100:.2f}%)\n"

        # Top prediction
        top_class = model.config.id2label[top_predictions.indices[0][0].item()]
        top_confidence = top_predictions.values[0][0].item()
        output_str += f"\n🏆 Top Prediction: {top_class} ({top_confidence*100:.1f}%)\n"

        return output_str

    except Exception as e:
        return f"❌ Error in load_and_predict: {e}"
