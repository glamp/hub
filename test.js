 exec = require("child_process").exec;

isup = "system/isup"
exec(isup, function(err, stdout, stderr) {
  console.log(1)
});

