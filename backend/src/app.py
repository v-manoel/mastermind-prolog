from flask import Flask, jsonify, request
from app.models.game import Game


app = Flask(__name__)
game = Game()

@app.route('/start', methods=['POST'])
def game_start():
    secret_code: list = request.json['secretCode']

    game.start(secret_code)

    response = {
        'guess': game.get_current_guess(),
        'secretCode': game.get_secret_code() 
    }

    return jsonify(response), 200

@app.route('/feedback', methods=['POST'])
def game_turn():
    feedback: list = request.json['feedback']
    game.feedback_turn(feedback)

    game_status = game.status()
    response = {
        'status': game_status[0],
        'message': game_status[1],
        'guess': game.get_current_guess()
    }

    return jsonify(response), 200

@app.route('/status', methods=['GET'])
def game_status():

    game_status = game.status()
    response = {
        'status': game_status[0],
        'message': game_status[1],
    }

    return jsonify(response), 200

if __name__ == '__main__':
    app.run()
 