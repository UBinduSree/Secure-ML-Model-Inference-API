import pickle

# Load trained model
with open("spam_model.pkl", "rb") as f:
    model = pickle.load(f)

message = ["Congratulations! You won a free lottery"]

prediction = model.predict(message)

if prediction[0] == 1:
    print("Spam")
else:
    print("Not Spam")