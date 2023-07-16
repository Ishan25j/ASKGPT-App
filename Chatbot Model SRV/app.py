from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from model import Model
# from flask_pymongo import PyMongo
from flask import render_template
from nats_stream import NatsCommunications
from pymongo import MongoClient
import os
import asyncio

class Subjects:
    ChatbotQuery = "chatbot:query"
    ChatbotResponse = "chatbot:response"
    ReportResponse = "report:response"

app = Flask(__name__)

CORS(app)

global generator

# @app.before_first_request
# def runthis():
#     print("Running this before first")
#     generator = Model()
#     generator.load_model()

api = Api(app)

class Conversations(Resource):

    def post(self):

        parser = request.args
        print(parser)
        data = request.get_json()

        # userid = data["userid"]
        # textid = data["textid]
        # text = data["text"]
        # generator.preproce"ss(text)
        # generated_text = generator.generate_output()
        # db.todos.insert_one({'userid': userid, 'textid': textid, 'text': text, 'generated_text': generated_text})
        response = jsonify('success')
        response.status_code = 200
        print(response)
        return response
    
class JustSee(Resource):
    def get(self):
        # response = jsonify('success')
        # response.status_code = 200
        return "<h1>Everything is good</h1>"

api.add_resource(Conversations, '/chatbot')
api.add_resource(JustSee, '/')

def NatsConfig(generator, db):
    nats = NatsCommunications(generator, db)
    nats.run()
    nats.sigint_handler()
    nats.sigterm_handler()
    try:
        loop = asyncio.get_event_loop()
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()

    # nats.subscribe(Subjects.ChatbotQuery)

if __name__ == '__main__':
    if not os.environ.get("MONGO_URL"):
        raise ConnectionError("MONGO_URL is not defined")
    if not os.environ.get("JWT_KEY"):
        raise ConnectionError("JWT_KEY is not defined")
    if not os.environ.get("NATS_URL"):
        raise ConnectionError("NATS_URL is not defined")
    if not os.environ.get("NATS_CLUSTER_ID"):
        raise ConnectionError("NATS_CLUSTER_ID is not defined")
    if not os.environ.get("NATS_CLIENT_ID"):
        raise ConnectionError("NATS_CLIENT_ID is not defined")
    generator = Model()
    generator.load_model()
    db = MongoClient(os.environ.get("MONGO_URL"))
    asyncio.run(NatsConfig())
    app.run(host="0.0.0.0",debug=True, use_reloader=False)