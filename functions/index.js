// const functions = require('firebase-functions');
const express = require('express')
const admin = require('firebase-admin');
const app = express()



const functions = require('firebase-functions')
const cors = require('cors')
admin.initializeApp()

const db = admin.firestore();


app.use(cors({ origin: true }))

app.get('/', (req, res) => {
  res.send({
    message : "hello"
  })
})


//sold and unsold tugas; yes
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

//all of sold and unsold; yes
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

//kepunyaan ; yes
app.get('/currentlybuy/:uid', async  (req, res) => {
  try {
    const uid = req.params.uid

    console.log(uid);
    if (uid == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }
    
    db.collection("docs").where('pencari', 'array-contains', uid)
      .get()
      .then(function (querySnapshot) {
          let docres = []
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            const data = doc.data()
            data.id = doc.id
            docres.push(data)
          });
        
        console.log(`this is docsres: ${docres}`);
        res.json({
          uid: uid,
          data: docres
        })

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  } catch (error) {
    console.error(error);
  }
})

//search by keyword
app.get('/search/:tag', async (req, res) => {
  try {
    const tag = req.params.tag
  
    const snapshot = await db.collection("docs").where('tags', "array-contains", tag)
    
    let results = []
    snapshot.forEach(doc => {
      console.log(doc.id);
      results.push({
        id: doc.id,
        data: doc.data()
      })
    })

  } catch (error) {
    console.error(error);
  }
})

//buy the docs
app.post('/buy', async (req, res) => {
  try {

    const did = req.body.did
    const uid = req.body.uid
    
    const docref = db.collection('docs').doc();

    const unionRes = await docref.update({
      sold: true, 
      pencari: admin.firestore.FieldValue.arrayUnion(uid)
    });
    
    res.json(unionRes)

  } catch (error) {
    res.json(error)
  }

})


//PEMBAGI REST API

//submit new docs; yes 
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

    res.json({
      data: result
    }) 

  } catch (error) {
    console.error(error);
  }
})

//update  docs everything ; done
app.post('/update/:did',  async (req, res) => {
  try {
    const did = req.params.did
    const body = req.body
    const mapupdate = {}
    if (body == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }

    for (let key in body) {
      mapupdate[key] = body[key]
    }

    console.log(mapupdate);
    
    const result = await db.collection("docs")
      .doc(did)
      .update(mapupdate)

    res.json({
      data: result
    }) 
  } catch (error) {
    res.json(error)
  }
})

//pembagi currently sell; yes
app.get('/currentlysell/:uid', async  (req, res) => {
  try {
    const uid = req.params.uid

    console.log(uid);
    if (uid == undefined) {
      createHttpError(400, 'The body doesnt exist')
    }
    
    db.collection("docs").where('pembagi', '==', uid)
      .get()
      .then(function (querySnapshot) {
          let docres = []
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            const data = doc.data()
            data.id = doc.id
            docres.push(data)
          });
        
          console.log(`this is docsres: ${docres}`);
          res.json({
            uid: uid,
            data: docres
          })

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  } catch (error) {
    console.error(error);
  }
})



// const PORT = 500s

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


exports.app = functions.https.onRequest(app);