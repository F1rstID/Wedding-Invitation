from pymongo import MongoClient
import certifi

ID = "buzz"
PW = "whis1346"

ca = certifi.where()
client = MongoClient(f"mongodb+srv://{ID}:{PW}@cluster0.zzj0qdl.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)