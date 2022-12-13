from pymongo import MongoClient
import certifi

ID = "test"
PW = "sparta"

ca = certifi.where()
client = MongoClient(f'mongodb+srv://{ID}:{PW}@cluster0.zz6rnhk.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)