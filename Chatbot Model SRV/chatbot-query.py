import json
import flask_pymongo

class ChatQueryListener:
    def __init__(self) -> None:
        pass

    async def onMessage(self, message):
        self.data = json.loads(message)

    async def saveData(self, db):
        pass
    
    
