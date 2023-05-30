from singletons.prolog_mqi import PrologServer
from models.settings import Settings
from typing import List, Tuple

class Game:
    __slots__ = ['prolog','game_result','__settings__','has_game_ended', 'result_codes']

    def __init__(self):
        self.prolog = PrologServer([
        'prolog/utils.pl',
        'prolog/settings.pl',
        'prolog/agent.pl',
        'prolog/controller.pl'
        ])
        self.__settings__ = Settings()

        self.has_game_ended = False
        self.result_codes: dict = {
            'lose': {'code': 0, 'message': 'Sinto Muito! Excedeu o número de tentativas !'},
            'win': {'code': 1, 'message': 'Parabéns! O agente venceu o jogo'},
            'continue': {'code': 2, 'message': 'Continue ...'},
            'invalid': {'code': -1, 'message': 'Sinto Muito: Sequência de Feedback Inválida'}
        }

    def start(self, secret_code = None) -> bool:
        try:
            if(secret_code):
                formated_code: str = ','.join([str(item) for item in secret_code])
                formated_code = f'[{formated_code}]'
                self.prolog.ask('run',[formated_code])
            else:
                self.prolog.ask('run')
        except:
            return False
        
        self.has_game_ended = False
        return True

    def feedback_turn(self, feedback: list) -> list:
        new_guess: list = []
        try:
            formated_feedback: str = ','.join([str(item) for item in feedback])
            formated_feedback = f'[{formated_feedback}]'
            result = self.prolog.ask('turn',[formated_feedback])
            self.has_game_ended = not result

            new_guess = self.get_current_guess()
        except:
            return new_guess
        return new_guess

    def get_turn_states(self) -> List[list]:
        turn_states: list = []
        try:
           turn_states = self.prolog.assign('turn_states') # type: ignore
        except:
            return turn_states
    
        return turn_states

    def get_current_guess(self) -> list:
        current_guess: list = []
        try:
           current_guess = self.prolog.assign('current_guess_code') # type: ignore
        except:
            return current_guess
    
        return current_guess
    
    def get_last_feedback(self) -> list:
        feedback: list = []
        try:
           feedback = self.prolog.assign('feedback') # type: ignore
        except:
            return feedback
    
        return feedback

    def status(self) -> Tuple[int, str]:
        response = self.result_codes['continue']
        
        if not self.has_game_ended:
            return (response['code'], response['message'])
   
        result = self.prolog.assign('game_result') # type: ignore

        status_key = result
        if type(result) == list and len(result) == 0:
            status_key = 'invalid'
            
        response = self.result_codes[status_key]
    
        return (response['code'], response['message'])
         

    def settings(self) -> Settings:
        return self.__settings__
    
    def get_secret_code(self) -> list:
        return self.__settings__.get_secret_code()
    
    def finish(self) -> None:
        self.prolog.stop()


        