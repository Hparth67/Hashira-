const fs = require('fs');


function convertToDecimal(value, base) {
    const baseInt = parseInt(base);
    
    // For very large numbers, use custom BigInt conversion
    if (value.length > 15) {
        let result = BigInt(0);
        let baseBig = BigInt(baseInt);
        
        for (let i = 0; i < value.length; i++) {
            let digit = parseInt(value[i], baseInt);
            if (digit >= baseInt) {
                // Handle characters like 'a', 'b', etc. in higher bases
                if (value[i].toLowerCase() >= 'a') {
                    digit = value[i].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10;
                }
            }
            result = result * baseBig + BigInt(digit);
        }
        return result;
    }
    
    return parseInt(value, baseInt);
}

function lagrangeInterpolation(points, k) {
    const selectedPoints = points.slice(0, k);
    
    // Check if we need BigInt arithmetic
    const needsBigInt = selectedPoints.some(p => typeof p.y === 'bigint');
    
    if (needsBigInt) {
        let secret = BigInt(0);
        
        for (let i = 0; i < k; i++) {
            let xi = BigInt(selectedPoints[i].x);
            let yi = BigInt(selectedPoints[i].y);
            
            let numerator = yi;
            let denominator = BigInt(1);
            
            for (let j = 0; j < k; j++) {
                if (i !== j) {
                    let xj = BigInt(selectedPoints[j].x);
                    numerator *= (BigInt(0) - xj);
                    denominator *= (xi - xj);
                }
            }
            
            secret += numerator / denominator;
        }
        
        return secret;
    } else {
        // Regular number arithmetic for small numbers
        let secret = 0;
        
        for (let i = 0; i < k; i++) {
            let xi = selectedPoints[i].x;
            let yi = selectedPoints[i].y;
            
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
    }
}

const Big = require('big.js');

function convertToDecimal(value, base) {
    // Use Big.js for arbitrary precision arithmetic
    let result = new Big(0);
    const bigBase = new Big(base);
    
    for (let i = 0; i < value.length; i++) {
        let digit = parseInt(value[i], parseInt(base));
        if (value[i].toLowerCase() >= 'a') {
            digit = value[i].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        }
        result = result.times(bigBase).plus(digit);
    }
    
    return result;
}




// Accept filename as command line argument, default to 'testcase.json'
const testFile = process.argv[2] || 'testcase.json';

console.log(`📁 Looking for file: ${testFile}`);
        
function solveShamirSecret() {
    try {
        // Use testFile variable, not hardcoded name
        const rawData = fs.readFileSync(testFile, 'utf8');
        const jsonData = JSON.parse(rawData);
        
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
