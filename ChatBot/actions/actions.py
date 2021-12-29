# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
from typing import Any, Text, Dict, List
from pymongo.database import Database
from pymongo import MongoClient
from rasa_sdk import Action, Tracker 
from rasa_sdk.executor import CollectingDispatcher
import pymongo

# sản phẩm mắc nhất
class Actions_Price_Max(Action):
    def name(self) -> Text:
        return "cation_price_max"

    def run(self, dispatcher: CollectingDispatcher, tracker:Tracker, domain): 
        try:
            client = pymongo.MongoClient("mongodb+srv://levunguyen:nguyen0611@store-food.7txrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            db = client['store-food']
            res = db.products.find().sort("price",-1).limit(2)
            for i in res:
                name = i['name']
                price = i['price']
                img = i['images'][0]['url']
                dispatcher.utter_message("Cửa hàng hiện tại có các sản phẩm như: " + str(name) + " giá là: " + str(price) + " đồng")
                dispatcher.utter_message(image=img)
        except: 
            print("lỗi")

# sản phẩm rẻ nhất
class Actions_Price_Max(Action):
    def name(self) -> Text:
        return "cation_price_min"

    def run(self, dispatcher: CollectingDispatcher, tracker:Tracker, domain): 
        try:
            client = pymongo.MongoClient("mongodb+srv://levunguyen:nguyen0611@store-food.7txrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            db = client['store-food']
            res = db.products.find().sort("price",1).limit(2)
            for i in res:
                name = i['name']
                price = i['price']
                img = i['images'][0]['url']
                dispatcher.utter_message("Cửa hàng hiện tại có các sản phẩm như: " + str(name) + " giá là: " + str(price)+ " đồng")
                dispatcher.utter_message(image=img)
        except: 
            print("lỗi")

# sản phẩm hot nhất
class Actions_Price_Max(Action):
    def name(self) -> Text:
        return "cation_hot_product"

    def run(self, dispatcher: CollectingDispatcher, tracker:Tracker, domain): 
        try:
            client = pymongo.MongoClient("mongodb+srv://levunguyen:nguyen0611@store-food.7txrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            db = client['store-food']
            res = db.products.find().limit(2)
            for i in res:
                name = i['name']
                price = i['price']
                img = i['images'][0]['url']
                dispatcher.utter_message("Cửa hàng hiện tại có các sản phẩm như: " + str(name) + " giá là: " + str(price)+ " đồng")
                dispatcher.utter_message(image=img)
        except: 
            print("lỗi")
        
# sản phẩm đánh giá tốt
class Actions_Price_Max(Action):
    def name(self) -> Text:
        return "cation_good_ratting"

    def run(self, dispatcher: CollectingDispatcher, tracker:Tracker, domain): 
        try:
            client = pymongo.MongoClient("mongodb+srv://levunguyen:nguyen0611@store-food.7txrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            db = client['store-food']
            res = db.products.find().sort("rating",-1).limit(2)
            for i in res:
                name = i['name']
                price = i['price']
                img = i['images'][0]['url']
                dispatcher.utter_message("Cửa hàng hiện tại có các sản phẩm được đánh giá tốt như: " + str(name) + " giá là: " + str(price)+ " đồng")
                dispatcher.utter_message(image=img)
        except: 
            print("lỗi")

# sản phẩm đánh giá tốt
class Actions_Price_Max(Action):
    def name(self) -> Text:
        return "cation_bad_ratting"

    def run(self, dispatcher: CollectingDispatcher, tracker:Tracker, domain): 
        try:
            client = pymongo.MongoClient("mongodb+srv://levunguyen:nguyen0611@store-food.7txrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
            db = client['store-food']
            res = db.products.find().sort("rating",1).limit(2)
            for i in res:
                name = i['name']
                price = i['price']
                img = i['images'][0]['url']
                dispatcher.utter_message("Cửa hàng hiện tại có các sản phẩm được đánh giá chưa tốt như: " + str(name) + " giá là: " + str(price)+ " đồng")
                dispatcher.utter_message(image=img)
        except: 
            print("lỗi")