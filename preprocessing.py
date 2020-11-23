import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import Dense,SimpleRNN

class Preprocessing:
    def __init__(self):
        self.label_encoder = LabelEncoder()
        self.scaler = MinMaxScaler(feature_range=(0, 1))

    def load_csv(self, data):
        return pd.read_csv(data)

    def load_excel(self, data):
        return pd.read_excel(data)

    def drop_column(self, data, column):
        return data.drop(columns=column, axis=1)

    def encoder(self, data, column):
        values = data[column]
        integer_encoded = self.label_encoder.fit_transform(values)
        data[column] = integer_encoded
        return data

    def decoder(self,data, column):
        values = data[column]
        data[column] = self.label_encoder.inverse_transform(values)
        return data

    def split_data(self, data, test_size=0.2, random_state=None):
        X = data[:,[1]]
        y = data[:,0]
        y = y.reshape(-1,1)
        print()
        X_scaled = self.scaler.fit_transform(X)
        y_scaled = self.scaler.fit_transform(y)
        
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size = test_size,
                                                            random_state=random_state)
        return X_train, X_test, y_train, y_test
    
    def normalize(self,data):
        dataset = self.scaler.fit_transform(np.reshape(data[:,1],(-1,1)))
        data[:,1] = np.reshape(dataset,(1,-1))
        print(data)
        return data