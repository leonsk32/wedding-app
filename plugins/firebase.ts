import firebase from 'firebase'
import DocumentData = firebase.firestore.DocumentData
import {firebaseConfig} from "~/plugins/firebase-config"

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const $firebase = {
  onQuestionCreated: async (rounds: any[]) => {
    await firebase
      .firestore()
      .collection('games/quiz/questions')
      // .where('authorId', '==', userId)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            rounds.push({
              id: change.doc.id,
              data: change.doc.data(),
            })
          } else if (change.type === 'removed') {
          }
        })
      })
  },

  changeQuestion: async (id: string) => {
    await firebase
      .firestore()
      .collection('games/quiz/admin')
      .doc('current')
      .update({
        id: id
      })
  },

  getQuestion: async (id: string) => {
    const docRef = await firebase
      .firestore()
      .collection('games/quiz/questions')
      .doc(id)

    try {
      const doc = await docRef.get()
      console.log(doc.data())
      if (doc.exists) {
        return doc.data()
      } else {
        console.log('No round found!')
      }
    } catch (e) {
      console.log('Error getting round info: ' + e)
    }
  },

  onQuestionChanged: async (callback: (data: DocumentData) => Promise<void>) => {
    await firebase
      .firestore()
      .collection('games/quiz/admin')
      .doc('current')
      .onSnapshot((doc) => {
        callback(doc.data()!)
      })
  },

  createPlayer: async (name: string) => {
    const docRef = await firebase.firestore().collection('games/quiz/players').add({name: name})
    return docRef.id
  },

  answer: async (questionId: string, userId: string, answer: number, point: number) => {
    await firebase
      .firestore()
      .collection('games/quiz/questions')
      .doc(questionId)
      .collection('answers')
      .add({
        userId: userId,
        answer: answer,
        point: point,
      })
  },
}
