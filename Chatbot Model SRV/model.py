import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

class Model():
    def __init__(self) -> None:
        super().__init__()
        # self.prompt = prompt
    
    def load_model(self):
        peft_model_id = os.environ.get('PERF_MODEL_ID')
        config = PeftConfig.from_pretrained(peft_model_id)
        model = AutoModelForCausalLM.from_pretrained(
            config.base_model_name_or_path, 
            return_dict=True, 
            load_in_4bit=True, 
            device_map={"":0},
            trust_remote_code=True,
        )
        self.tokenizer = AutoTokenizer.from_pretrained(os.environ.get('AUTOTOKEN_MODEL_ID'))
        # print(self.tokenizer)
        self.tokenizer.pad_token = self.tokenizer.eos_token

        # Load the Lora model
        self.model = PeftModel.from_pretrained(model, peft_model_id)

    def preprocess(self, prompt):
        self.prompt = "".join(["<human>: ", prompt, " \\n<bot>:"])
        batch = self.tokenizer(
            self.prompt,
            padding=True,
            truncation=True,
            return_tensors='pt'
        )
        self.batch = batch.to('cuda:0')
    
    def generating(self):
        with torch.cuda.amp.autocast():
            self.output_tokens = self.model.generate(
                input_ids = self.batch.input_ids, 
                max_new_tokens=200,
                temperature=0.7,
                top_p=0.7,
                num_return_sequences=1,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
            )
    def output(self):
        generated_text = self.tokenizer.decode(self.output_tokens[0], skip_special_tokens=True)
        out = generated_text.split("<human>: ")[1].split("<bot>: ")[-1]
        return out
    
    def generate_output(self):
        self.generating()
        out = self.output()
        return out