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
        currentQuestionId: id
      })
  },

  changeStatus: async (status: string) => {
    await firebase
      .firestore()
      .collection('games/quiz/admin')
      .doc('current')
      .update({
        currentStatus: status
      })
  },

  createRound: async () => {
    const docRef = await firebase.firestore().collection('games/quiz/rounds').add({})

    await firebase
      .firestore()
      .collection('games/quiz/admin')
      .doc('current')
      .update({
        currentRoundId: docRef.id
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
        console.log('No question found!')
      }
    } catch (e) {
      console.log('Error getting question: ' + e)
    }
  },

  onCurrentChanged: async (callback: (data: DocumentData) => Promise<void>) => {
    await firebase
      .firestore()
      .collection('games/quiz/admin')
      .doc('current')
      .onSnapshot((doc) => {
        callback(doc.data()!)
      })
  },

  createPlayer: async (roundId: string, name: string) => {
    const docRef = await firebase.firestore()
      .collection('games/quiz/rounds')
      .doc(roundId)
      .collection('players')
      .add({name: name})

    return docRef.id
  },

  submitAnswer: async (roundId: string, questionId: string, playerId: string, playerName: string, answer: number, point: number) => {
    await firebase
      .firestore()
      .collection('games/quiz/rounds')
      .doc(roundId)
      .update({
        answers: firebase.firestore.FieldValue.arrayUnion({
          questionId: questionId,
          playerId: playerId,
          playerName: playerName,
          submitAnswer: answer,
          point: point,
        })
      })
  },

  onRoundUpdated: async (roundId: string, callback: (data: DocumentData) => Promise<void>) => {
    await firebase
      .firestore()
      .collection('games/quiz/rounds')
      .doc(roundId)
      .onSnapshot((doc) => {
        callback(doc.data()!)
      })
  },
}
