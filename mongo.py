from pymongo import MongoClient
import certifi

ID = "buzz"
PW = "whis!346"

ca = certifi.where()
# client = MongoClient(f'mongodb+srv://{ID}:{PW}@shinjungwan.pvw0aqx.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
# client = MongoClient(f'mongodb+srv://{ID}:{PW}@shinjungwan.pvw0aqx.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
client = MongoClient(
    "mongodb+srv://buzz:whis1346@cluster0.zzj0qdl.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)

# sparata-sjw
