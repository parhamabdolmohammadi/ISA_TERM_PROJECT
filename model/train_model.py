import torch,datasets
from datasets import load_dataset, Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
)
from trl import SFTTrainer
from peft import LoraConfig, get_peft_model
torch.backends.cuda.matmul.allow_tf32 = True
datasets.logging.set_verbosity_error()

# ChatGPT was used in to help generate this code

# ============================================================
# CONFIGURATION
# ============================================================
CSV_PATH = r"D:\gigsup\education_model\98100404.csv"   # 36 GB dataset
BASE_MODEL = "google/gemma-2b"                        # or "google/gemma-2-2b"
OUTPUT_DIR = "ft-gemma-2b-edu-qlora"             # output folder for adapter
MAX_STEPS = 2000                                      # optional cap for testing
# ============================================================

# 1️⃣ Load tokenizer
tok = AutoTokenizer.from_pretrained(BASE_MODEL)
tok.pad_token = tok.eos_token

# 2️⃣ Load CSV with streaming enabled
# This keeps memory usage small even for 36 GB
stream = load_dataset("csv", data_files=CSV_PATH, streaming=True)
rows = list(stream["train"].take(50000))
dataset = Dataset.from_list(rows)

# If your CSV has columns like instruction, input, output:
def format_row(row):
    instr = row.get("instruction", "")
    inp = row.get("input", "")
    out = row.get("output", "")
    return {
        "text": f"### Instruction:\n{instr}\n\n### Input:\n{inp}\n\n### Response:\n{out}"
    }


# Apply formatting lazily
dataset = dataset.map(format_row)
train_dataset = dataset.shuffle(seed=42)

# 3️⃣ Load Gemma base model in 4-bit (QLoRA-ready)
# bnb = BitsAndBytesConfig(
#     load_in_4bit=True,
#     bnb_4bit_quant_type="nf4",
#     bnb_4bit_compute_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float16,
# )

model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto",
)

# 4️⃣ Apply LoRA adapter
peft_cfg = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
)
model = get_peft_model(model, peft_cfg)

# 5️⃣ Training setup
args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1,     # keep small for streaming
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    num_train_epochs=1,
    bf16=torch.cuda.is_bf16_supported(),
    logging_steps=25,
    save_strategy="steps",
    save_steps=500,
    max_steps=MAX_STEPS,               # remove for full epoch training
    report_to="none",                  # disable W&B if not needed

)

# 6️⃣ Trainer (supports iterable datasets)
trainer = SFTTrainer(
    model=model,
    tokenizer=tok,
    train_dataset=train_dataset,
    dataset_text_field="text",
    args=args,
    max_seq_length=1024,
    packing=False,
)

# 7️⃣ Train
trainer.train()

# 8️⃣ Save adapter + tokenizer
trainer.model.save_pretrained(OUTPUT_DIR)
tok.save_pretrained(OUTPUT_DIR)

print(f"✅ Training complete. Adapter saved to: {OUTPUT_DIR}")