from transformers import AutoProcessor, AutoModelForVision2Seq
# Load the model outside the view function
def load_model():
    try:
        model = AutoModelForVision2Seq.from_pretrained("microsoft/kosmos-2-patch14-224")
        processor = AutoProcessor.from_pretrained("microsoft/kosmos-2-patch14-224")
        return model, processor
    except Exception as e:
        print(f"Error loading model: {e}")
