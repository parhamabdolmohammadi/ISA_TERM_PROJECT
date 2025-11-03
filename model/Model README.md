train_model.py - used for fine-tuning the model based of a chosen csv.  Currently it selects 50000 samples from a given data set, but it will be refactored to consider the full data set in the final version.

smoke.py - used for a basic test of referencing the base model to be fine tuned.

app.py - the python file for running the model through Gradio.  Our current model uses a Docker container on HuggingFace Spaces instead of Gradio in order to take advantage of FastAPI.

create_and_push.txt - contains the commands used in order to create the model weights files and push all necessary files to Hugging Face



How to call the model in javascript (note, no tokens should be required as this is set up on the model side):
const query = async () => {
  const response = await fetch("https://mickmcb-education-adivsor.hf.space/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: "What degree do I need to become a data scientist?"
    })
  });

  const data = await response.json();
  console.log(data.response);
};

query();

Note, not all files for the model are included in this folder.  Large files such as the current training weights and the original dataset exceed allowable size for github. Contact Michael McBride if you'd like to get these files.