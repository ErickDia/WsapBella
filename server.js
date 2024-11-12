import app from "./app.js"
import { connectToWhatsApp, isWspConnected } from "./services/whatsApp_baylies.js";

import fs from "fs"
connectToWhatsApp();

app.get("/api/v1/send-message", async (req, res) => {
    // let tempMessage = "hola chula";
    // const number = "913207513";
    // const number = "957111457";
    // const numbers = ["957111457", "957111457", "913207513"] ;
    //     const text = `Estimado Sr@ ((nombre)) de la Unidad Móvil ((unidad)) de Taxitel,
    // le hacemos llegar la cordial invitación para el aniversario de Taxitel, para su participación puede reservar su ticket, valido para almuerzos a un costo accesible de 10 soles por pareja, hasta el 20 de Mayo.
    // Lo esperamos en Cielo 3, más información al whatsapp +51 914 509 999 `
    const text = `Hola`
    // let data = JSON.parse(`[{
    //   "unidad": "...",
    //   "nombre": "eRICK",
    //   "number": 957111457,
    //   "message": "a"
    //  }
    // ]`)
    let format = `
    C1,51948961241
    C2,51969680594
    C3,51902267727
    C4,51901521718
    C5,51913070646`

    let formatdata = format.split("\n").map((item) => {
        let formatItem = item.split(",")
        return ({
            number: parseInt(formatItem[1]),
            message: "a"
        })
    })

    console.log(formatdata);


    // let data = JSON.parse(`[{
    //   "number": 957111457,
    //   "message": "a",
    //   "name": "Erick"
    //  },
    //  {
    //   "number": 902267727,
    //   "message": "a",
    //   "name": "bella"
    //  }
    // ]`)

    let data = formatdata

    data = data.map((item) => ({ ...item, message: text }))
    const noenviados = []
    let index = 0;

    let numberWA;
    // try {
    if (!data) {
        res.status(500).json({
            status: false,
            response: "El numero no existe",
        });
    } else {


        const { status, sock } = isWspConnected()
        if (status) {

            let intervalo = setInterval(async () => {
                if (data.length > index) {
                    // antes 51
                    numberWA = "" + data[index].number + "@s.whatsapp.net";
                    let tempMessage = data[index].message;
                    let parametros = Object.keys(data[0]);
                    parametros.slice(0, 2);
                    for (let i in parametros) {
                        console.log(i);
                        tempMessage = tempMessage.replaceAll(`((${parametros[i]}))`, data[index][parametros[i]])
                    }

                    index += 1
                    const exist = await sock.onWhatsApp(numberWA);

                    if (exist?.jid || (exist && exist[0]?.jid)) {
                        sock
                            .sendMessage(exist.jid || exist[0].jid, {
                                // image: fs.readFileSync("./image.jpg"),
                                // caption: tempMessage,
                                text: tempMessage,
                            })
                            .then((result) => {
                                // res.status(500).json({
                                //   status: false,
                                //   response: err,
                                // });
                            })
                            .catch((err) => {
                                // res.status(500).json({
                                //   status: false,
                                //   response: err,
                                // });
                                noenviados.push(data[index - 1])
                            });
                    } else {
                        console.log("no paso");
                        noenviados.push(data[index - 1])
                    }
                } else {
                    clearInterval(intervalo);
                    res.status(200).json({
                        status: true,
                        response: "todo bien",
                        noenviados
                    });
                }


            }, 8000)



        } else {
            res.status(500).json({
                status: false,
                response: "Aun no estas conectado",
            });
        }
    }
    // } catch (err) {
    //   res.status(500).json({
    //     status: false,
    //     error: err,
    //     message: "ocurrio un error de codigo",
    //   });
    // }
});


app.get('/api/v1/', (req, res) => res.send('hola a todos desde el back del ioterapia'))

const port = 5000;
app.listen(port, () => {
    console.log(`Servidor en linea 🤖\nPuerto: ${port}`);
})