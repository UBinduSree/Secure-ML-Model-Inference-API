import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import pickle

data = pd.read_csv("sms.tsv", sep="\t", header=None, names=["label", "message"])

data['label'] = data['label'].map({'ham': 0, 'spam': 1})

X_train, X_test, y_train, y_test = train_test_split(
    data['message'], data['label'], test_size=0.2
)

model = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', MultinomialNB())
])

model.fit(X_train, y_train)

print("Accuracy:", model.score(X_test, y_test))

with open("spam_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model saved")
