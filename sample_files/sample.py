import os
import sys  # ❌ Unused import

def a(x):  # ⚠️ Too short function name, short variable
    y = 1
    z = 2
    result = x + y + z
    return result

def LongFunctionName():  # 🔤 Naming issue (PascalCase in Python)
    a = 0
    b = 1
    c = 2
    d = 3
    e = 4
    f = 5
    g = 6
    h = 7
    i = 8
    j = 9
    k = 10
    return a + b + c + d + e + f + g + h + i + j + k

# def broken_syntax()  # 🚨 Syntax Error
#     print("Oops")

# def parse_error():
#     exec("def x():\n print('hi'")  # 💥 Parse Error: malformed string
