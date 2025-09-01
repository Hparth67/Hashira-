# Hashira Placement Assignment - Shamir's Secret Sharing

A JavaScript implementation of Shamir's Secret Sharing algorithm using Lagrange interpolation to reconstruct polynomial secrets from distributed shares.

## 🎯 Problem Overview

This project implements a solution to decode secrets hidden in polynomial equations using the following:
- **n**: Total number of roots/shares provided
- **k**: Minimum number of shares required to reconstruct the secret
- **Polynomial degree**: m = k - 1
- **Goal**: Find the constant term (y-intercept) of the polynomial

## 🚀 Features

- ✅ JSON input parsing
- ✅ Multi-base number system conversion (binary, decimal, hex, etc.)
- ✅ Lagrange interpolation implementation  
- ✅ Support for large numbers using BigInt
- ✅ Multiple test case support
- ✅ Command-line argument handling

## Conclusion

we have to find the value of constant "c" from the polynomial expression :- "ax² + bx + c""

