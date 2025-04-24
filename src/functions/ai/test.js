async function testLocalLLM() {
  return fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:1b",
      prompt: "Who are you?",
      stream: false,
    }),
  })
    .then((response) => response.text())
    .then((text) => {
      const json = JSON.parse(text);
      return json.done && json.done_reason === "stop";
    })
    .catch((error) => {
      return false;
    });
}

export { testLocalLLM };
