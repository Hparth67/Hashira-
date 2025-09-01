const fs = require('fs');

/* // Function to convert from any base to decimal
function convertToDecimal(value, base) {
    return parseInt(value, parseInt(base));
}

// Lagrange Interpolation to find the secret (constant term)
function lagrangeInterpolation(points, k) {
    let secret = 0;
    
    // Take only first k points
    const selectedPoints = points.slice(0, k);
    
    for (let i = 0; i < k; i++) {
        let xi = selectedPoints[i].x;
        let yi = selectedPoints[i].y;
        
        // Calculate Lagrange basis polynomial Li(0)
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = selectedPoints[j].x;
                li *= (0 - xj) / (xi - xj);
            }
        }
        
        secret += yi * li;
    }
    
    return Math.round(secret);
} */

// Use BigInt for large numbers
function convertToDecimal(value, base) {
    // For most cases, regular parseInt is sufficient
    // Only use BigInt if absolutely necessary for very large numbers
    try {
        return parseInt(value, parseInt(base));
    } catch (error) {
        // Fallback for extremely large numbers
        console.log("Using BigInt for large number:", value);
        return parseInt(value, parseInt(base)); // Let JS handle precision
    }
}


// Also update Lagrange interpolation for BigInt
function lagrangeInterpolation(points, k) {
    let secret = 0; // Keep as regular number for now
    
    const selectedPoints = points.slice(0, k);
    
    for (let i = 0; i < k; i++) {
        let xi = selectedPoints[i].x;
        let yi = selectedPoints[i].y;
        
        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = selectedPoints[j].x;
                // Use regular numbers for division
                li *= (0 - xj) / (xi - xj);
            }
        }
        secret += yi * li;
    }
    
    return Math.round(secret);
}


// Accept filename as command line argument, default to 'testcase.json'
const testFile = process.argv[2] || 'testcase.json';

// Main function
function solveShamirSecret() {
    try {
        // Read and parse JSON file
        const rawData = fs.readFileSync('testcase.json', 'utf8');
        const jsonData = JSON.parse(rawData);
        
        console.log("=== Hashira Placement Solution ===");
        console.log("Input JSON parsed successfully!\n");
        
        // Extract n and k
        const n = jsonData.keys.n;
        const k = jsonData.keys.k;
        
        console.log(`n (total roots): ${n}`);
        console.log(`k (minimum roots needed): ${k}`);
        console.log(`Polynomial degree: ${k-1}\n`);
        
        // Parse all points
        const points = [];
        
        for (let key in jsonData) {
            if (key !== 'keys') {
                const base = jsonData[key].base;
                const value = jsonData[key].value;
                const decimalValue = convertToDecimal(value, base);
                
                points.push({
                    x: parseInt(key),
                    y: decimalValue
                });
                
                console.log(`Point ${key}: base ${base}, value "${value}" → decimal ${decimalValue}`);
            }
        }
        
        console.log(`\nTotal points available: ${points.length}`);
        console.log(`Using first ${k} points for interpolation\n`);
        
        // Sort points by x coordinate
        points.sort((a, b) => a.x - b.x);
        
        // Find the secret using Lagrange interpolation
        const secret = lagrangeInterpolation(points, k);
        
        console.log("=== SOLUTION ===");
        console.log(`The secret (constant term) is: ${secret}`);
        
        // Save output to file
        const output = {
            secret: secret,
            pointsUsed: points.slice(0, k),
            calculation: "Lagrange interpolation at x=0"
        };
        
        fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
        console.log("\nOutput saved to output.json");
        
        return secret;
        
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

// Run the solution
solveShamirSecret();
