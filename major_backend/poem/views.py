from django.http import HttpResponse, JsonResponse
from PIL import Image
from .models import load_model
import ollama

model, processor = load_model()
if(not model):
    print("Error loading model")


def upload_image(request):
    if request.method == 'POST':
        try:
            image_file = request.FILES['image']
            if(not model or not processor): 
                return JsonResponse({"status":"error"})

            prompt = "<grounding>An image of"
            image = Image.open(image_file)

            inputs = processor(text=prompt, images=image, return_tensors="pt")

            generated_ids = model.generate(
                pixel_values=inputs["pixel_values"],
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                image_embeds=None,
                image_embeds_position_mask=inputs["image_embeds_position_mask"],
                use_cache=True,
                max_new_tokens=128,
            )
            generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            processed_text, _ = processor.post_process_generation(generated_text)

            response = ollama.chat(model='mistral', messages=[
                {
                    'role': 'user',
                    'content': f'Generate a poem for: {processed_text}',
                },
            ])
            return JsonResponse({"status": "success", "message": response['message']['content']})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"status": "error", "message": str(e)})
    return JsonResponse({"status": "error", "message": "Invalid Method"})
