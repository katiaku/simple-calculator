const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttonContainer div");
let calculation = "";
let decimalAdded = false; // Flag to track if a decimal point has already been added

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("value");

        if (value === "AC") {
            calculation = "";
            decimalAdded = false;
            updateDisplay("0");
        } else if (value === "=") {
            try {
                const result = evaluateCalculation();
                updateDisplay(roundResult(result, 4));
                calculation = String(result);
            } catch (error) {
                updateDisplay("Error");
            }
        } else if (value === ".") {
            if (!decimalAdded) {
            if (calculation === "" || isOperator(calculation.slice(-1))) {
                calculation += "0";
            }
            calculation += ".";
            decimalAdded = true;
            updateDisplay(calculation);
            }
        } else {
            if (isNumeric(value)) {
            if (calculation === "0" && !decimalAdded) {
                return; // Ignore leading zeros before the decimal point
            }
            calculation += value;
            updateDisplay(calculation);
            } else if (isOperator(value)) {
                // Handle consecutive operators
                if (isOperator(calculation.slice(-1))) {
                // Replace the previous operator with the new one (excluding negative sign)
                    if (value !== "-") {
                        calculation = calculation.slice(0, -1) + value;
                    }
                    if (value === "-") {
                        calculation += value;
                    }
                } else {
                    // Append the operator to the calculation
                    if (decimalAdded) {
                        decimalAdded = false;
                    }
                    calculation += value;
                }
                updateDisplay(calculation);
            }
        }
    });
});

function evaluateCalculation() {
    const parsedCalculation = calculation.replace(/[^-()\d/*+.]/g, "");
    const result = new Function("return " + parsedCalculation)();
    return parseFloat(result.toFixed(4));
}

function roundResult(result, decimalPlaces) {
    if (decimalPlaces <= 0) {
        return Math.round(result);
    }
    const factor = 10 ** decimalPlaces;
    return Math.round(result * factor) / factor;
}

function updateDisplay(value) {
    display.textContent = value;
}

function isOperator(value) {
    return value === "+" || value === "-" || value === "*" || value === "/";
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}
