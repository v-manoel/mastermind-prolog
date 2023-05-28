from ..decorators.singleton import singleton
import threading
from swiplserver import PrologMQI
from typing import List

@singleton
class PrologServer:
    __slots__ = ['prolog', 'thread']

    def __init__(self,   consult_files: List[str] = []) -> None:
        prolog = PrologMQI()
        self.thread = prolog.create_thread()
        self.load(consult_files)


    def load(self, consult_files) -> None:
        for file in consult_files:
            try:
                self.thread.query(f'consult("{file}")')
            except:
                print(f'Could not load file {file}.')


    def ask(self, predicate: str = '', args: List[str] = []):
        predicate_args: str = ','.join([str(arg) for arg in args])
    
        result = self.thread.query(f'{predicate}({predicate_args})')
        return result
    
    def assign(self, predicate: str = '', var: str = 'x'):
        var = var.capitalize()
        response = None

        results = self.thread.query(f'{predicate}({var})')

        for solution in results: # type: ignore
            response = solution[var] # type: ignore

        return response
    
    def stop(self) -> None:
        self.thread.stop()
        