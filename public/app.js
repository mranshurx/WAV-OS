const terminal = document.getElementById("terminal");
const input = document.getElementById("command");

const commands = {
  help: `
Available commands:

  pwd
  whoami
  uname
  date
  ls
  df
  free
  python3
  node
  git
  clear
  help
`,
};

async function execute(command) {

  if (command === "clear") {
    terminal.innerHTML = "";
    createPrompt();
    return;
  }

  if (command === "help") {
    addOutput(commands.help);
    createPrompt();
    return;
  }

  const response = await fetch("/api/terminal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ command })
  });

  const data = await response.json();

  addOutput(data.output);
  createPrompt();
}

function addOutput(text) {
  const output = document.createElement("div");
  output.className = "output";
  output.textContent = text;
  terminal.appendChild(output);
}

function createPrompt() {

  const line = document.createElement("div");
  line.className = "line";

  line.innerHTML = `
    <span>cybermirror@server:~$</span>
    <input autofocus autocomplete="off">
  `;

  terminal.appendChild(line);

  const newInput = line.querySelector("input");

  newInput.focus();

  newInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      const command = newInput.value.trim();

      newInput.disabled = true;

      if (command) {
        execute(command);
      } else {
        createPrompt();
      }
    }
  });
}

input.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    const command = input.value.trim();

    input.disabled = true;

    if (command) {
      execute(command);
    } else {
      createPrompt();
    }
  }
});
