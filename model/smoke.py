from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# ChatGPT was used in to help generate this code

model_id = "google/gemma-2b"  # or "google/gemma-2-2b"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
    device_map="auto"
)

prompt = "You are a helpful assistant. Explain what a credit score is in 2 sentences."
inputs = tok(prompt, return_tensors="pt").to(model.device)
out = model.generate(**inputs, max_new_tokens=120)
print(tok.decode(out[0], skip_special_tokens=True))