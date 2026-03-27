from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

WIN_CONDITIONS = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
]

def check_winner(board, player):
    return any(all(board[i] == player for i in condition) for condition in WIN_CONDITIONS)

def is_draw(board):
    return "" not in board

def minimax(board, depth, is_max):
    if check_winner(board, "O"):
        return 10 - depth
    if check_winner(board, "X"):
        return depth - 10
    if is_draw(board):
        return 0

    if is_max:
        best = -math.inf
        for i in range(9):
            if board[i] == "":
                board[i] = "O"
                best = max(best, minimax(board, depth+1, False))
                board[i] = ""
        return best
    else:
        best = math.inf
        for i in range(9):
            if board[i] == "":
                board[i] = "X"
                best = min(best, minimax(board, depth+1, True))
                board[i] = ""
        return best

@app.route("/ai-move", methods=["POST"])
def ai_move():
    board = request.json["board"]
    best_score = -math.inf
    best_move = -1

    for i in range(9):
        if board[i] == "":
            board[i] = "O"
            score = minimax(board, 0, False)
            board[i] = ""
            if score > best_score:
                best_score = score
                best_move = i

    return jsonify({"move": best_move})

if __name__ == "__main__":
    app.run(debug=True)
