import pandas as pd
import numpy as np
from tensorflow.keras.layers import Dense,SimpleRNN
from tensorflow.keras.models import Sequential
from tensorflow.keras import backend as K
from tensorflow.keras.optimizers import SGD, Adagrad, RMSprop, Adadelta, Adamax, Adam
from tensorflow.keras.models import model_from_json
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt
import math


class Model:
    def __init__(self, neuron=8, optimizer="Adam", epoch=10, batch_size=16, dim=1):
        self.neuron = neuron
        self.optimizer = optimizer
        self.epoch = epoch
        self.batch_size = batch_size
        self.dim = dim

    def training(self, X_train, X_test, y_train, y_test, preprocessing):
        model = Sequential()
        model.add(Dense(1, input_dim=self.dim, activation='relu'))  # inputlayer
        model.add(Dense(self.neuron, activation='relu'))  # hiddenlayer
        model.add(Dense(1, activation='linear'))  # outputlayer
        
        model.add(SimpleRNN(units=32, input_shape=(1,30), activation="relu"))
        model.add(Dense(8, activation='relu'))
        model.add(Dense(1))
        
        if 'SGD' in self.optimizer:
            opt = SGD(lr=0.001)
            
        if 'RMSProp' in self.optimizer:
            opt = RMSprop(lr=0.001)

        if 'Adgrad' in self.optimizer:
            opt = Adgrad(lr=0.001)
            
        if 'Adamax' in self.optimizer:
            opt = Adamax(lr=0.001)

        if 'Adam' in self.optimizer:
            opt = Adam(lr=0.001)

        if 'Adadelta' in self.optimizer:
            opt = Adadelta(lr=0.001)
            
        model.compile(loss='mean_squared_error', optimizer=opt)
        history = model.fit(X_train,
                            y_train,
                            epochs=self.epoch,
                            batch_size=self.batch_size,
                            verbose=1, validation_data=(X_test,y_test),
                            callbacks=[EarlyStopping(monitor='val_loss', patience=10)],shuffle=True
                           )

        # save history
        loss_history = history.history["loss"]
        testing_loss_history = history.history["val_loss"]
        
        loss = np.array(loss_history)
        np.savetxt("static/loss_history_beta.txt", loss, delimiter=",")
        
        tes_loss = np.array(testing_loss_history)
        np.savetxt("static/testing_loss_history_beta.txt", tes_loss, delimiter=",")

        model_json = model.to_json()
        with open("model.json", "w") as json_file:
            json_file.write(model_json)

        model.save_weights('model.h5')
        
        
        testPredict = model.predict(X_test)
        testPredict = preprocessing.scaler.inverse_transform(testPredict)
        
        # Estimate model performance
        trainScore = model.evaluate(X_train, y_train, verbose=0)
        print('Train Score: %.5f MSE (%.5f RMSE)' % (trainScore, math.sqrt(trainScore)))
        testScore = model.evaluate(X_test, y_test, verbose=0)
        print('Test Score: %.5f MSE (%.5f RMSE)' % (testScore, math.sqrt(testScore)))
        trainScore = trainScore
        testScore = testScore
        rmseTrain = math.sqrt(trainScore)
        rmseTest = math.sqrt(testScore)
        score = np.array([trainScore,testScore,rmseTrain,rmseTest])
        np.savetxt("static/score.txt",score, delimiter=";")
        
        # plot baseline and predictions
        
        real_district = preprocessing.label_encoder.fit_transform(X_test[:,0])
        # real_district = preprocessing.label_encoder.inverse_transform(X_test[:,0])
       
        y_pred = model.predict(X_test)
        y_predict_sample_orig = preprocessing.scaler.inverse_transform(y_pred)
        y_test = preprocessing.scaler.inverse_transform(np.reshape(y_test,(-1,1)))
        
        y_predict_sample_orig = y_predict_sample_orig.astype(int)
        
       
        df = pd.DataFrame({'Kecamatan': real_district.flatten(),'Aktual': y_test.flatten(), 'Prediksi': y_predict_sample_orig.flatten()})
        df.to_csv('training_result.csv',index=False)
        K.clear_session()
    
    def data_prediction(self, path, preprocessing):
    
        df = preprocessing.load_csv(path)
        df.sort_values(by='Bulan', ascending=True)
        df = preprocessing.drop_column(df,['Tahun','Suhu','Kelembapan','Curah_hujan',
                        'Lama_penyinaran_matahari','Angin','Jumlah_penduduk','IR'])
        df['total_kasus'] = df['Jumlah Kasus']
        df = preprocessing.drop_column(df,['Bulan','Jumlah Kasus'])
        df = preprocessing.encoder(df,'Kecamatan')
        df = df.values
        X = df[:,0]
        X = X.reshape(-1,1)
      
        Y_test = preprocessing.scaler.fit_transform(X)
        return Y_test

    def soft_acc(self, y_true, y_pred):
        return K.mean(K.equal(K.round(y_true), K.round(y_pred)))

    def load_model(self, path):
        # load json file
        json_file = open(path+".json", "r")
        loaded_model_json = json_file.read()
        json_file.close()

        # load weight
        model = model_from_json(loaded_model_json)
        model.load_weights(path+".h5")

        model.compile(loss='mean_squared_error', optimizer='Adam', metrics=[self.soft_acc])
        
        model.summary()
        print('Model Loaded')
        return model

    def prediction(self,data,start_month,end_month,year,preprocessing):
        model = self.load_model('model')
        
        show_temp = np.zeros((4,), dtype="int")
        
        for month in range(end_month):
            predict = model.predict(data)
            predict = preprocessing.scaler.inverse_transform(np.reshape(predict,(-1,1))) #amount of case
            new_data = np.zeros(4, ) #  temp of array [0. ,0., 0., 0.]
            x = 0
            real_district = preprocessing.label_encoder.fit_transform(data[:,0]).astype('float32')
            print('real_district',real_district)
            for i in data:
                temp = np.array((start_month,year,real_district[x])) # temp numpy array(start_month, year, district)
                # new numpy array(start_month, year, district, prediction)
                new_data = np.vstack((new_data, np.append(temp, predict[x])))
                x += 1
            new_data = np.delete(new_data, 0, axis=0)
            
            result = new_data
            result = np.rint(result)
            district = result[:, 2]
            
            district = district.astype(int)
            # decode_district = decoder(district)
            start_month += 1
            if start_month>12:
                year+=1
                start_month=1

            show = result
            show = show.astype("int")
            # show[:, 2] = decode_district
            
            df = pd.DataFrame(show)
            show_temp = np.vstack((show_temp, show))
            
            print("month-", month)
            
            
            # data_pred = result[:,2:4]
            # data_pred = normalize(data_pred)
            
        show_temp = np.delete(show_temp, 0, axis=0)
        new_df = pd.DataFrame(show_temp)
        list_of_district = [
            'Baiturrahman',
            'Banda Raya',
            'Jaya Baru',
            'Kuta Alam',
            'Kuta Raja',
            'Lueng Bata',
            'Meuraxa',
            'Syiah Kuala',
            'Ulee Kareng'
        ]
        new_df.columns = ['Bulan ke','Tahun','Kecamatan', 'Jumlah Kasus']
        new_df['Kecamatan'] = new_df.apply(lambda row: list_of_district[row.Kecamatan],axis=1)
        print(new_df)
        
        new_df.to_csv('prediction_result.csv',index=False)
        K.clear_session()
        
        return 'Prediction saved'

    def save_image(self):
        data = pd.read_csv("static/loss_history_beta.txt")
        data = data.values
        data2= pd.read_csv("static/testing_loss_history_beta.txt")
        data2 = data2.values
        # summarize history for loss
        plt.plot(data)
        plt.plot(data2)
        plt.title('model loss')
        plt.ylabel('loss')
        plt.xlabel('epoch')
        plt.legend(['train','test'], loc='upper left')
        plt.show()
        plt.savefig('static/loss.png')

        data = pd.read_csv("static/testing_loss_history_beta.txt")
        data = data.values
        
        # summarize history for loss
        plt.plot(data)
        plt.title('model test loss')
        plt.ylabel('loss')
        plt.xlabel('epoch')
        plt.legend(['test'], loc='upper left')
        plt.show()
        plt.savefig('static/loss_test.png')
