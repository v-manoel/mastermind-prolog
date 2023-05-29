from ..singletons.prolog_mqi import PrologServer
from typing import List

class Settings:
    __slots__ = ['prolog']

    def __init__(self):
        self.prolog = PrologServer()

    def set_guess_limit(self, guess_limit: int) -> bool:
        try:
            self.prolog.ask('set_guess_limit',[str(guess_limit)])
        except:
            return False
        return True

    def set_code_visibility(self, show_code: bool) -> bool:
        try:
            self.prolog.ask('set_code_visibility',[str(show_code)])
        except:
            return False
        return True

    def set_secret_code(self, secret_code: List[int]) -> bool:
        try:
            self.prolog.ask('set_guess_limit',[str(item) for item in secret_code])
        except:
            return False
        return True
    
    def get_guess_limit(self) -> int:
        guess_limit: int = -1
        try:
           result = self.prolog.assign('guess_limit')
           guess_limit = int(result) if result else -1
        except:
            return guess_limit
    
        return guess_limit
    
    def get_code_visibility(self) -> bool:
        code_visility: bool = False
        try:
           code_visility = bool(self.prolog.assign('code_visibility'))

        except:
            return code_visility
    
        return code_visility
    
    def get_secret_code(self) -> list:
        secret_code: list = []
        try:
           secret_code = self.prolog.assign('secret_code') # type: ignore
        except:
            return secret_code
    
        return secret_code

        