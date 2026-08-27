const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const allowedCommands = {
  "pwd": [],
  "whoami": [],
  "uname": ["-a"],
  "date": [],
  "ls": ["-la"],
  "df": ["-h"],
  "free": ["-h"],
  "python3": ["--version"],
  "node": ["--version"],
  "git": ["--version"]
};

app.post("/api/terminal", (req, res) => {
  const command = String(req.body.command || "").trim();

  if (!command) {
    return res.json({ output: "" });
  }

  const parts = command.split(/\s+/);
  const program = parts[0];
  const args = parts.slice(1);

  if (!Object.prototype.hasOwnProperty.call(allowedCommands, program)) {
    return res.status(400).json({
      output: `Command not allowed: ${program}`
    });
  }

  const allowedArgs = allowedCommands[program];

  if (
    args.length > 0 &&
    JSON.stringify(args) !== JSON.stringify(allowedArgs)
  ) {
    return res.status(400).json({
      output: `Arguments not allowed for ${program}`
    });
  }

  execFile(program, args, { timeout: 5000 }, (error, stdout, stderr) => {
    if (error) {
      return res.json({
        output: stderr || error.message
      });
    }

    res.json({
      output: stdout || stderr || ""
    });
  });
});

app.listen(PORT, () => {
  console.log(`CYBERMIRROR running on port ${PORT}`);
});
