import asyncio
from nats.aio.client import Client as NATS
from stan.aio.client import Client as STAN
import os
from model import Model
from pymongo import MongoClient

class ResponseStatus:
    Query = 'chatbot:query-pending'
    Responded = 'chatbot:responded'
    Reported = 'chatbot:response-reported'

class NatsCommunications:
    def __init__(self, generator: Model, db: MongoClient) -> None:
        self.generator = generator
        self.db = db
        self.db_chatbot_data = db["ChatbotData"]
        self.db_report_Response = db["ReportResponse"]
        self.chats = self.db_chatbot_data["chats"]
        self.reports = self.db_chatbot_data["reports"]

    async def run(self, loop):
    
        self.nc = NATS()
        await self.nc.connect(servers=[os.environ.get('NATS_URL')],io_loop=loop)

        self.sc = STAN()
        await self.sc.connect(os.environ.get('NATS_CLUSTER_ID'), os.environ.get('NATS_CLIENT_ID'), nats=self.nc)
    
    async def publish(self, subject, message):
        await self.sc.publish(subject=subject, payload=message.encode())
    
    def subscribe(self, subject):
        async def msg_handler(msg):
            print(f"Received message on '{msg.subject}': {msg.data.decode()}")
            self.msg = msg.data.decode()
            await self.getResponse()
        
        self.sc.subscribe(subject=subject, cb=msg_handler)
        
    async def getResponse(self):
        userId = self.msg.data["userId"]
        textId = self.msg.data["userId"]
        text = self.msg.data["text"]
        status = self.msg.data["status"]
        if status == ResponseStatus.Query:
            self.generator.preprocess(text)
            generated_text = await self.generator.generate_output()
            chat_insert = {
                "userId": userId,
                "textId": textId,
                "text": text,
                "status": ResponseStatus.Responded,
                "response": generated_text
            }
            chat = self.chats.insert_one(chat_insert)
            print(chat)

    
    def sigint_handler(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.sc.close())
        loop.run_until_complete(self.nc.close())
        loop.stop()
        print('NAT connection closed')
    
    def sigterm_handler(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.sc.close())
        loop.run_until_complete(self.nc.close())
        loop.stop()
        print('NAT connection closed')