
            jqconsole = $('#console').jqconsole('Hi\n', '>>> ');
            
            var startPrompt = function () {
              // Start the prompt with history enabled.
              jqconsole.Prompt(true, function (input) {
                socket.emit("code", {"code": input})
                // Restart the prompt.
                startPrompt();
              });
            };
            socket.on("blah", function(data) {
                console.log(data);
                jqconsole.Write(data.result + '\n', 'jqconsole-output');
                //startPrompt();
            });
            startPrompt();

            $("#exec-code").click(function(e) {
                e.preventDefault();
                var code = editor.session.getTextRange(editor.getSelectionRange()).trim();
                console.log(code);
                jqconsole.Write(code + "\n\n", 'jqconsole-input');
                return false;
            })