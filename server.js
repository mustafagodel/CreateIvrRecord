const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());




const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'ivr1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


app.post("/api/tutorials", (req, res) => {
    const ivrList = req.body.ivrList;
    const { ivrAdi, ivrKodu, duyuru, zamanAsimiSuresi, zamanAsimiSesKaydi, zamanAsimiTekrarSayisi, hataliGirisSesKaydi, hataliGirisTekrarSayisi } = req.body;


    const insertSql = 'INSERT INTO ivr_tablo2 (ivrAdi, ivrKodu, duyuru, zamanAsimiSuresi, zamanAsimiSesKaydi, zamanAsimiTekrarSayisi, hataliGirisSesKaydi, hataliGirisTekrarSayisi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ivrAdi, ivrKodu, duyuru, zamanAsimiSuresi, zamanAsimiSesKaydi, zamanAsimiTekrarSayisi, hataliGirisSesKaydi, hataliGirisTekrarSayisi];

    pool.query(insertSql, values, (err, result) => {
        if (err) {
            console.error("Data insertion error:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }


        const ivr_id = result.insertId;
        console.log("Data inserted successfully");

        const insertTuslamaSql = 'INSERT INTO ivr_tuslama1 (ivr_id, ivrTuslama, ivrHedefTipi, hedef) VALUES ?';
        const tuslamaValues = ivrList.map(ivr => [ivr_id, ivr.ivrTuslama, ivr.ivrHedefTipi, ivr.hedef]);

        console.log(tuslamaValues);


        pool.query(insertTuslamaSql, [tuslamaValues], (insertTuslamaErr, insertTuslamaResult) => {
            if (insertTuslamaErr) {
                console.error('Error inserting IVR button data: ' + insertTuslamaErr.stack);

                res.status(500).json({ error: "Error inserting IVR button data" });
            } else {
                console.log('IVR button data inserted successfully');

                res.status(201).json({ message: "Data inserted successfully" });
            }
        });
        createIVRContexts(res,ivrList)
    });
});
function createIVRContexts(res,ivrList) {
    const ivrQuery = 'SELECT * FROM ivr_tablo2';

    pool.query(ivrQuery, (ivrErr, ivrResults) => {
        if (ivrErr) {
            console.error('IVR verileri alınırken hata oluştu: ' + ivrErr.stack);
            res.status(500).send('IVR verileri alınırken hata oluştu');
            return res;
        }


        const ivrContexts = createIVRContextsFromData(ivrResults, ivrList);




        updateAsteriskConfig(ivrContexts);


    });
}
function createIVRContextsFromData(ivrData,ivrList) {


    const ivr = ivrData[ivrData.length - 1];

    const ivrContext = [];


    const tuslamalar = ivrList.map(ivr => ivr.ivrTuslama);
    const ivrHedefTipi = ivrList.map(ivr => ivr.ivrHedefTipi);
    const hedef = ivrList.map(ivr => ivr.hedef);
    ivrContext.push(`
    [${ivr.ivrAdi}]
exten => s,1,Answer()
same => n,GotoIfTime(05:00-00:00,*,*,*?mesai)
same => n,Playback(custom/mesai)
same => n,Hangup()
same => n(mesai),NoOp(Mesai başladı)
same => n,Playback(custom/start)
same => n(tekrar),Background(custom/${ivr.duyuru})
same => n,WaitExten(10)`.trim());

    for (let i = 0; i < tuslamalar.length; i++) {
        const tuslama = tuslamalar[i];
        const hedefTipi = ivrHedefTipi[i];
        const hedefDeger = hedef[i];

        let hedefKod;
        if (hedefTipi === 'Queue') {
            hedefKod = `${hedefTipi}(${hedefDeger})`;
        } else {
            hedefKod = `${hedefTipi}(PJSIP/${hedefDeger})`;
        }

        ivrContext.push(`
exten => ${tuslama},1,NoOp(${tuslama}'i tuşladınız)
same => n,Playback(custom/baglaniyor)
same => n,${hedefKod}
same => n,Hangup()`.trim());
    }

    ivrContext.push(`
exten => t,1,Wait(${ivr.zamanAsimiSuresi})
same => n,Playback(custom/${ivr.zamanAsimiSesKaydi})
same => n,Goto(${ivr.ivrAdi}s,tekrar)

exten => i,1,Set(hataliGirisSayisi=0) ; Hatalı giriş sayısını sıfırla
same => n,Set(hataliGirisSayisi=$[hataliGirisSayisi+1])
same => n,GotoIf($[hataliGirisSayisi < ${ivr.hataliGirisTekrarSayisi}]?tekrar1:exit)

 exten => tekrar1,1,Background(custom/${ivr.hataliGirisSesKaydi}) 
 same => n,Goto(${ivr.ivrAdi}},s,tekrar)
 same=> n(exit),Hangup()
 
 `.trim());




    return ivrContext.join('\n\n');

}

function updateAsteriskConfig(ivrContexts) {
    const asteriskConfigPath = '/Users/mustafagodel/Desktop/deneme1.conf';


    fs.writeFileSync(asteriskConfigPath, ivrContexts);
}


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
