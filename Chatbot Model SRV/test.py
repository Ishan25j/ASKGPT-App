from pymongo import MongoClient

class Subjects:
    ChatbotQuery = "chatbot:query"
    ChatbotResponse = "chatbot:response"
    ReportResponse = "report:response"


db = MongoClient("mongodb://localhost:27017/conversation")
chatbot_data = db["ChatbotData"]
chats = chatbot_data["chats"]
chats.insert_one({
    "test": 1,
    "test_str": "hello testing"
})
chats.insert_one({
    "test": 2,
    "test_str": "hello testing 2"
})
chat = chats.find_one({"test": 1})
chats.update_one({"test": 1},{"test_str": "updated string"})
# print(chat)