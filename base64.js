
const $ = document.querySelector.bind(document), $$ = document.querySelectorAll.bind(document);

const table = $("tbody");
const info = $("#result-info-text");
const input = $("#input_base64");

// Run the decoding on default value after document has loaded.
fill_table();

/* https://developer.mozilla.org/en-US/docs/Glossary/Base64#solution_1_%E2%80%93_escaping_the_string_before_encoding_it */
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function empty_table() {
    table.innerHTML = "";
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        console.log("navigator.clipboard not found")
        return;
    }

    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

// Called on every value change of input or settings (iteration depth)
function fill_table() {

    empty_table();

    if (input.value === "") {
        info.innerText = "Input empty."
        return;
    }

    let last_result = null;

    // Returns from loop (and function) on error
    let i = 1;
    while (true) {

        let decoded = null;

        // If last result doesn't exists, calculate based on user input
        if (last_result === null) {
            // Try to decode user input & handle faulty user input
            try {
                decoded = b64_to_utf8(input.value);
            } catch (error) {
                info.innerText = "Input faulty. Check for typos."
                info.style.color = "red";
                input.classList.add("error-input-border");
                return;
            }
            // Success
            info.style.color = "inherit";
            input.classList.remove("error-input-border");
        }
        // Else: last result (of current input string) exists, calculate based on that
        else {
            // Try to decode last result & handle faulty last input (it may be the flag for CTF)
            try {
                decoded = b64_to_utf8(last_result);

            } catch (error) {
                info.innerText = "Solution reached. Last result could not be base64 decoded."
                return;
            }
        }

        // Success, no error thrown
        info.innerHTML = "";

        // Add result to table
        const row = table.insertRow(0);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.innerText = i;
        cell2.innerText = decoded;

        const copy_button = document.createElement("button");
        copy_button.classList.add("copy-icon");

        const copy_text = document.createElement("p");
        copy_text.innerText = "Copy";
        copy_text.classList.add("copy-text");

        copy_button.addEventListener("click", function () {
            copyTextToClipboard(decoded);
            copy_text.innerText = "Copied!";
        });

        copy_button.addEventListener("mouseenter", function() {
            copy_text.innerText = "Copy";
            copy_text.style.opacity = 1;
        });

        copy_button.addEventListener("mouseleave", function() {
            copy_text.style.opacity = 0;
        });

        cell1.append(copy_button);
        copy_button.insertAdjacentElement("afterend", copy_text);



        // Save current result to be referenced by next one
        last_result = decoded;

        i++;
    }
}