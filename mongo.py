from pymongo import MongoClient
import certifi

ID = "test"
PW = "sparta"

ca = certifi.where()
client = MongoClient(f'mongodb+srv://{ID}:{PW}@shinjungwan.pvw0aqx.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)