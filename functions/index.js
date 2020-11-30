// const functions = require('firebase-functions');
const express = require('express')
const admin = require('firebase-admin');
const app = express()

const functions = require('firebase-functions')

const cors = require('cors')

admin.initializeApp()

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions-
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

app.use(cors({ origin: true }))

app.get('/', (req, res) => {
  res.send({
    message : "hello"
  })
})

app.get('/allnotsold', async (req, res) => {
  try {
    
    const snapshot = await db.collection("docs").where('sold', '==', false).get()
    

    const results  = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push(doc.data())
    })


    res.send({
      data: results
    }) 

  } catch (error) {
    console.error(error);
  }
})


app.get('/all', async (req, res) => {
  try {
  
    
    const snapshot = await db.collection("docs").get()

    const results  = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push({
        id: doc.id,
        data: doc.data()
      })
    })

    res.send({
      data: results
    }) 
  } catch (error) {
    console.error(error);
  }
})

//pencari

//kepunyaan 
app.get('/currentlybuy/:uid', async (req, res) => {
  try {
    const uid = req.params.uid
    if (body == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }
    
    const snapshot = await db.collection("docs").where('pencari', 'array-contains', uid)

    const results  = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push({
        id: doc.id,
        data: doc.data()
      })
    })
  

    res.send({
      data: results
    }) 
  } catch (error) {
    console.error(error);
  }
})

//search by keyword
app.post('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword
    

    const snapshot = await db.collection("docs").where('tags', "array-contains", keyword)


    const results  = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push({
        id: doc.id,
        data: doc.data()
      })
    })

    res.send({
      
      data: results
    }) 
  } catch (error) {
    console.error(error);
  }
})

//buy the docs
app.post('/buy', async (req, res) => {
  try {
    const { docid, uid } = req.body
    
    if (body == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }
    
    const snapshot = await db.collection("docs")
      .doc(docid)
      .update(
        {
          sold: true,
          pencari: admin.firestore.FieldValue.arrayUnion(`${uid}`)
        })
    
    const results  = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push({
        id: doc.id,
        data: doc.data()
      })
    })

    res.send({
      data: results
    }) 

  } catch (error) {
    console.error(error);
  }
})


//PEMBAGI

//submit new docs
app.post('/submit', async (req, res) => {
  try {
    const body = req.body
    const mapinput = {}
    if (body == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }

    for (let key in body) {
      mapinput[key] = body[key]
      
    }

    console.log(mapinput);
    
    const result = await db.collection("docs").add(mapinput)

    res.send({
      data: result
    }) 
  } catch (error) {
    console.error(error);
  }
})

//update everything 
app.post('/update/:id',  async (req, res) => {
  try {
    const body = req.body
    const mapinput = {}
    if (body == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }

    for (let key in body) {
      mapinput[key] = body[key]
      // console.log(key, body[key]);
    }
    
    const result = await db.collection("docs").add(mapinput)

    res.send({
      
      data: result
    }) 
  } catch (error) {
    console.error(error);
  }
})

//currently sell by the userid
app.post('/currentlysell/:uid', async (req, res) => {
  try {
    const { uid } = req.params
  
    if (uid == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }

    const result = await db.collection("docs").where('pembagi', 'array-contains', uid)

    res.send({
      data: result
    }) 
  } catch (error) {
    console.error(error);
  }
})


// const PORT = 500s

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


module.exports = {
  app
}